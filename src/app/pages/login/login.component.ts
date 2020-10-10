import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {FirebaseService} from '../../shared-services/firebase.service';
import {AuthService} from '../../shared-services/auth.service';
import {Observable} from 'rxjs';
import {ForgotPasswordDialogComponent} from './forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public firebaseService: FirebaseService,
    public authService: AuthService
  ) {
  }

  get formControls() {
    return this.loginForm.controls;
  }

  public loginForm: FormGroup;
  public hide = true;
  users;
  units: Observable<any[]>;
  userByPhone: Observable<any[]>;
  date: Date = new Date();
  year: number;

  getYear() {
    this.year = this.date.getFullYear();
    return this.year;
  }

  ngOnInit(): void {
    this.getLoginForm();
  }

  getLoginForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.authService.login(this.formControls.userName.value, this.formControls.password.value);
  }

  openRegistration() {
    this.authService.signup(this.formControls.userName.value, this.formControls.password.value);
    // this.router.navigate(['/register']);
  }

  forgotPasswordDialog() {
    const dialog = this.dialog.open(ForgotPasswordDialogComponent, {
      height: '450px',
      width: '600px',
      disableClose: true,
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'no-padding-container',
    });
  }
}
