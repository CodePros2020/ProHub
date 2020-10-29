import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../shared-services/auth.service';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-verify-email-address',
  templateUrl: './verify-email-address.component.html',
  styleUrls: ['./verify-email-address.component.scss']
})
export class VerifyEmailAddressComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router, public dialogRef: MatDialogRef<VerifyEmailAddressComponent>) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(false);
  }
}
