import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {EmailVerificationDialogComponent} from './email-verification-dialog/email-verification-dialog.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public registrationForm: FormGroup;
  public hide = true;
  public hideConfirmPassword = true;

  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private router: Router,
              private activeRoute: ActivatedRoute) {
    this.createRegistrationFormGroup();
  }

  ngOnInit(): void {
  }

  createRegistrationFormGroup() {
    this.registrationForm = this.formBuilder.group({
      userType: ['personal'],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      propertyId: ['', Validators.required],
      propertyKey: ['', Validators.required],
      propertyName: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  get formControls() {
    return this.registrationForm.controls;
  }

  onClickBackButton() {
    this.router.navigate(['.'], {relativeTo: this.activeRoute.parent});
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
