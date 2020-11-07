import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MapsNominatimService} from "../../../../shared-services/maps-nominatim.service";
import {PropertyModel} from "../../property-list/manager/property.model";
import {now} from "lodash-es";
import {MatDialogRef} from "@angular/material/dialog";
import {FormModel} from "../manager/form.model";
import {PropertyService} from "../../../../shared-services/property.service";
import {FormService} from "../../../../shared-services/form.service";
import {AngularFireStorage} from "@angular/fire/storage";
import {finalize} from "rxjs/operators";
import {FileService} from "../../../../shared-services/file.service";

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
  public formModel: FormModel;

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

  propId: string;

  // constructors
  constructor(
    public dialogRef: MatDialogRef<UploadFormDialogComponent>,
    private formService: FormService,
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    @Inject(FileService) private fileService: FileService
  ) {
    this.isEditMode = false;
    this.isFileUploaded = false;
    //
    this.form = {
      filename: "",
      fileextension: "",
      upload_date: "",
      size: 0,
      filedata: null
    };
    this.formModel = new FormModel();

    this.createUploadFormGroup();
  }

  // life cycle hooks
  ngOnInit(): void {
  }


  createUploadFormGroup() {
    this.uploadFormForm = this.formBuilder.group({
      fileInput: ['', Validators.required],
      fileNameInput: ['', Validators.required],
    });
  }

  get formControls() {
    return this.uploadFormForm.controls;
  }

  // event handlers
  onFileChange(event: any): void{
    this.files = event.target.files;

    this.form.filename = this.files[0].name.split('.').shift();
    this.form.fileextension = this.files[0].name.split('.').pop();

    this.selectedFileName = this.files[0].name;
    this.isFileUploaded = true;
  }

  onFileNameChange(event: any): void{
    this.form.filename = event.target.value;
  }


  // private methods
  readyToUpload(){
    return this.isFileUploaded && this.fileNameInput.nativeElement.value;
  }

  removeFile(){
    this.fileInput.nativeElement.value = null;
    this.fileNameInput.nativeElement.value = '';
    this.isFileUploaded = false;
  }


  save(): void {
    // lastModified: 1604417095152
    // lastModifiedDate: Tue Nov 03 2020 10:24:55 GMT-0500 (アメリカ東部標準時) {}
    // name: "Division of Labour.pdf"
    // size: 404875
    // type: "application/pdf"
    // webkitRelativePath: ""

    console.log(this.files[0]);
    let newFileName = this.form.filename + '.' +this.form.fileextension;
    console.log(newFileName);

    const fileRef = this.storage.ref("form/" + this.propId + "/"  + newFileName);

    this.storage.upload("form/" + this.propId + "/" + newFileName ,this.files[0])
      .snapshotChanges().pipe(
        finalize(()=>{
          fileRef.getDownloadURL().subscribe((url)=>{
            // this.url = url;

             this.formModel.filename = newFileName;
             this.formModel.propId = "";
             this.formModel.contentUrl = url;
             this.formModel.upload_date = Date.now().toString();
             this.formService.upload(this.formModel).then(()=>{
               this.dialogRef.close('added');
             });

            // this.fileService.insertImageDetails(this.id,this.url);
            // alert('Upload Successful');
          })
        })
    ).subscribe();

    // 2.
    // if (this.uploadFormForm.valid) {
    //   alert(this.uploadFormForm.controls.fileNameImput.value);
    //
    //  this.formModel.filename = this.uploadFormForm.controls.;
    //  this.formModel.propId = "";
    //  this.formModel.contentUrl = "";
    //  this.formModel.upload_date = Date.now();
    //  this.formService.upload(this.formModel);
    //   this.dialogRef.close('added');
    //
    // }

  }

  view(){
    this.fileService.getImage(this.files[0]);
  }

  cancel() {
    this.dialogRef.close();
  }

}
