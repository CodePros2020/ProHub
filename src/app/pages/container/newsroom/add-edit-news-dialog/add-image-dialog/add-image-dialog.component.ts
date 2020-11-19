import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FileService} from '../../../../../shared-services/file.service';

@Component({
  selector: 'app-add-image-dialog',
  templateUrl: './add-image-dialog.component.html',
  styleUrls: ['./add-image-dialog.component.scss']
})
export class AddImageDialogComponent implements OnInit {
  @ViewChild('fileSelectInputDialog') fileSelectInputDialog: ElementRef;
  downloadURL: string;
  isUploaded = false;

  constructor(private dialogRef: MatDialogRef<AddImageDialogComponent>,
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
    this.isUploaded = this.fileService.uploadPhoto(event, 'news/');
  }

  sendImage() {
    this.downloadURL = this.fileService.downloadURL;
    this.dialogRef.close(this.downloadURL);
  }
}
