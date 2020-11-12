// auth.service.ts
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../shared/services/user';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { VerifyEmailAddressComponent } from '../pages/signup/verify-email-address/verify-email-address.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../shared-components/error-dialog/error-dialog.component';
import { FirebaseService } from './firebase.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  user: Observable<unknown>;
  loggedInUser: any;

  constructor(
    public afs: AngularFireDatabase,
    private firebaseAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    public router: Router,
    public ngZone: NgZone,
    public dialog: MatDialog, // NgZone service to remove outside scope warning
    private http: HttpClient
  ) {

    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.firebaseAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.user = this.firebaseService.getUser(this.userData.uid);
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('User Received =>', result.user);
        this.firebaseService.getUser(result.user.uid).subscribe(res => {
          localStorage.setItem('sessionUser', JSON.stringify(res));
          this.loggedInUser = res;
          if (result.user.emailVerified === true && this.loggedInUser.phoneNumber === undefined) {
            this.SetUserData(result.user);
            this.router.navigate(['register']);
          } else if (result.user.emailVerified === false) {
            const dialog = this.dialog.open(ErrorDialogComponent, {
              height: '250px',
              width: '450px',
              autoFocus: false,
              restoreFocus: false,
              panelClass: 'no-padding-container',
              data: {
                msg:
                  'An email verification link has been sent at ' +
                  this.userData.email +
                  '. Please verify email to login.',
              },
            });
          } else if (result.user.emailVerified === true && this.loggedInUser.phoneNumber !== undefined) {
            localStorage.setItem('user', JSON.stringify(this.loggedInUser));
            if ((this.loggedInUser.userType.toUpperCase() === 'BUSINESS')) {
              this.router.navigate(['container/property-list']);
            } else {
              this.router.navigate(['container/dashboard']);
            }
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  GetUserInSession() {
    return JSON.parse(localStorage.getItem('sessionUser'));
  }

  // Sign up with email/password
  SignUp(email, password) {
    return this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        console.log('User received ', result.user);
        this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Send email verification when new user sign up
  SendVerificationMail() {
    return this.firebaseAuth.currentUser.then((u) =>

      u.sendEmailVerification().then(() => {
        this.SetUserData(u);
        const dialog = this.dialog.open(VerifyEmailAddressComponent, {
          height: '350px',
          width: '450px',
          autoFocus: false,
          restoreFocus: false,
          panelClass: 'no-padding-container',
        });
      })
    );
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.firebaseAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false ? true : false;
  }
  /* Setting up user data when sign in with username/password,
    sign up with username/password and sign in with social auth
    provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    // const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userRef: AngularFireObject<unknown> = this.afs.object(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber || null,
    };
    return userRef.set(userData);
    // return userRef.set(userData, {
    //   merge: true
    // });
  }
  // Sign out
  SignOut() {
    return this.firebaseAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
  // deleting a user from Authentication
  deleteUser(email: string, password: string) {
    this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((info) => {
        this.firebaseAuth.currentUser.then((u) => u.delete());
      });
  }
}
