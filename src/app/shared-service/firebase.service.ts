import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {AngularFireDatabase, snapshotChanges} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {RegistrationModel} from '../pages/registration/manager/registration.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  units: Observable<any[]>;
  users: Observable<any[]>;
  constructor(   private firestore: AngularFirestore , private db: AngularFireDatabase  ) { }

  getUsers() {
    return this.firestore.collection('users').snapshotChanges();
  }

  getUnits(): Observable<any[]> {
    // db: AngularFireDatabase
   this.units = this.db.list('units').snapshotChanges();
   return this.units;
  }

  addUser(user: RegistrationModel) {
    return this.db.database.ref('users').child(user.phone).set(user).then();
  }
  getUsersByPhone(): Observable<any[]> {
    // db: AngularFireDatabase
    this.users = this.db.list('users').snapshotChanges();
    return  this.users;
  }

  async getUserPassword(username) {
    const snapshot = await this.db.database.ref('users/' + username)
      .once('value');
    return snapshot.val().password;
  }
}
