import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../shared-services/auth.service';
import {ProvinceEnum} from '../../../shared-models/enum/province.enum';
import {RegistrationModel} from '../../registration/manager/registration.model';
import {FirebaseService} from '../../../shared-services/firebase.service';
import {UploadImageDialogComponent} from './staff-management/upload-image-dialog/upload-image-dialog.component';
import {SettingsService} from '../../../shared-services/settings.service';
import {GenericMessageDialogComponent} from '../../../shared-components/genericmessagedialog/genericmessagedialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  loggedInUserName: string;
  loggedInUser: any;
  loggedInUserAddress: string;
  loggedInUserCity: string;
  loggedInUserProvince: string;
  loggedInUserPostalCode: string;
  loggedInUserPhoneNumber: string;
  loggedInUserType: string;
  loggedInUserEmail: string;
  loggedInUserPhoto: string;

  public hideCurrent = true;
  public showFirst = true;
  public provinces;
  public user: RegistrationModel;
  public changeAccountForm: FormGroup;
  isSuccess = false;

  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              public router: Router,
              public authService: AuthService,
              public firebaseService: FirebaseService,
              public settingsService: SettingsService
              ) {
  }


  ngOnInit(): void {
    this.loggedInUser = this.authService.GetUserInSession();
    this.loggedInUserType = this.loggedInUser !== undefined ? this.loggedInUser.userType : '';
    this.loggedInUserEmail = this.loggedInUser !== undefined ? this.loggedInUser.email : '';
    this.loggedInUserPhoto = this.loggedInUser !== undefined ? this.loggedInUser.photoURL : '';
    this.loggedInUserName = this.loggedInUser !== undefined ? this.loggedInUser.firstName + ' ' + this.loggedInUser.lastName : '';
    this.loggedInUserPhoneNumber = this.loggedInUser !== undefined ? this.loggedInUser.phoneNumber : '';
    this.loggedInUserAddress = this.loggedInUser !== undefined ? this.loggedInUser.address : '';
    this.loggedInUserCity = this.loggedInUser !== undefined ? this.loggedInUser.city : '';
    this.loggedInUserProvince = this.loggedInUser !== undefined ? this.loggedInUser.province : '';
    this.loggedInUserPostalCode = this.loggedInUser !== undefined ? this.loggedInUser.postalCode : '';
    this.provinces = ProvinceEnum;
    this.createChangeAccountFormGroup();
  }


  createChangeAccountFormGroup() {
    this.changeAccountForm = this.formBuilder.group({
      phoneNumber: [this.loggedInUserPhoneNumber, Validators.required],
      address: [this.loggedInUserAddress, Validators.required],
      city: [this.loggedInUserCity, Validators.required],
      province: [this.loggedInUserProvince, Validators.required],
      postalCode: [this.loggedInUserPostalCode, Validators.required],
      photo: [this.loggedInUserPhoto],
    });
  }


  // Save Button for the form
  onClickSaveButton() {
    if (this.changeAccountForm.valid){
      this.user = new RegistrationModel();

      this.user.phoneNumber = this.formControls.phoneNumber.value;
      this.user.address = this.formControls.address.value;
      this.user.city = this.formControls.city.value;
      this.user.province = this.formControls.province.value;
      this.user.postalCode = this.formControls.postalCode.value;
      this.user.photoURL = this.formControls.photo.value;

      this.user.firstName = this.loggedInUser.firstName;
      this.user.lastName = this.loggedInUser.lastName;
      this.user.email = this.loggedInUser.email;
      this.user.userType = this.loggedInUser.userType;
      this.user.uid = this.loggedInUser.uid;

      console.log(this.user);
      this.authService.SetUserInSession(this.user);
      this.settingsService.update(this.user.uid, this.user).then(() => {
        this.dialog.open(GenericMessageDialogComponent, {
          height: '250px',
          width: '500px',
          autoFocus: false,
          data: {title: 'SUCCESS', message: 'Account updated.'}
        });
      });

    }
  }


  get formControls() {
    return this.changeAccountForm.controls;
  }


  returnZero() {
    return 0;
  }

  // Change Password Reset Button
  onClickResetButton(){
    const email = this.loggedInUserEmail;
    this.authService.ForgotPassword(email).then( () => {
      this.dialog.open(GenericMessageDialogComponent, {
        height: '250px',
        width: '500px',
        autoFocus: false,
        data: {title: 'PASSWORD RESET', message: 'Please check your email.'}
      });
    });
  }


  getImageLink(){
    return this.formControls.photo.value || '/assets/no-photo.png';
  }


  // Photo Upload Dialog
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
        this.onClickSaveButton();
      }
    });
  }
}
