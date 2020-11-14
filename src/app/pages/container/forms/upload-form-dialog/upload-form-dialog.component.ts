import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapsNominatimService } from '../../../../shared-services/maps-nominatim.service';
import { PropertyModel } from '../../property-list/manager/property.model';
import { now } from 'lodash-es';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormModel } from '../manager/form.model';
import { PropertyService } from '../../../../shared-services/property.service';
import { FormService } from '../../../../shared-services/form.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { FileService } from '../../../../shared-services/file.service';
import { AuthService } from '../../../../shared-services/auth.service';
import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';

@Component({
  selector: 'app-upload-form-dialog',
  templateUrl: './upload-form-dialog.component.html',
  styleUrls: ['./upload-form-dialog.component.scss'],
})
export class UploadFormDialogComponent implements OnInit {
  // property decorators
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileNameInput') fileNameInput: ElementRef;

  // public fields
  public uploadFormForm: FormGroup;
  public formModel: FormModel;
  // propId ="-M3Xe58nTHXxnaM6Mp-m";
  propId = 'temp';

  filename: string;
  fileextension: string;

  // private fields
  files: any[];
  isEditMode: boolean;
  isFileUploaded: boolean;
  selectedFileName: string;
  isLoading: boolean = false;

  formKey;

  // constructors
  constructor(
    public dialogRef: MatDialogRef<UploadFormDialogComponent>,
    private formService: FormService,
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private authService: AuthService,
    @Inject(FileService) private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = this.data.update;

    if (this.isEditMode) {
      this.formModel = this.data.form;
      this.isFileUploaded = true;

      this.selectedFileName = this.formModel.formTitle;
      this.filename = this.formModel.formTitle.split('.').shift();
      this.fileextension = this.formModel.formTitle.split('.').pop();

      this.formKey = this.formModel.key;
      console.log(this.formKey);
    } else {
      this.isFileUploaded = false;
      // this.formModel = new FormModel();
      this.formModel = this.data.form;

      this.formKey = this.formService.create(this.formModel).key;
    }

    this.formModel.propId = this.propId;
    this.createUploadFormGroup();
  }

  // life cycle hooks
  ngOnInit(): void {}

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
  onFileChange(event: any): void {
    this.files = event.target.files;
    this.selectedFileName = this.files[0].name;
    this.isFileUploaded = true;

    this.filename = this.files[0].name.split('.').shift();
    this.fileextension = this.files[0].name.split('.').pop();

    this.formModel.formTitle = this.selectedFileName;
  }

  onFileNameChange(event: any): void {
    this.filename = event.target.value;
    this.formModel.formTitle = this.filename + '.' + this.fileextension;
  }

  // private methods
  readyToUpload() {
    // return this.isFileUploaded && this.fileNameInput.nativeElement.value;
    return this.isFileUploaded && this.fileNameInput.nativeElement.value !== '';
  }

  removeFile() {
    this.fileInput.nativeElement.value = null;
    this.fileNameInput.nativeElement.value = '';
    this.isFileUploaded = false;
  }

  save(): void {
    if (this.readyToUpload()) {
      this.isLoading = true;

      if (this.isEditMode) {
        this.formService.update(this.formKey, this.formModel).then(() => {
          this.dialogRef.close('added');
        });
      } else {
        let newFileName = this.formModel.formTitle;

        const fileRef = this.storage.ref(
          'form/' + this.propId + '/' + this.formKey
        );
        this.storage
          .upload('form/' + this.propId + '/' + this.formKey, this.files[0])
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((url) => {
                this.formModel.formTitle = newFileName;
                // this.formModel.propId = this.propId;
                //              this.formModel.propId = "XXXX";
                this.formModel.contentUrl = url;
                this.formModel.dateCreated = new Date().toISOString();

                // this.formService.upload(this.formModel).then(()=>{
                //   this.dialogRef.close('added');
                // });
                this.formService
                  .update(this.formKey, this.formModel)
                  .then(() => {
                    this.dialogRef.close('added');
                  });
              });
            })
          )
          .subscribe();
      }
    }
  }

  view() {
    this.fileService.getImage(this.files[0]);
  }

  cancel() {
    this.dialogRef.close();
  }
}
