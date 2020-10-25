import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MapsNominatimService} from "../../../../shared-services/maps-nominatim.service";
import {PropertyModel} from "../../property-list/manager/property.model";
import {now} from "lodash-es";

@Component({
  selector: 'app-upload-form-dialog',
  templateUrl: './upload-form-dialog.component.html',
  styleUrls: ['./upload-form-dialog.component.scss']
})
export class UploadFormDialogComponent implements OnInit {

  public uploadFormForm: FormGroup;
//  public formModel: FormModel

  public filepath: string = "";

  public form: {
    filename: string;
    upload_date: string;
    size: number;
    filedata: File | null;
  };

  isEditMode: boolean;

  constructor(
    private formBuilder: FormBuilder,
              /* form service here*/) {
    this.isEditMode = false;

    this.form = {
      filename: "",
      upload_date: "",
      size: 0,
      filedata: null
    }
  }

  ngOnInit(): void {
  }



  public OnFileInput(event:any): void {

  }

  public uploadForm() : void {
    this.form.upload_date = "????";

    console.group( "Form View-Model" );
    console.log( "Name:", this.form.filename );
    console.log( "Uploaded_date:", this.form.upload_date );
    console.log( "Size:", this.form.size );
//    console.log( "FileData:", this.form.filedata );
    console.groupEnd();
  }

  close(){
    this.close();
  }
}
