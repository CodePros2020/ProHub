import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { FirebaseService } from '../../shared-service/firebase.service';
import {Observable} from 'rxjs';
import { AngularFireDatabase} from '@angular/fire/database';
import {EmailVerificationDialogComponent} from '../registration/email-verification-dialog/email-verification-dialog.component';
import {ForgotPasswordDialogComponent} from './forgot-password-dialog/forgot-password-dialog.component';
import {UserPasswordService} from '../../shared-service/user-password.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private router: Router,
              private activeRoute: ActivatedRoute,
              public firebaseService: FirebaseService,
              public userPasswordService: UserPasswordService) { }

              get formControls() {
    return this.loginForm.controls;
  }

  public loginForm: FormGroup;
  public hide = true;
  users;
  units: Observable<any[]>;

  ngOnInit(): void {
    this.getloginForm();
    this.getUsers();
    this.getUnits();
  }

  getloginForm(){
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  login() {
    this.firebaseService.getUserPassword(this.formControls.userName.value)
      .then(r => {
        if (this.userPasswordService.authentication(this.formControls.password.value, r)){
          this.router.navigate(['/propertyList']);
        }
        else{
          // throw error message
        }
      });
  }

  openRegistration() {
    this.router.navigate(['/register']);
  }

  getUsers = () =>
    this.firebaseService
      .getUsers()
      .subscribe(res => { console.log('Data is, ' + res);
                          this.users = res[0].payload.doc.data
                          ;
                          console.log('Data received is', this.users );
        }  )

  getUnits() {
      this.units = this.firebaseService.getUnits();
      console.log('Data retrieved  ', this.units);
  }

  forgotPasswordDialog() {
    const dialog = this.dialog.open(ForgotPasswordDialogComponent, {
      height: '450px',
      width: '600px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'no-padding-container'
    });
  }



}
