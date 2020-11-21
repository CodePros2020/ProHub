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
import {PropertyService} from "../../../../shared-services/property.service";
import {PropertyModel} from "../../property-list/manager/property.model";
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
              private propertyService: PropertyService,
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


    this.chatService.getAll(this.chatMessageId).snapshotChanges().pipe(
      map(chatList =>
        chatList.map(c =>
          this.formatChatMessage(c.payload.val())
        ))
    ).subscribe(chatMessage=>{
      let prop: PropertyModel =  this.propertyService.GetPropertyInSession();

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
          [
            // PROPERTY NAME
            {
              text: [
                { text: "Property Name: ", style: { bold: true, fontSize: 14}},
                { text: prop.name, style: { bold: false, fontSize: 14} }
              ],
              style: {marginBottom: 10 }
            },
            // ADDRESS
            {
              text: [
                { text: "Address: ",
                  style: { bold: true, fontSize: 14, marginBottom: 5 },
                },
                { text: `${prop.streetLine1}, ` +
                    (prop.streetLine2 ? `${prop.streetLine2}, ` : "") +
                    `${prop.city}, ${prop.province}, ${prop.postalCode}`,
                  style: { bold: false, fontSize: 14, marginBottom: 5 },
                },
              ],
              style: {marginBottom: 10 }
              },
            // UNIT NAME
            {
              text: [
                {text: "Unit Name: ", style: { bold: true, fontSize: 14  }},
                {text: "", style: { bold: false, fontSize: 14}}
              ],
              style: {marginBottom: 10 }
            },
            {
              text: [
                {text: "Tenant Name: ", style: { bold: true, fontSize: 14  }},
                {text: this.chatMessageName, style: { bold: false, fontSize: 14}}
              ],
              style: {marginBottom: 10 }
            },
            {
              text: "Landlord:",
              style: { bold: true, fontSize: 14 },
            },
          ],
          // BODY
          // HEADER
          {
            text: 'Chat with ' + this.chatMessageName,
            style: 'h3'
          },
          chatMessage
        ],
        styles: {
          header: {
            fontSize: 20,
            bold: true,
            margin: [0, 20, 0, 10],
            decoration: 'underline'
          },
          h3: {
            fontSize: 16,
            bold: true,
            margin: [0, 20, 10, 20],
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
    return [
      {
        text: [
          // message header
          {
            text: "(" + this.formatDateTime(chat.timeStamp) + ") - "
              + chat.fullName + ": ",
            alignment: 'left',
          },
          // message/image url
          chat.message ? {text: chat.message} : {
            text: "[Image]",
            link: chat.imageUrl,
            decoration: "underline",
            style: { color: "blue" }
          },
        ],
      },
      {
        text: "\n",
      }
    ]
  }

  formatDateTime(dateString) {
    let date: Date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { // you can skip the first argument
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        let dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }
}
