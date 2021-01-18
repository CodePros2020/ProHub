import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {RegistrationModel} from '../pages/registration/manager/registration.model';

@Injectable({
  providedIn: 'root'
})
export class UsersTableService {

  private dbPath = '/users';

  usersRef: AngularFireList<RegistrationModel> = null;

  constructor(private db: AngularFireDatabase) {
  }

  // getAll(chatMessageId): AngularFireList<RegistrationModel> {
  //   this.usersRef = this.db.list(this.dbPath, ref =>
  //     ref.orderByChild('chatMessageId').equalTo(chatMessageId));
  //   return this.chatRef;
  // }

  getTenant() {
    this.usersRef = this.db.list(this.dbPath, ref =>
      ref.orderByChild('userType').equalTo('personal'));
    return this.usersRef;
  }
}
