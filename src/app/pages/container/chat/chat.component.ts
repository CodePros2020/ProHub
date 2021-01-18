import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {map} from 'rxjs/operators';
import {ChatMessagesModel} from './manager/chat-messages.model';
import {ChatMessagesService} from '../../../shared-services/chat-messages.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatSearchForm: FormGroup;
  chatMessageId;
  chatList = [];
  chatMessageModel: ChatMessagesModel;
  filteredOptions = [];
  chatMessageName;

  constructor(private formBuilder: FormBuilder,
              private chatMessageService: ChatMessagesService) {
    this.createChatSearchFormGroup();
    this.chatMessageModel = new ChatMessagesModel();
  }

  ngOnInit(): void {
    this.retrieveChatList();
  }

  createChatSearchFormGroup() {
    this.chatSearchForm = this.formBuilder.group({
      chatSearch: ['']
    });
  }

  get formControls() {
    return this.chatSearchForm.controls;
  }

  getChatMessageID(event) {
    this.chatMessageId = event;
    console.log('chat message id in chat component: ', this.chatMessageId);
  }

  getChatMessageName(event) {
    this.chatMessageName = event;
    console.log('chat message message in chat component: ', this.chatMessageName);
  }

  retrieveChatList() {
    this.chatMessageService.getAll().snapshotChanges().pipe(
      map(chatList =>
        chatList.map(c =>
          ({key: c.payload.key, ...c.payload.val()})
        ))
    ).subscribe(data => {
      this.chatList = [];
      data.forEach(res => {
        this.chatMessageModel = new ChatMessagesModel();
        this.chatMessageModel.uid = res.key;
        this.chatMessageModel.chatMessageId = res.chatMessageId;
        this.chatMessageModel.receiverNumber = res.receiverNumber;
        this.chatMessageModel.senderName = res.senderName;
        this.chatMessageModel.senderNumber = res.senderNumber;
        this.chatMessageModel.senderPhotoUrl = res.senderPhotoUrl;
        this.chatList.push(this.chatMessageModel);
      });
      this.filteredOptions = this.chatList;
      console.log('list of chatMessages from chat component', this.chatList);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    if (filterValue.length > 0) {
      this.filteredOptions = this.chatList.filter(
        item => {
          return item.senderName.toLowerCase().includes(filterValue.toLowerCase());
        }
      );
    } else {
      this.filteredOptions = this.chatList;
    }
  }
}
