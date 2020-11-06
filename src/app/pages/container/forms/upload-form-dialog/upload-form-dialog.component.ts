import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
  // property decorators
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileNameInput') fileNameInput: ElementRef;

  // public fields
  public uploadFormForm: FormGroup;
  public form: {
    filename: string,
    fileextension: string,
    upload_date: string,
    size: number,
    filedata: File | null,
  };

  // private fields
  files: any[];
  isEditMode: boolean;
  isFileUploaded: boolean;
  selectedFileName: string;

  // constructors
  constructor(public dialogRef: MatDialogRef<UploadFormDialogComponent>) {
    this.isEditMode = false;
    this.isFileUploaded = false;
    //
    this.form = {
      filename: "",
      fileextension: "",
      upload_date: "",
      size: 0,
      filedata: null
    }
  }

  // life cycle hooks
  ngOnInit(): void {
  }

  // event handlers
  onFileChange(event:any) :void{
    this.files = event.target.files;

    this.form.filename = this.files[0].name.split('.').shift();
    this.form.fileextension = this.files[0].name.split('.').pop();

    this.selectedFileName = this.files[0].name;
    this.isFileUploaded = true;
  }

  // private methods
  readyToUpload(){
    return this.isFileUploaded && this.fileNameInput.nativeElement.value;
  }

  removeFile(){
    this.fileInput.nativeElement.value = null;
    this.fileNameInput.nativeElement.value = "";
    this.isFileUploaded = false;
  }

  save() : void {
    // UNDER DEVELOPMENT
    // this.form.upload_date = Date.now().toString();
    // console.log(this.form);
    // alert(this.form.filename);
  }


  cancel() {
    this.dialogRef.close();
  }
}
