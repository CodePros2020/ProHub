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

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.user = firebaseAuth.authState;
  }

  SendVerificationMail() {
    return this.firebaseAuth.currentUser.then(u => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['login']);
      });
  }

  signup(email: string, password: string) {
    this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        this.SendVerificationMail();
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  login(email: string, password: string) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user.emailVerified !== true) {
          this.SendVerificationMail();
          window.alert('Please validate your email address. Kindly check your inbox.');
        } else {
          this.ngZone.run(() => {
            this.router.navigate(['propertyList']);
          });
        }
        // this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  // login(email: string, password: string) {
  //   this.firebaseAuth
  //     .signInWithEmailAndPassword(email, password)
  //     .then(value => {
  //       console.log('Nice, it worked!');
  //     })
  //     .catch(err => {
  //       console.log('Something went wrong:', err.message);
  //     });
  // }

  logout() {
    this.firebaseAuth.signOut();
  }
}
