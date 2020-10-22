import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-staff',
  templateUrl: './add-edit-staff.component.html',
  styleUrls: ['./add-edit-staff.component.scss']
})
export class AddEditStaffComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddEditStaffComponent>) { }

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
