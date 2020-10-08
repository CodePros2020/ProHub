import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent implements OnInit {

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>) { }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close(false);
  }
}
