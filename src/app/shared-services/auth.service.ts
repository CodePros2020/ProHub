// auth.service.ts
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;
  public isLoggedIn = false;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.user = firebaseAuth.authState;
  }

  SendVerificationMail() {
    return this.firebaseAuth.currentUser.then(u => u.sendEmailVerification());

  }

 signup(email: string, password: string) {
    this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Val returned is ' , value);
        this.SendVerificationMail();
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  login(email: string, password: string, prevPage: string) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user.emailVerified !== true) {
          this.SendVerificationMail();
          window.alert('Please validate your email address. Kindly check your inbox.');
        } else {
          this.ngZone.run(() => {
            this.router.navigate(['container', 'lessor', 'property-list']);
          });
          // this.isLoggedIn = true;
          // this.ngZone.run(() => {
          // });
        }
        // this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message);
      });
  }
  deleteUser(email: string, password: string) {
    this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then((info) => {
       this.firebaseAuth.currentUser.then(u => u.delete());
      });
  }



  logout() {
    this.firebaseAuth.signOut();
  }
}
