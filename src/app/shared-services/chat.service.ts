import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import {ChatModel} from '../pages/container/chat/manager/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private dbPath = '/chat';

  chatRef: AngularFireList<ChatModel> = null;
  chatRefCreate: AngularFireList<ChatModel> = null;

  constructor(private db: AngularFireDatabase) {
    this.chatRefCreate = db.list(this.dbPath);
  }

  getAll(chatMessageId): AngularFireList<ChatModel> {
    this.chatRef = this.db.list(this.dbPath, ref =>
      ref.orderByChild('chatMessageId').equalTo(chatMessageId));
    return this.chatRef;
  }

  create(value: any): any {
    return this.chatRef.push(value)
      .catch(err => {
        console.log('error in sending chat: ', err);
      });
  }
}
