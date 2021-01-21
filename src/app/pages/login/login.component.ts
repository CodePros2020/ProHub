import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from '../../shared-services/firebase.service';
import { AuthService } from '../../shared-services/auth.service';
import { Observable } from 'rxjs';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordDialogComponent } from './forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  rememberMe = false;
  cookieVal: string;

  public loginForm: FormGroup;
  public hide = true;
  users;
  units: Observable<any[]>;
  userByPhone: Observable<any[]>;
  date: Date = new Date();
  year: number;


  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public firebaseService: FirebaseService,
    public router: Router,
    public authService: AuthService,
  ) {

  }


  get formControls() {
    return this.loginForm.controls;
  }

  getYear() {
    this.year = this.date.getFullYear();
    return this.year;
  }

  ngOnInit(): void {
    this.getLoginForm();
    this.cookieVal = this.authService.GetCookies();
    // console.log('Cookie Val', this.cookieVal);
    if (this.cookieVal ){
      this.formControls.userName.setValue(this.cookieVal);
      this.formControls.rememberMe.setValue(true);
      // console.log('checking val');

    }
  }

  getLoginForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  login() {
    this.authService.SignIn(
      this.formControls.userName.value,
      this.formControls.password.value,
      this.formControls.rememberMe.value
    );
  }

  signupDialog() {
    const dialog = this.dialog.open(SignupComponent, {
      height: '500px',
      width: '600px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'no-padding-container',
    });
  }

  forgotPasswordDialog() {
    const dialog = this.dialog.open(ForgotPasswordDialogComponent, {
      height: '400px',
      width: '500px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'no-padding-container',
    });
  }
}

