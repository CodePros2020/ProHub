import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../shared-services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


  public hide = true;
  public hideConfirmPassword = true;
  public signUpForm: FormGroup;
  next: any = 'NEXT';
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
    if (this.signUpForm.valid){
      if (this.signUpForm.get('confirmPassword').value === this.signUpForm.get('password').value){
        this.authService.SignUp(this.formControls.email.value, this.formControls.password.value).then();
        this.dialogRef.close();
      } else {
        window.alert('Password must match');
      }
    }
  }


}


