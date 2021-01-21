import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../../../shared-services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  isSent = false;
  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>, public authService: AuthService,
              public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  get formControls() {
    return this.forgotPasswordForm.controls;
  }

  close() {
    this.dialogRef.close(false);
  }
  sendEmail() {
    if (this.forgotPasswordForm.valid){
      const email = this.formControls.email.value.toString().trim();
      // console.log('I m in send Emai');
      this.authService.ForgotPassword(email).then( () => {
        this.isSent = true;
      });
    }

  }

}

