import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import {ChatModel} from '../pages/container/chat/manager/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private dbPath = '/chat';
  chatId: string;

  chatRef: AngularFireList<ChatModel> = null;
  chatRefCreate: AngularFireList<ChatModel> = null;

  constructor(private db: AngularFireDatabase) {
    this.chatRefCreate = db.list(this.dbPath);
    this.chatId = this.db.createPushId();
  }

  getAll(chatMessageId): AngularFireList<ChatModel> {
    this.chatRef = this.db.list(this.dbPath, ref =>
      ref.orderByChild('chatMessageId').equalTo(chatMessageId));
    return this.chatRef;
  }

  getLastMessage(chatMessageId) {
    this.chatRef = this.db.list(this.dbPath, ref =>
      ref.orderByChild('chatMessageId').equalTo(chatMessageId).limitToLast(1));
    return this.chatRef;
  }

  updateChatSeen(chatMessageId, key, value): Promise<void> {
    this.chatRef = this.db.list(this.dbPath, ref =>
      ref.orderByChild('chatMessageId').equalTo(chatMessageId));
    return this.chatRef.update(key, value);
  }

  create(value: any): any {
    // value.chatId = this.chatId;
    return this.chatRef.push(value)
      .catch(err => {
        console.log('error in sending chat: ', err);
      });
  }
}
