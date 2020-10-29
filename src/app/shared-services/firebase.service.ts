import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {AngularFireDatabase} from '@angular/fire/database';
import {RegistrationModel} from '../pages/registration/manager/registration.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(   private firestore: AngularFirestore , private db: AngularFireDatabase , public router: Router ) { }

  getUser(uid){
    return this.db.object('/users/' + uid).valueChanges();
  }

  addUser(user: RegistrationModel, uid) {
    return this.db.database.ref('users').child(uid).set(user).then( () => {
      if (user.userType.toUpperCase() === 'BUSINESS'){
          this.router.navigate(['container/property-list']);
        } else {
          this.router.navigate(['container/dashboard']);
        }
      }
    );
  }

  async getUserPassword(username) {
    const snapshot = await this.db.database.ref('users/' + username)
      .once('value');
    return snapshot.val().password;
  }
}
