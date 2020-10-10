import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {AngularFireDatabase} from '@angular/fire/database';
import {RegistrationModel} from '../pages/registration/manager/registration.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(   private firestore: AngularFirestore , private db: AngularFireDatabase  ) { }

  addUser(user: RegistrationModel) {
    return this.db.database.ref('users').child(user.phone).set(user).then();
  }

  async getUserPassword(username) {
    const snapshot = await this.db.database.ref('users/' + username)
      .once('value');
    return snapshot.val().password;
  }
}
