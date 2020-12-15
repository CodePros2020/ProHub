import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../../shared-services/auth.service';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RegistrationModel} from "../../registration/manager/registration.model";


@Component({
  selector: 'app-verify-email-address',
  templateUrl: './verify-email-address.component.html',
  styleUrls: ['./verify-email-address.component.scss']
})
export class VerifyEmailAddressComponent implements OnInit {

  user: RegistrationModel;
  constructor(public dialogRef: MatDialogRef<VerifyEmailAddressComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.user = new RegistrationModel();
    this.user= this.data.userData;
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(false);
  }
}
