import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Staff} from '../staff-management.component';

@Component({
  selector: 'app-add-edit-staff',
  templateUrl: './add-edit-staff.component.html',
  styleUrls: ['./add-edit-staff.component.scss']
})
export class AddEditStaffComponent implements OnInit {

  provinces = PROVINCE_LIST;
  userSelect = USERTYPE_LIST;
  staffForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddEditStaffComponent>, public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getStaffForm();
  }
  get formControls() {
    return this.staffForm.controls;
  }
  getStaffForm() {
    this.staffForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      role: ['', Validators.required],
    });
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

export interface Select {
  value: string;
  viewValue: string;
}

const USERTYPE_LIST: Select[] = [
  { value: 'LANDLORD', viewValue: 'Landlord' },
  { value: 'TENANT', viewValue: 'Tenant' }
];

const PROVINCE_LIST: Select[] = [
  {value: 'NL', viewValue: 'Newfoundland and Labrador'},
  {value: 'PE', viewValue: 'Prince Edward Island'},
  {value: 'NS', viewValue: 'Nova Scotia'},
  {value: 'NB', viewValue: 'New Brunswick'},
  {value: 'QC', viewValue: 'Quebec'},
  {value: 'ON', viewValue: 'Ontario'},
  {value: 'MB', viewValue: 'Manitoba'},
  {value: 'SK', viewValue: 'Saskatchewan'},
  {value: 'AB', viewValue: 'Alberta'},
  {value: 'BC', viewValue: 'British Columbia'},
  {value: 'YT', viewValue: 'Yukon'},
  {value: 'NT', viewValue: 'Northwest Territories'},
  {value: 'NU', viewValue: 'Nunavut'},
  ];
