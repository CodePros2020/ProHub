import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-staff-management',
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss']
})
export class StaffManagementComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<StaffManagementComponent>) { }

  ngOnInit(): void {
  }
  /** Clicking on close */
  close() {
    // if (this.addMedicationForm.dirty) {
    //   const unsavedDialog = this.dialog.open(PendingChangesDialogComponent);
    //
    //   unsavedDialog.afterClosed().subscribe(res => {
    //     if (res === true) {
    //       this.dialogRef.close(false);
    //     }
    //   });
    // } else {
    //   this.dialogRef.close(false);
    // }
    this.dialogRef.close();
  }
}
