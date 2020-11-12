import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../../../shared-services/auth.service';
import {ChatMessagesService} from '../../../../shared-services/chat-messages.service';
import {ChatMessagesModel} from '../manager/chat-messages.model';
import {map} from 'rxjs/operators';
import {ChatModel} from '../manager/chat.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  @Output() chatMessageId: EventEmitter<any> = new EventEmitter<any>();

  loggedInFullName;
  chatMessageModel: ChatMessagesModel;
  chatList = [];

  constructor(private authService: AuthService,
              private chatMessageService: ChatMessagesService) {
    this.getLoggedInFullName();
    this.chatMessageModel = new ChatMessagesModel();
  }

  ngOnInit(): void {
    this.retrieveChatMessages();
  }

  getLoggedInFullName() {
    this.loggedInFullName = this.authService.GetUserInSession().firstName + ' ' +
      this.authService.GetUserInSession().lastName;
  }

  retrieveChatMessages() {
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
        this.chatMessageModel.timestamp = res.timestamp;
        this.chatList.push(this.chatMessageModel);
      });
      console.log('list of chatMessages', this.chatList);
    });
  }

  getChatMessageId(id) {
    this.chatMessageId.emit(id);
  }

}
