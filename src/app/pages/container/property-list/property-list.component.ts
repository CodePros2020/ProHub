import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit {

  public propertyListForm: FormGroup;
  public propertyListResult;

  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder) {
    this.createPropertyListFormGroup();
  }

  ngOnInit(): void {
  }

  createPropertyListFormGroup() {
    this.propertyListForm = this.formBuilder.group({
      propertySearch: ['']
    });
  }

  get formControls() {
    return this.propertyListForm.controls;
  }

}
