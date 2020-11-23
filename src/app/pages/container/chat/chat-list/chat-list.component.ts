import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../../../shared-services/auth.service';
import {ChatMessagesModel} from '../manager/chat-messages.model';
import {ChatMessagesService} from '../../../../shared-services/chat-messages.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  @Output() chatMessageId: EventEmitter<any> = new EventEmitter<any>();

  loggedInFullName;
  chatMessageModel: ChatMessagesModel;
  @Input() chatList = [];

  constructor(private authService: AuthService,
              private chatMessageService: ChatMessagesService) {
    this.getLoggedInFullName();
    this.chatMessageModel = new ChatMessagesModel();
  }

  ngOnInit(): void {
  }

  getLoggedInFullName() {
    this.loggedInFullName = this.authService.GetUserInSession().firstName + ' ' +
      this.authService.GetUserInSession().lastName;
  }

  getChatMessageId(id) {
    this.chatMessageId.emit(id);
  }
}
