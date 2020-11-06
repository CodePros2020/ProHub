import { Component, OnInit } from '@angular/core';
import {StaffManagementComponent} from './staff-management/staff-management.component';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  public changePasswordForm: FormGroup;
  public hideCurrent = true;
  public hideNew = true;
  public hideConfirm = true;
  public showFirst = true;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder,
              public router: Router) {
    this.createChangePasswordFormGroup();  }

  ngOnInit(): void {
  }


  createChangePasswordFormGroup() {
    this.changePasswordForm = this.formBuilder.group({

      password: ['', Validators.required],
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onClickSaveButton() {
    if (this.changePasswordForm.valid){
    }
  }


  get formControls() {
    return this.changePasswordForm.controls;
  }
  goStaff() {
    this.router.navigate(['container/staff']);
  }
  goUnits() {
    this.router.navigate(['container/units']);
  }
  openStaffManagementDialog() {
    const dialogRef = this.dialog.open(StaffManagementComponent, {
      maxWidth: 'auto',
      maxHeight: 'auto',
      height: '80%',
      width: '70%',
      panelClass: 'no-padding-container',
      disableClose: true,
      data: {}
    });
    // dialogRef.componentInstance.onAdd.subscribe(result => {
    //   console.log('AfterAdd dialog', JSON.stringify(result));
    //
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //
    //   }
    // });
  }


}
