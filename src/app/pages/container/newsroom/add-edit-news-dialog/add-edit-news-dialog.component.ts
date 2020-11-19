import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsModel} from '../manager/news.model';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {NewsService} from '../../../../shared-services/news.service';
import {AddAttachmentDialogComponent} from './add-attachment-dialog/add-attachment-dialog.component';
import {AddImageDialogComponent} from './add-image-dialog/add-image-dialog.component';
import {GenericMessageDialogComponent} from '../../../../shared-components/genericmessagedialog/genericmessagedialog.component';
import {Select} from '../../settings/staff-management/add-edit-staff/add-edit-staff.component';
import {SafePipeline} from '../manager/SafePipe.model';

@Component({
  selector: 'app-add-edit-news-dialog',
  templateUrl: './add-edit-news-dialog.component.html',
  styleUrls: ['./add-edit-news-dialog.component.scss']
})

export class AddEditNewsDialogComponent implements OnInit {
  newsForm: FormGroup;
  news: NewsModel;
  propId: string;
  phoneNumber: string;
  keyId: string;
  viewerOptions: Select[] = [
    { value: 'All'},
    { value: 'Management Only' },
  ];

  // tslint:disable-next-line:no-shadowed-variable
  constructor(public dialog: MatDialog, public formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA)private data: any, public newsService: NewsService) {
    this.news = new NewsModel();
  }

  ngOnInit(): void {
    if (this.data.news != null){
      this.news = this.data.news;
      this.propId = this.news.propId;
      this.phoneNumber = this.news.creatorPhoneNumber;
      this.keyId = this.news.key;
      this.EditNews();
    }
    else {
      this.propId = this.data.propId;
      this.phoneNumber = this.data.phoneNumber;
      this.keyId = '';
      this.CreateNews();
    }
    console.log(this.keyId);
  }

  EditNews() {
    this.newsForm = this.formBuilder.group({
      newsTitle: [this.news.newsTitle, Validators.required],
      content: [this.news.content, Validators.required],
      imageUrl: [this.news.imageUrl, Validators.required],
      fileUrl: [this.news.fileUrl, Validators.required],
      hideFlag: [this.news.hideFlag, Validators.required],
      targetViewer: [this.news.targetViewer, Validators.required],
    });
  }

  public CreateNews() {
    this.newsForm = this.formBuilder.group({
      newsTitle: ['', Validators.required],
      content: ['', Validators.required],
      imageUrl: '',
      fileUrl: undefined,
      hideFlag: [false, Validators.required],
      targetViewer: ['', Validators.required],
    });
  }

  public openAddAttachDialog(){
    const dialogFilter = this.dialog.open(AddAttachmentDialogComponent, {
      height: '30%',
      width: '30%',
      autoFocus: false,
    });
    dialogFilter.afterClosed().subscribe(result => {
      if (result !== false) {
        this.newsForm.controls.fileUrl.setValue(result);
      }
    });
  }

  public openAddImageDialog(){
    const dialogFilter = this.dialog.open(AddImageDialogComponent, {
      height: '30%',
      width: '30%',
      autoFocus: false,
    });
    dialogFilter.afterClosed().subscribe(result => {
      if (result !== false) {
        this.newsForm.controls.imageUrl.setValue(result);
      }
    });
  }

  public SaveNews(){
    if (this.newsForm.valid){
      this.news.newsTitle = this.newsForm.controls.newsTitle.value;
      this.news.content = this.newsForm.controls.content.value;
      this.news.hideFlag = this.newsForm.controls.hideFlag.value;
      this.news.targetViewer = this.newsForm.controls.targetViewer.value;
      this.news.createTime = this.getCurrentTime();
      this.news.imageUrl = this.newsForm.controls.imageUrl.value || '';
      this.news.fileUrl = this.newsForm.controls.fileUrl.value || '';
      this.news.propId = this.propId || '';
      this.news.creatorPhoneNumber = this.phoneNumber || '';
      this.news.key = this.keyId;

      this.newsService.save(this.news).then(() => {
        this.dialog.closeAll();
      });
    }
    else {
      this.openMessageDialog('E R R O R', 'Please enter the required information');
    }
  }

  /**  Error Message pop up */
  openMessageDialog(titleMsg, msg) {
    this.dialog.open(GenericMessageDialogComponent,
      {
        data: {title: titleMsg, message: msg}
      });
  }

  getImageLink() {
    return this.newsForm.controls.imageUrl.value || '/assets/no-photo.png';
  }

  getFileLink() {
    return this.newsForm.controls.fileUrl.value || undefined;
  }

  getCurrentTime() {
    return new Date().toDateString() + ' ' + new Date().toTimeString().split(' ')[0];
  }

}


