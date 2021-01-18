import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import {AuthService} from './auth.service';
import {ChatMessagesModel} from '../pages/container/chat/manager/chat-messages.model';

@Injectable({
  providedIn: 'root'
})
export class ChatMessagesService {

  private dbPath = '/chatMessages';
  receiverNumber;

  chatMessageRef: AngularFireList<ChatMessagesModel> = null;
  chatMessageRefCreate: AngularFireList<ChatMessagesModel> = null;

  constructor(private db: AngularFireDatabase,
              private authService: AuthService) {
    this.receiverNumber = this.authService.GetUserInSession().phoneNumber;
    this.chatMessageRef = db.list(this.dbPath, ref =>
      ref.orderByChild('receiverNumber').equalTo(this.receiverNumber));
    this.chatMessageRefCreate = db.list(this.dbPath);
  }

  getAll(): AngularFireList<ChatMessagesModel> {
    return this.chatMessageRef;
  }

  create(value: any): any {
    console.log('what is value in create chat message? ', value);
    return this.chatMessageRefCreate.push(value)
      .catch(err => {
        console.log('error in creating chat message list: ', err);
      });
  }

  delete(key: string): Promise<void> {
    return this.chatMessageRef.remove(key);
  }
}
