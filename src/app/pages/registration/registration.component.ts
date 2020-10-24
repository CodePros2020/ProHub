import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseService} from '../../shared-services/firebase.service';
import {UserPasswordService} from '../../shared-services/user-password.service';
import {RegistrationModel} from './manager/registration.model';
import {AuthService} from '../../shared-services/auth.service';

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
  public provinces = PROVINCE_LIST;

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
      this.user.phone = this.formControls.phone.value;
      this.user.address = this.formControls.address.value;
      this.user.city = this.formControls.city.value;
      this.user.postalCode = this.formControls.postalCode.value;
      this.user.userType = this.formControls.userType.value;
      this.user.province = this.formControls.province.value;
      this.firebaseService.addUser(this.user);
    }
  }


}

export interface Select {
  value: string;
  viewValue: string;
}
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
