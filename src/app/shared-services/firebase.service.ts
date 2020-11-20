import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {RegistrationModel} from '../pages/registration/manager/registration.model';
import {Router} from '@angular/router';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoaderComponent} from '../shared-components/loader/loader.component';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {


  user: RegistrationModel;
  tenantsArr = [];
  constructor(
    private firestore: AngularFirestore,
    private db: AngularFireDatabase,
    public router: Router ,
    public overlay: Overlay) {
    this.user = new RegistrationModel();
  }
  overlayRef = this.overlay.create({
    positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    hasBackdrop: true
  });
  getUser(uid){
    return this.db.object('/users/' + uid).valueChanges();
  }
  showOverlay() {
    this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  hideOverLay() {
    this.overlayRef.detach();
  }
  addUser(user: RegistrationModel, uid) {
    // localStorage.setItem('sessionUser', JSON.stringify(user));
    return this.db.database.ref('users').child(uid).set(user).then( () => {
      if (user.userType.toUpperCase() === 'BUSINESS'){
          this.router.navigate(['container/property-list']);
        } else {
          this.router.navigate(['container/dashboard']);
        }
      }
    );
  }
//   getUsers(){
//     this.tenantsArr = [];
//     this.db.list('/users').snapshotChanges().subscribe(res => {
//       res.forEach(doc => {
//           console.log('User, ', doc.payload.val());
//
//           this.tenantsArr.push(doc.payload.val());
//         });
//       });
//     console.log('All users, ', this.tenantsArr);
//     return this.tenantsArr;
// }
  getUsers() {
   return this.db.list('/users').snapshotChanges();
  }
  // getUsers(){
  //
  //   this.db.list('/users').snapshotChanges().pipe(
  //     map((changes) =>
  //       changes.map((c) => ({ key: c.payload.key, ...c.payload.val() as  RegistrationModel })))
  //   ).subscribe(data => {
  //       this.tenantsArr = [];
  //       data.forEach((res) => {
  //         console.log('User res', res);
  //         this.user = new RegistrationModel();
  //         if (res.key === res.uid) {
  //           this.user = res;
  //           if (this.user.userType === 'personal' ) {
  //             this.tenantsArr.push(this.user);
  //           }
  //         }
  //       });
  //   });
  //  // console.log('All users, ', this.tenantsArr);
  //   return this.tenantsArr;
  // }

  async getUserPassword(username) {
    const snapshot = await this.db.database.ref('users/' + username)
      .once('value');
    return snapshot.val().password;
  }
}
