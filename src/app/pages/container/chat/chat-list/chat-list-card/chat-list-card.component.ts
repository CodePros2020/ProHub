import {Component, Input, OnInit} from '@angular/core';
import {ChatMessagesModel} from '../../manager/chat-messages.model';

@Component({
  selector: 'app-chat-list-card',
  templateUrl: './chat-list-card.component.html',
  styleUrls: ['./chat-list-card.component.scss']
})
export class ChatListCardComponent implements OnInit {

  @Input() chatMessageModel: ChatMessagesModel;

  constructor() { }

  ngOnInit(): void {
    console.log('chat message model in chat list card: ', this.chatMessageModel);
  }

}
