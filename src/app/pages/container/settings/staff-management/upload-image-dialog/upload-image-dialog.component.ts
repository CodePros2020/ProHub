import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FileService} from '../../../../../shared-services/file.service';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoaderComponent} from '../../../../../shared-components/loader/loader.component';
import {Overlay} from '@angular/cdk/overlay';


@Component({
  selector: 'app-upload-image-dialog',
  templateUrl: './upload-image-dialog.component.html',
  styleUrls: ['./upload-image-dialog.component.scss']
})
export class UploadImageDialogComponent implements OnInit {

  @ViewChild('fileSelectInputDialog') fileSelectInputDialog: ElementRef;
  downloadURL: string;
  isUploaded = false;

  constructor(private dialogRef: MatDialogRef<UploadImageDialogComponent>,
              private fileService: FileService) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(false);
  }
  openAddFilesDialog() {
    const e: HTMLElement = this.fileSelectInputDialog.nativeElement;
    e.click();
  }

  upload(event) {
  this.isUploaded = this.fileService.uploadPhoto(event, 'staff/');
  }

  sendImage() {
   this.downloadURL = this.fileService.downloadURL;
   this.dialogRef.close(this.downloadURL);
  }
}
