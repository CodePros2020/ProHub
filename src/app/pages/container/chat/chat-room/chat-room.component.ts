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
import {PropertyService} from "../../../../shared-services/property.service";
import {PropertyModel} from "../../property-list/manager/property.model";
import {FileService} from "../../../../shared-services/file.service";
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
              private fileService: FileService,
              public datePipe: DatePipe) {
    this.loggedInUserPhoneNumber = this.authService.GetUserInSession().phoneNumber;
    this.createChatFormGroup();
  }

  ngOnInit(): void {
    this.retrieveChats();
    // console.log('what is the chat message id in chat room: ', this.chatMessageId);
  }

  ngOnChanges() {
    this.retrieveChats();
    // console.log('chat message in on changes', this.chatMessageId);
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

        // console.log('list of chats', this.chats);
        // console.log('chats to be updated: ', this.chatsToBeUpdatedToChatSeen);
        // console.log('chats with images to be updated: ', this.chatsWithImagesToBeUpdatedToChatSeen);
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
      // console.log('chat message id', this.chatMessageId);
      // console.log('res chat msg id', res.chatMessageId);
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

  async exportChatHistory(){
    const chatMessageProcessor = this.chats.map(async (c:ChatModel) => {
      let imageData = null;

      // download image when included
      if(c.imageUrl != undefined) {
        imageData = await this.getBase64ImageFromURL(c.imageUrl);
      }

      if(imageData){
        return [
          // message header
          {
            text: "[" + this.formatDateTime(c.timeStamp) + "] "
              + c.fullName + " sent: ",
            alignment: 'left',
            margin: [ 0, 0, 0, 10 ]
          },
          // image
          {
            image: imageData,
            width: 250,
            margin: [ 0, 0, 0, 20 ]
          }
        ]
      } else {
        return [
          // message header
          {
            text: "[" + this.formatDateTime(c.timeStamp) + "] "
              + c.fullName + ": " + c.message,
            alignment: 'left',
            margin: [ 0, 0, 0, 10 ]
          }
        ]

      }
    })

    // run chatMessageProcessor to each message and make pdf
    Promise.all(chatMessageProcessor).then(async arrayOfResponses => {
      // let logo = await this.getBase64ImageFromURL("../../../../../../assets/logo-medium.png");

      // get property information
      let prop: PropertyModel =  this.propertyService.GetPropertyInSession();

      // define document
      let documentDefinition = {
        header:  function (currentPage, pageCount) {
          return {
            margin: [18,18,18,30],
            columns: [
              // {
              //   image: logo,
              //   width:30,
              //   alignment: "right"
              // },
              // {
              //   text: "ProHub - Chat History"
              // }
            ],
          }
        },
        footer: function (currentPage, pageCount) {
          return {
            text: `Page ${currentPage.toString()} of ${pageCount}`,
            alignment: 'right',
            style: 'normalText',
            margin: [0, 20, 20, 10]
          }
        },
        content: [
            {
              margin: [0, 0, 0, 5],
              text: [
                { text: prop.name + "\n",
                  style: {
                    fontSize: 20,
                    bold: true,
                    margin: [0, 20, 10, 25],
                    // decoration: 'underline'
                  },
                },
                { text: `${prop.streetLine1}\n`},
                prop.streetLine2 ? { text: `${prop.streetLine2}\n`} : {},
                { text: `${prop.city}, ${prop.province}, ${prop.postalCode}`},
              ],
              alignment: 'center',
            },
            {
              columns: [
                // TENANT Name
                {
                  text: `Tenant: ${this.chatMessageName}`,
                  style: 'h3',
                },
                {
                  text: `Lessor: ${this.chatModel.fullName}`,
                  style: 'h3',
                },
              ],
              alignment: 'center',
              margin: [0,0,0,5]
            },

          // BODY
          // HEADER
          {
            text: 'CHAT HISTORY',
            style: 'h3_chathistory'
          },
          // print chat messages
          arrayOfResponses
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 30, 0, 30],
            // decoration: 'underline'
          },
          h3_chathistory: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 10, 20],
             // decoration: 'underline'
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
      // generate pdf and download
      pdfMake.createPdf(documentDefinition).download(
        // Filename format: YYYYMMDD-PropertyName-TenantName
        (new Date).toISOString().slice(0,10).replace(/-/g,"")
        + '_' + prop.name
        + '_' + this.chatMessageName.fullName
      );
    })
  }

  // format date for chat export history
  formatDateTime(dateString) {
    let date: Date = new Date(dateString);
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    let minutes = ('0'+date.getMinutes()).slice(-2);
    let hours = ('0'+date.getHours()).slice(-2);
    let seconds = ('0'+date.getSeconds()).slice(-2);
    let myFormattedDate = year+"-"+(monthIndex+1)+"-"+day+" "+ hours+":"+minutes+":"+seconds;
    return myFormattedDate;

  }

  // download image data from url
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
        // let dataURL = canvas.toDataURL("image/jpeg");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

}
