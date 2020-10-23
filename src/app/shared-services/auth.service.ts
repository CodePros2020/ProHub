// auth.service.ts
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Store} from '@ngrx/store';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;
  public isLoggedIn = true;
  public email = '';

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private http: HttpClient,
    private store: Store
  ) {
    this.user = firebaseAuth.authState;
    // this.authState.subscribe(user => {
    //   if (user) {
    //     this.userState = user;
    //     localStorage.setItem('user', JSON.stringify(this.userState));
    //     JSON.parse(localStorage.getItem('user'));
    //   } else {
    //     localStorage.setItem('user', null);
    //     JSON.parse(localStorage.getItem('user'));
    //   }
    // })
  }


  SendVerificationMail() {
    this.isLoggedIn = false;
    return this.firebaseAuth.currentUser.then(u =>  u.sendEmailVerification()

  );
  }

 signup(email: string, password: string) {
    this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Val returned is ' , value);
        this.email = value.user.email;
        this.SendVerificationMail();
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

 login(email: string, password: string, prevPage: string) {
    this.isLoggedIn = true;
    return this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user.emailVerified !== true) {
          this.SendVerificationMail();
          window.alert('Please validate your email address. Kindly check your inbox.');
        } else {
          this.email = result.user.email;
          // this.ngZone.run(() => {
          //
          //   // this.router.navigate(['container/property-list']);
          // });
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
