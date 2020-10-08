import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';

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
   return  this.units;
  }
  getUsersByPhone(): Observable<any[]> {
    // db: AngularFireDatabase
    this.users = this.db.list('users').snapshotChanges();
    return  this.users;
  }

}
