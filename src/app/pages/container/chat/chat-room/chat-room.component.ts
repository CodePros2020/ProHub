import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {DatePipe} from '@angular/common';
import {ChatService} from '../../../../shared-services/chat.service';
import {map} from 'rxjs/operators';
import {ChatModel} from '../manager/chat.model';
import {AuthService} from '../../../../shared-services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {ImageUploadDialogComponent} from './image-upload-dialog/image-upload-dialog.component';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ChatMessagesService} from "../../../../shared-services/chat-messages.service";
import {ChatMessagesModel} from "../manager/chat-messages.model";
import {AngularFireList} from "@angular/fire/database/interfaces";
pdfMake.vfs = pdfFonts.pdfMake.vfs;



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnChanges {

  @Input() chatMessageId;
  @Input() chatMessageName;

  @ViewChild('chatContent') chatContent: ElementRef;
  scrollTop: number = null;

  chatForm: FormGroup;
  chatModel: ChatModel;
  loggedInUserPhoneNumber = '';
  message = '';
  chats = [];
  matcher = new MyErrorStateMatcher();
  chatsToBeUpdatedToChatSeen = [];
  chatsWithImagesToBeUpdatedToChatSeen = [];

  constructor(private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private chatService: ChatService,
              private chatMessageService: ChatMessagesService,
              private authService: AuthService,
              public datePipe: DatePipe) {
    this.loggedInUserPhoneNumber = this.authService.GetUserInSession().phoneNumber;
    this.createChatFormGroup();
  }

  ngOnInit(): void {
    this.retrieveChats();
    console.log('what is the chat message id in chat room: ', this.chatMessageId);
  }

  ngOnChanges() {
    // console.log('chat message in on changes', this.chatMessageId);
    this.retrieveChats();
  }

  retrieveChats() {
    if (this.chatMessageId !== undefined) {
      this.chatService.getAll(this.chatMessageId).snapshotChanges().pipe(
        map(chats =>
          chats.map(c =>
            ({key: c.payload.key, ...c.payload.val()})
          ))
      ).subscribe(data => {
        this.chats = [];
        this.chatsToBeUpdatedToChatSeen = [];
        this.chatsWithImagesToBeUpdatedToChatSeen = [];
        data.forEach(res => {
          this.chatModel = new ChatModel();
          this.chatModel.chatId = res.key;
          this.chatModel.chatMessageId = res.chatMessageId;
          this.chatModel.chatSeen = res.chatSeen;
          this.chatModel.fullName = res.fullName;
          this.chatModel.message = res.message;
          this.chatModel.phoneNumber = res.phoneNumber;
          this.chatModel.timeStamp = res.timeStamp;
          this.chatModel.imageUrl = res.imageUrl;
          this.chats.push(this.chatModel);

          if (this.chatModel.phoneNumber !== this.loggedInUserPhoneNumber) {

            if (this.chatModel.message !== undefined) {
              this.chatsToBeUpdatedToChatSeen.push(this.chatModel);
            }

            if (this.chatModel.imageUrl !== undefined) {
              this.chatsWithImagesToBeUpdatedToChatSeen.push(this.chatModel);
            }
          }
        });

        console.log('list of chats', this.chats);
        console.log('chats to be updated: ', this.chatsToBeUpdatedToChatSeen);
        console.log('chats with images to be updated: ', this.chatsWithImagesToBeUpdatedToChatSeen);
        setTimeout(() => this.scrollTop = this.chatContent.nativeElement.scrollHeight, 500);
        this.updateChatSeen();
      });
    }
  }

  createChatFormGroup() {
    this.chatForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  get formControls() {
    return this.chatForm.controls;
  }

  sendChat() {
    this.chatModel = new ChatModel();
    this.chatModel.chatMessageId = this.chatMessageId;
    this.chatModel.chatSeen = false;
    this.chatModel.fullName = this.authService.GetUserInSession().firstName + ' ' + this.authService.GetUserInSession().lastName;
    this.chatModel.message = this.formControls.message.value;
    this.chatModel.phoneNumber = this.loggedInUserPhoneNumber;
    this.chatModel.timeStamp = new Date().toString();
    this.chatService.create(this.chatModel);
    this.createChatFormGroup();
  }

  openImageUploadDialog() {
    const dialogFilter = this.dialog.open(ImageUploadDialogComponent, {
      height: '500px',
      width: '550px',
      disableClose: true,
      data: { update: false }
    });

    dialogFilter.afterClosed().subscribe(res => {

      if (res) {
        this.chatModel = new ChatModel();
        this.chatModel.chatMessageId = this.chatMessageId;
        this.chatModel.chatSeen = false;
        this.chatModel.fullName = this.authService.GetUserInSession().firstName + ' ' + this.authService.GetUserInSession().lastName;
        this.chatModel.phoneNumber = this.loggedInUserPhoneNumber;
        this.chatModel.timeStamp = new Date().toString();
        this.chatModel.imageUrl = res;
        this.chatService.create(this.chatModel);
        this.createChatFormGroup();
      }
    });
  }

  updateChatSeen() {

    this.chatsToBeUpdatedToChatSeen.forEach(res => {
      console.log('chat message id', this.chatMessageId);
      console.log('res chat msg id', res.chatMessageId);
      if (this.chatMessageId === res.chatMessageId) {
        this.chatModel = new ChatModel();
        this.chatModel.chatMessageId = res.chatMessageId;
        this.chatModel.chatSeen = true;
        this.chatModel.fullName = res.fullName;
        this.chatModel.message = res.message;
        this.chatModel.phoneNumber = res.phoneNumber;
        this.chatModel.timeStamp = res.timeStamp;
        this.chatService.updateChatSeen(res.chatMessageId, res.chatId, this.chatModel);
      }
    });

    this.chatsWithImagesToBeUpdatedToChatSeen.forEach(res2 => {
      if (this.chatMessageId === res2.chatMessageId) {
        this.chatModel = new ChatModel();
        this.chatModel.chatMessageId = res2.chatMessageId;
        this.chatModel.chatSeen = true;
        this.chatModel.fullName = res2.fullName;
        this.chatModel.imageUrl = res2.imageURL;
        this.chatModel.phoneNumber = res2.phoneNumber;
        this.chatModel.timeStamp = res2.timeStamp;
        this.chatService.updateChatSeen(res2.chatMessageId, res2.chatId, res2);
      }
    });
  }

  generatePdf(){

    let xxx = [];
    this.chatService.getAll(this.chatMessageId).snapshotChanges().pipe(
      map(chatList =>
        chatList.map(c =>
          this.formatChatMessage(c.payload.val())
        ))
    ).subscribe(chatMessage=>{
      let documentDefinition = {
        info: {
          title: 'PROHUB - Chat History',
          author: 'CodePros',
          subject: 'Chat history'
        },
        content: [
          // HEADER
          {
            text: 'PROHUB - Chat History',
            style: 'header'
          },
          // BODY
          // HEADER
          {
            text: 'Sadia Rashid',
            style: 'h3'
          },
          chatMessage
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
            decoration: 'underline'
          },
          h3: {
            fontSize: 16,
            bold: true,
            margin: [0, 20, 0, 10],
            decoration: 'underline'
          },
          name: {
            fontSize: 16,
            bold: true
          },
          sign: {
            margin: [0, 50, 0, 10],
            alignment: 'right',
            italics: true
          },
        }
      };
      console.log(documentDefinition);
      pdfMake.createPdf(documentDefinition).download();

    })

  }

  formatChatMessage(chat:ChatModel){
    // return [
    //   {
    //     text: "(" + this.formatDateTime(chat.timeStamp) + ") - "
    //       + chat.fullName + ":"
    //     + (chat.message ? chat.message : chat.imageUrl),
    //     alignment: 'left',
    //   },
    //   {
    //     text: "\n",
    //   }
    // ]

    console.log(chat.message)
    if(chat.message){
      return [
        {
          text: "(" + this.formatDateTime(chat.timeStamp) + ") - "
            + chat.fullName + ":" + chat.message,
          alignment: 'left',
        },
        {
          text: "\n",
        }
      ]
    } else {
      return [
        // {
        //   text: "(" + this.formatDateTime(chat.timeStamp) + ") - "
        //     + chat.fullName + ":" + chat.imageUrl,
        //   alignment: 'left',
        // },
        // https://firebasestorage.googleapis.com/v0/b/prohub-410f4.appspot.com/o/chat%2Fyq020zpvqc?alt=media&token=3bef9cd7-d81a-47e4-9b29-9f2a9cd3f131
        // https://firebasestorage.googleapis.com/v0/b/prohub-410f4.appspot.com/o/chat%2Fyq020zpvqc?alt=media&token=3bef9cd7-d81a-47e4-9b29-9f2a9cd3f131
        {
          image: chat.imageUrl,
          link: chat.imageUrl
        },
        {
          text: "\n",
        }
      ]
    }

  }

  formatDateTime(dateString) {
    let date: Date = new Date(dateString);
    const months = ["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let formatted_date = date.getMonth() + "/" + date.getDate() +  "/" + date.getFullYear()
    let formatted_time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    return formatted_date + " " + formatted_time;
  }

}
