import {Component, Input, OnInit} from '@angular/core';
import {ChatMessagesModel} from '../../manager/chat-messages.model';
import {map} from 'rxjs/operators';
import {ChatService} from '../../../../../shared-services/chat.service';
import {ChatModel} from '../../manager/chat.model';
import {AuthService} from '../../../../../shared-services/auth.service';

@Component({
  selector: 'app-chat-list-card',
  templateUrl: './chat-list-card.component.html',
  styleUrls: ['./chat-list-card.component.scss']
})
export class ChatListCardComponent implements OnInit {

  @Input() chatMessageModel: ChatMessagesModel;
  chat: ChatModel;
  loggedInUserPhoneNumber;
  unread = false;
  chatCardImg = './assets/account-icon.png';

  constructor(private chatService: ChatService,
              private authService: AuthService) {
    this.chat = new ChatModel();
    this.loggedInUserPhoneNumber = this.authService.GetUserInSession().phoneNumber;

  }

  ngOnInit(): void {
    console.log('chat message model in chat list card: ', this.chatMessageModel);
    this.retrieveLastChatMessage();
  }


  retrieveLastChatMessage() {
    if (this.chatMessageModel.chatMessageId !== undefined) {
      this.chatService.getLastMessage(this.chatMessageModel.chatMessageId).snapshotChanges().pipe(
        map(chats =>
          chats.map(c =>
            ({key: c.payload.key, ...c.payload.val()})
          ))
      ).subscribe(data => {
        data.forEach(res => {
          this.chat = res;
          this.checkIfChatSeen();
          console.log('what is last message? ', this.chat);
        });
      });
    }
  }

  getSubstringOfChatLastMessage(message) {
    if (message.length > 30) {
      return message.substring(0, 30) + '...';
    } else {
      return message;
    }
  }

  checkIfChatSeen() {
    if (this.chat.phoneNumber !== this.loggedInUserPhoneNumber) {
      if (this.chat.chatSeen === false) {
        this.unread = true;
      } else {
        this.unread = false;
      }
    }
  }

}
