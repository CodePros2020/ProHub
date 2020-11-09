import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import {ChatModel} from '../pages/container/chat/manager/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private dbPath = '/chat';
  chatMessageId;

  chatRef: AngularFireList<ChatModel> = null;
  chatRefCreate: AngularFireList<ChatModel> = null;

  constructor(private db: AngularFireDatabase) {
    // this.chatMessageId = this.authService.GetUserInSession().phoneNumber;
    this.chatMessageId = '6475545687_6478319441';
    this.chatRef = db.list(this.dbPath, ref =>
      ref.orderByChild('chatMessageId').equalTo(this.chatMessageId));
    this.chatRefCreate = db.list(this.dbPath);
  }

  getAll(): AngularFireList<ChatModel> {
    return this.chatRef;
  }

  create(value: any): any {
    return this.chatRef.push(value)
      .catch(err => {
        console.log('error in sending chat: ', err);
      });
  }
}
