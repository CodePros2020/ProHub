import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatSearchForm: FormGroup;
  chatMessageId;
  chatMessageName;

  constructor(private formBuilder: FormBuilder) {
    this.createChatSearchFormGroup();
  }

  ngOnInit(): void {
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
  }




}
