import {Component, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProvinceEnum} from '../../../../../shared-models/enum/province.enum';
import {StaffModel} from '../manager/Staff.model';
import {GenericMessageDialogComponent} from '../../../../../shared-components/genericmessagedialog/genericmessagedialog.component';
import {PendingChangesDialogComponent} from '../../../../../shared-components/pending-changes-dialog/pending-changes-dialog.component';
import {FileService} from '../../../../../shared-services/file.service';
import {UploadImageDialogComponent} from '../upload-image-dialog/upload-image-dialog.component';
import {StaffService} from '../../../../../shared-services/staff.service';

@Component({
  selector: 'app-add-edit-staff',
  templateUrl: './add-edit-staff.component.html',
  styleUrls: ['./add-edit-staff.component.scss']
})
export class AddEditStaffComponent implements OnInit {

  @ViewChild('labelImport')
  labelImport: ElementRef;

  public provinces;
  staffForm: FormGroup;
  staff: StaffModel;
  newStaff: StaffModel;
  editStaff: StaffModel;
  propId: string;
  staffList = STAFF_LIST;
  isSuccess = false;
  isEditMode = false;

  constructor(public dialogRef: MatDialogRef<AddEditStaffComponent>, public formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA)private data: any, public dialog: MatDialog,
              public staffService: StaffService
              ) {
    this.staff = new StaffModel();
    this.newStaff = new StaffModel();
    this.editStaff = new StaffModel();
    this.propId = this.data.propId;
    if (this.data.update === true){
    this.staff = this.data.staffData;
    }
  }

  ngOnInit(): void {
    this.provinces = ProvinceEnum;
    if (this.data.update === true) {
      this.isEditMode = true;
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
      fullName: [this.staff.name, Validators.required],
      email: [this.staff.email, Validators.required],
      phone: [this.staff.phoneNum, Validators.required],
      addressLine1: [this.staff.address, Validators.required],
      addressLine2: [this.staff.addressLine2 || ''],
      postalCode: [this.staff.postalCode, Validators.required],
      city: [this.staff.city, Validators.required],
      country: [this.staff.country, Validators.required],
      province: [this.staff.province, Validators.required],
      role: [this.staff.role, Validators.required],
      photo: [this.staff.imgUrl]
    });
  }
  getImageLink(){
    return this.formControls.photo.value || '/assets/no-photo.png';
  }


  /** Clicking on close */
  close() {
    if (this.staffForm.dirty) {
      const unsavedDialog = this.dialog.open(PendingChangesDialogComponent);

      unsavedDialog.afterClosed().subscribe(res => {
        if (res === true) {
          this.dialogRef.close(false);
        }
      });
    } else {
      this.dialogRef.close(false);
    }
  }

  saveStaff() {
  if (this.staffForm.valid) {

    this.newStaff.province = this.formControls.province.value;
    this.newStaff.country = this.formControls.country.value;
    this.newStaff.city = this.formControls.city.value;
    this.newStaff.postalCode = this.formControls.postalCode.value;
    this.newStaff.addressLine2 = this.formControls.addressLine2.value || '';
    this.newStaff.address = this.formControls.addressLine1.value;
    this.newStaff.phoneNum = this.formControls.phone.value;
    this.newStaff.email = this.formControls.email.value;
    this.newStaff.role = this.formControls.role.value;
    this.newStaff.name = this.formControls.fullName.value;
    this.newStaff.imgUrl = this.formControls.photo.value;
    this.newStaff.propId = this.propId;
    if (this.data.update === true) {
      this.newStaff.staffId = this.staff.staffId;
      this.staffService.updateStaff(this.newStaff.staffId, this.newStaff );
    } else {
      this.staffService.addStaff(this.newStaff);
    }
    this.dialogRef.close(true);
    }
  else {
    this.openMessageDialog('E R R O R', 'Please enter the required information');
  }
  }
  /**  Error Message pop up */
  openMessageDialog(titleMsg, msg) {
    this.dialog.open(GenericMessageDialogComponent,
      {
        data: {title: titleMsg, message: msg}
      });
  }

  openPhotoDialog() {
    const dialogRef = this.dialog.open(UploadImageDialogComponent, {
      height: '40%',
      width: '50%',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
         this.formControls.photo.setValue(result);
         this.isSuccess = true;
      }
    });
  }

}

export interface Select {
  value: string;
}

const STAFF_LIST: Select[] = [
  { value: 'Superintendent'},
  { value: 'Property Manager' },
  { value: 'House Keeper' },
  { value: 'Maintenance Staff' },
];
