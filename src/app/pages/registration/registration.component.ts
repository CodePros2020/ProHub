import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {EmailVerificationDialogComponent} from './email-verification-dialog/email-verification-dialog.component';
import {FirebaseService} from '../../shared-service/firebase.service';
import {UserPasswordService} from '../../shared-service/user-password.service';
import {RegistrationModel} from './manager/registration.model';

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

  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private router: Router,
              private activeRoute: ActivatedRoute,
              public firebaseService: FirebaseService,
              public userPasswordService: UserPasswordService) {
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
      email: [''],
      // [Validators.required, Validators.email]
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      propertyId: [''],
      propertyKey: [''],
      propertyName: [''],
      location: ['']
    });
  }

  get formControls() {
    return this.registrationForm.controls;
  }

  onClickBackButton() {
    this.router.navigate(['.'], {relativeTo: this.activeRoute.parent});
  }

  onClickCreateButton(){
    if (this.registrationForm.valid){
      this.user.firstName = this.formControls.firstName.value;
      this.user.lastName = this.formControls.lastName.value;
      this.user.email = this.formControls.email.value;
      this.user.phone = this.formControls.phone.value;
      this.user.password = this.userPasswordService.hashPassword(this.formControls.password.value);
      this.firebaseService.addUser(this.user).then(this.router.navigate['/login']);
    }
  }

  openEmailVerificationDialog() {
    const dialog = this.dialog.open(EmailVerificationDialogComponent, {
      height: '550px',
      width: '700px',
      disableClose: true,
      panelClass: 'no-padding-container'
    });
  }

}
