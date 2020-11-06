import {Component, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProvinceEnum} from '../../../../../shared-models/enum/province.enum';
import {StaffModel} from '../manager/Staff.model';

@Component({
  selector: 'app-add-edit-staff',
  templateUrl: './add-edit-staff.component.html',
  styleUrls: ['./add-edit-staff.component.scss']
})
export class AddEditStaffComponent implements OnInit {

  @ViewChild('labelImport')
  labelImport: ElementRef;

  formImport: FormGroup;
  fileToUpload: File = null;
  public provinces;
  userSelect = USERTYPE_LIST;
  staffForm: FormGroup;
  staff: StaffModel;
  newStaff: StaffModel;
  propId: string;
  constructor(public dialogRef: MatDialogRef<AddEditStaffComponent>, public formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA)private data: any, public dialog: MatDialog) {
    this.staff = new StaffModel();
    this.newStaff = new StaffModel();
    this.propId = this.data.propId;
    if (this.data.update === true){
    this.staff = this.data.staffData;
    }
  }

  ngOnInit(): void {
    this.provinces = ProvinceEnum;
    if (this.data.update === true) {
      this.updateStaffForm();
    } else {
      this.getStaffForm();
    }


  }
  get formControls() {
    return this.staffForm.controls;
  }
  returnZero() {
    return 0;
  }

  getStaffForm() {
    this.staffForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      province: ['', Validators.required],
      role: ['', Validators.required],
      photo: ['']
    });
  }
 updateStaffForm() {
    this.staffForm = this.formBuilder.group({
      fullName: [this.staff.fullName, Validators.required],
      email: [this.staff.email, Validators.required],
      phone: [this.staff.phone, Validators.required],
      addressLine1: [this.staff.addressLine1, Validators.required],
      addressLine2: [this.staff.addressLine2 || ''],
      postalCode: [this.staff.postalCode, Validators.required],
      city: [this.staff.city, Validators.required],
      country: [this.staff.country, Validators.required],
      province: [this.staff.province, Validators.required],
      role: [this.staff.role, Validators.required],
      photo: [this.staff.photo]
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


  addStaff() {
  if (this.staffForm.valid) {
    this.newStaff.province = this.formControls.province.value;
    this.newStaff.country = this.formControls.country.value;
    this.newStaff.city = this.formControls.city.value;
    this.newStaff.postalCode = this.formControls.postalCode.value;
    this.newStaff.addressLine2 = this.formControls.addressLine2.value;
    this.newStaff.addressLine1 = this.formControls.addressLine1.value;
    this.newStaff.phone = this.formControls.phone.value;
    this.newStaff.role = this.formControls.role.value;
    this.newStaff.fullName = this.formControls.fullName.value;
    this.newStaff.photo = this.formControls.photo.value;
    this.newStaff.propertyId = this.propId;
  }
  }

  onFileChange(files: FileList) {
    // this.labelImport.nativeElement.innerText = Array.from(files)
    //   .map(f => f.name)
    //   .join(', ');
    // this.fileToUpload = files.item(0);
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
