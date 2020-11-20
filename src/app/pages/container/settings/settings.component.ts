import { Component, OnInit } from '@angular/core';
import {StaffManagementComponent} from './staff-management/staff-management.component';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PropertyModel} from "../property-list/manager/property.model";
import {AuthService} from "../../../shared-services/auth.service";
import {PropertyService} from "../../../shared-services/property.service";
import {ProvinceEnum} from "../../../shared-models/enum/province.enum";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  loggedInUserName: string;
  loggedInUser: any;
  property: PropertyModel;
  loggedInUserAddress: string;
  loggedInUserCity: string;
  loggedInUserProvince: string;
  loggedInUserPostalCode: string;
  loggedInUserPhoneNumber: string;
  loggedInUserType: string;
  loggedInUserEmail: string;

  public hideCurrent = true;
  public hideNew = true;
  public hideConfirm = true;
  public showFirst = true;
  public provinces;

  public changeAccountForm: FormGroup;


  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              public router: Router,
              public authService: AuthService,
              public propertyService: PropertyService
              ) {
    this.createChangeAccountFormGroup();  }

  ngOnInit(): void {
    this.property = this.propertyService.GetPropertyInSession();
    this.loggedInUser = this.authService.GetUserInSession();
    this.loggedInUserName = this.loggedInUser !== undefined ? this.loggedInUser.firstName + ' ' + this.loggedInUser.lastName : '';
    this.loggedInUserPhoneNumber = this.loggedInUser !== undefined ? this.loggedInUser.phoneNumber : '';
    this.loggedInUserType = this.loggedInUser !== undefined ? this.loggedInUser.userType : '';
    this.loggedInUserAddress = this.loggedInUser !== undefined ? this.loggedInUser.address : '';
    this.loggedInUserCity = this.loggedInUser !== undefined ? this.loggedInUser.city : '';
    this.loggedInUserProvince = this.loggedInUser !== undefined ? this.loggedInUser.province : '';
    this.loggedInUserPostalCode = this.loggedInUser !== undefined ? this.loggedInUser.postalCode : '';
    this.loggedInUserEmail = this.loggedInUser !== undefined ? this.loggedInUser.email : '';
    this.provinces = ProvinceEnum;

  }


  // createChangePasswordFormGroup() {
  //   this.changePasswordForm = this.formBuilder.group({
  //
  //     password: ['', Validators.required],
  //     currentPassword: ['', Validators.required],
  //     newPassword: ['', Validators.required],
  //     confirmPassword: ['', Validators.required],
  //   });
  // }

  // onClickSaveButtonPassword() {
  //   if (this.changePasswordForm.valid){
  //   }
  // }

  // get formControls() {
  //   return this.changeAccountForm.controls;
  // }



  createChangeAccountFormGroup() {
    this.changeAccountForm = this.formBuilder.group({
      phoneNumber: [this.loggedInUserPhoneNumber, Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      postalCode: ['', Validators.required],
      password: ['', Validators.required],
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }



  onClickSaveButton() {
    if (this.changeAccountForm.valid){
    }
  }

  get formControls() {

    // this.changeAccountForm.setValue({
    //   phoneNumber: this.loggedInUserPhoneNumber,
    //   address: this.loggedInUserAddress,
    //   city: this.loggedInUserCity,
    //   province: this.loggedInUserProvince,
    //   postalCode: this.loggedInUserPostalCode,
    //   password: '',
    //   currentPassword: '',
    //   newPassword: '',
    //   confirmPassword: '',
    // });
    return this.changeAccountForm.controls;
  }

  returnZero() {
    return 0;
  }

  // goStaff() {
  //   this.router.navigate(['container/staff']);
  // }
  // goUnits() {
  //   this.router.navigate(['container/units']);
  // }
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
