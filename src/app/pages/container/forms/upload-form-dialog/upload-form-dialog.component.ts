import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MapsNominatimService} from "../../../../shared-services/maps-nominatim.service";
import {PropertyModel} from "../../property-list/manager/property.model";

@Component({
  selector: 'app-upload-form-dialog',
  templateUrl: './upload-form-dialog.component.html',
  styleUrls: ['./upload-form-dialog.component.scss']
})
export class UploadFormDialogComponent implements OnInit {

  public uploadFormForm: FormGroup;
//  public formModel: FormModel

  isEditMode: boolean;

  constructor(
    private formBuilder: FormBuilder,
              /* form service here*/) {
    this.isEditMode = false;
  }

  ngOnInit(): void {
  }

  close(){
    this.close();
  }
}
