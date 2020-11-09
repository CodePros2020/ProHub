import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {DatePipe} from '@angular/common';
import {ChatService} from '../../../../shared-services/chat.service';
import {map} from 'rxjs/operators';
import {ChatModel} from '../manager/chat.model';
import {AuthService} from '../../../../shared-services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {ImageUploadDialogComponent} from './image-upload-dialog/image-upload-dialog.component';

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
export class ChatRoomComponent implements OnInit {

  @ViewChild('chatContent') chatContent: ElementRef;
  scrollTop: number = null;

  chatForm: FormGroup;
  chatModel: ChatModel;
  loggedInUserPhoneNumber = '';
  message = '';
  chats = [];
  matcher = new MyErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private chatService: ChatService,
              private authService: AuthService,
              public datePipe: DatePipe) {
    // this.chatModel = new ChatModel();
    this.loggedInUserPhoneNumber = this.authService.GetUserInSession().phoneNumber;
    this.createChatFormGroup();
  }

  ngOnInit(): void {
    this.retrieveChats();
  }

  retrieveChats() {
   this.chatService.getAll().snapshotChanges().pipe(
     map(chats =>
     chats.map(c =>
       ({key: c.payload.key, ...c.payload.val()})
     ))
   ).subscribe(data => {
     this.chats = [];
     data.forEach(res => {
       this.chatModel = new ChatModel();
       this.chatModel.chatId = res.chatId;
       this.chatModel.chatMessageId = res.chatMessageId;
       this.chatModel.chatSeen = res.chatSeen;
       this.chatModel.fullName = res.fullName;
       this.chatModel.message = res.message;
       this.chatModel.phoneNumber = res.phoneNumber;
       this.chatModel.photoUrl = res.photoUrl;
       this.chatModel.timeStamp = res.timeStamp;
       this.chatModel.imageUrl = res.imageUrl;
       this.chats.push(this.chatModel);
     });
     console.log('list of chats', this.chats);
     setTimeout(() => this.scrollTop = this.chatContent.nativeElement.scrollHeight, 500);
   });
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
    this.chatModel.chatMessageId = '6475545687_6478319441';
    this.chatModel.chatSeen = false;
    this.chatModel.fullName = this.authService.GetUserInSession().firstName + ' ' + this.authService.GetUserInSession().lastName;
    this.chatModel.message = this.formControls.message.value;
    this.chatModel.phoneNumber = this.loggedInUserPhoneNumber;
    this.chatModel.photoUrl = '';
    this.chatModel.timeStamp = new Date().toString();
    this.chatService.create(this.chatModel);
    // this.retrieveChats();
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
        this.chatModel.chatMessageId = '6475545687_6478319441';
        this.chatModel.chatSeen = false;
        this.chatModel.fullName = this.authService.GetUserInSession().firstName + ' ' + this.authService.GetUserInSession().lastName;
        this.chatModel.phoneNumber = this.loggedInUserPhoneNumber;
        this.chatModel.photoUrl = '';
        this.chatModel.timeStamp = new Date().toString();
        this.chatModel.imageUrl = res;
        this.chatService.create(this.chatModel);
        // this.retrieveChats();
        this.createChatFormGroup();
      }
    });
  }

}
