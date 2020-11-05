import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseService} from '../../shared-services/firebase.service';
import {UserPasswordService} from '../../shared-services/user-password.service';
import {RegistrationModel} from './manager/registration.model';
import {AuthService} from '../../shared-services/auth.service';
import {ProvinceEnum} from '../../shared-models/enum/province.enum';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {


  public registrationForm: FormGroup;
  public hide = true;
  public hideConfirmPassword = true;
  public user: RegistrationModel;
  public provinces;

  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private router: Router,
              private activeRoute: ActivatedRoute,
              public firebaseService: FirebaseService,
              public authService: AuthService) {
    this.createRegistrationFormGroup();
    this.user = new RegistrationModel();
  }

  ngOnInit(): void {
    this.provinces = ProvinceEnum;
  }

  // this will ensure that the enum are not sorted alphabetically
  returnZero() {
    return 0;
  }

  createRegistrationFormGroup() {
    this.registrationForm = this.formBuilder.group({
      userType: ['personal'],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{value: this.authService.userData.email, disabled: true}, Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      postalCode: ['', Validators.required],
    });
    // this.formControls.email.disable();
  }

  get formControls() {
    return this.registrationForm.controls;
  }

  onClickBackButton() {
    this.authService.SignOut();
  }

  onClickCreateButton(){
    if (this.registrationForm.valid){
      this.user.firstName = this.formControls.firstName.value;
      this.user.lastName = this.formControls.lastName.value;
      this.user.email = this.authService.userData.email;
      this.user.phoneNumber = this.formControls.phone.value;
      this.user.address = this.formControls.address.value;
      this.user.city = this.formControls.city.value;
      this.user.postalCode = this.formControls.postalCode.value;
      this.user.userType = this.formControls.userType.value;
      this.user.province = this.formControls.province.value;
      this.firebaseService.addUser(this.user, this.authService.userData.uid);
    }
  }
}

