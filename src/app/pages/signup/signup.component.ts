import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../shared-services/auth.service';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
@ViewChild(MatButton) nextBtn: MatButton;

  public hide = true;
  public hideConfirmPassword = true;
  public signUpForm: FormGroup;
  verified: any = 'VERIFY';
  next: any = 'NEXT';
  linkSent = false;
  verificationLink: boolean;
  notVerifiedError: any = 'It is not verified yet! Please check your inbox.';
  constructor(
    public dialogRef: MatDialogRef<SignupComponent>,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthService) {}

  ngOnInit(): void {
    this.createSignUpForm();
  }

  createSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  get formControls() {
    return this.signUpForm.controls;
  }

  close() {
    this.dialogRef.close(false);
  }

  sendEmail() {
    if (!this.linkSent) {
      this.authService.signup(this.formControls.email.value, this.formControls.password.value);
      this.verificationLink = true;
      this.verified = 'SEND AGAIN';
      this.linkSent = true;

    } else {
      this.authService.SendVerificationMail();
    }
  }

  verifyCode() {
    this.authService.login(this.formControls.email.value, this.formControls.password.value, 'signup');
    console.log('The return val ', this.authService.isLoggedIn);
    if (this.authService.isLoggedIn) {
      this.dialogRef.close();
      this.router.navigate(['/register']);
    }
  }
}

