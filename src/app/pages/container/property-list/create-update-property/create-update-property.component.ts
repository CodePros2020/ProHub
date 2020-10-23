import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-create-update-property',
  templateUrl: './create-update-property.component.html',
  styleUrls: ['./create-update-property.component.scss']
})
export class CreateUpdatePropertyComponent implements OnInit, AfterViewInit {

  isEditMode;

  constructor() {
    this.isEditMode = false;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }
}
