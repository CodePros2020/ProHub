import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {

  msg: string;
  constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>, public router: Router,
              @Inject(MAT_DIALOG_DATA)private data: any) {

  }

  ngOnInit(): void {
    this.msg = this.data.msg;
  }
  close() {
    this.dialogRef.close(false);
  }
}
