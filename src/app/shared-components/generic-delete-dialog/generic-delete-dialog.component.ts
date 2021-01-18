import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-generic-delete-dialog',
  templateUrl: './generic-delete-dialog.component.html',
  styleUrls: ['./generic-delete-dialog.component.scss']
})
export class GenericDeleteDialogComponent implements OnInit {

  currentDialog: string;
  constructor(public dialogRef: MatDialogRef<GenericDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentDialog = data.currentDialog;
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(false);
  }

  deleteConfirmed() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
