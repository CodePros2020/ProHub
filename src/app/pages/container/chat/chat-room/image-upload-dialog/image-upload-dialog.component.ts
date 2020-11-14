import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
  styleUrls: ['./image-upload-dialog.component.scss']
})
export class ImageUploadDialogComponent implements OnInit {

  @ViewChild('fileSelectInputDialog') fileSelectInputDialog: ElementRef;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: string;
  localUrl: string | ArrayBuffer;
  imgToUpload;

  constructor(private dialogRef: MatDialogRef<ImageUploadDialogComponent>,
              private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  onCancelClick() {
    this.dialogRef.close(false);
  }

  openAddFilesDialog() {
    const e: HTMLElement = this.fileSelectInputDialog.nativeElement;
    e.click();
  }

  upload(event) {

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.localUrl = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }

    this.imgToUpload = event.target.files[0];
    console.log('what is image to upload: ', this.imgToUpload);
  }

  sendImage() {
    if (this.imgToUpload !== undefined) {
      const id = Math.random().toString(36).substring(2);
      this.ref = this.afStorage.ref('chat/' + id);
      this.task = this.ref.put(this.imgToUpload);
      this.uploadProgress = this.task.percentageChanges();
      // this.uploadProgress.subscribe(res => {
      //   console.log('what is upload progress res: ', res);
      //
      //   if (res === 100) {
      //     console.log('progress is 100 now');
      //   }
      // });
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            console.log('what is url: ', url);
            this.downloadURL = url;
            this.dialogRef.close(this.downloadURL);
          });
        })
      ).subscribe();
    }
  }
}
