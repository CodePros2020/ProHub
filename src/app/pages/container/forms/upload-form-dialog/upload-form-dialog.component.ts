import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MapsNominatimService} from "../../../../shared-services/maps-nominatim.service";
import {PropertyModel} from "../../property-list/manager/property.model";
import {now} from "lodash-es";
import {MatDialogRef} from "@angular/material/dialog";

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
    public dialogRef: MatDialogRef<UploadFormDialogComponent>,
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

  files: any[];

  OnFileChange(event:any) :void{
    this.files = event.target.files;
    this.form.filename = this.files[0].name;
//    alert(this.files[0].name);
//    console.log(event);
  }


  public uploadForm() : void {
   alert(this.form.filename);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
