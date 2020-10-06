import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public registrationForm: FormGroup;

  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder) {
    this.createRegistrationFormGroup();
  }

  ngOnInit(): void {
  }

  createRegistrationFormGroup() {
    this.registrationForm = this.formBuilder.group({
      userType: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      password: [''],
      confirmPassword: [''],
      propertyId: [''],
      propertyKey: ['']
    });
  }

  get formControls() {
    return this.registrationForm.controls;
  }

}
