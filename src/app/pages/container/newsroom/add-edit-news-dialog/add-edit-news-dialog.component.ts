import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NewsModel} from '../manager/news.model';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {NewsService} from '../../../../shared-services/news.service';
import {AddAttachmentDialogComponent} from './add-attachment-dialog/add-attachment-dialog.component';
import {AddImageDialogComponent} from './add-image-dialog/add-image-dialog.component';
import {GenericMessageDialogComponent} from '../../../../shared-components/genericmessagedialog/genericmessagedialog.component';
import {Select} from '../../settings/staff-management/add-edit-staff/add-edit-staff.component';

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
  viewerOptions: Select[] = [
    { value: 'All'},
    { value: 'Management Only' },
  ];

  constructor(public dialog: MatDialog, public formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA)private data: any, public newsService: NewsService) {

  }

  ngOnInit(): void {
    if (this.data.newsObject != null){
      this.news = this.data.newsObject;
      this.propId = this.news.propId;
      this.phoneNumber = this.news.creatorPhoneNumber;
      this.EditNews(this.data.newsObject);
    }
    else{
      this.propId = this.data.propId;
      this.phoneNumber = this.data.phoneNumber;
      this.CreateNews();
    }
  }

  EditNews(news: NewsModel) {
    this.newsForm = this.formBuilder.group({
      newsTitle: [news.newsTitle, Validators.required],
      content: [news.content, Validators.required],
      imageUrl: [news.imageUrl, Validators.required],
      hideFlag: [news.hideFlag, Validators.required],
      targetViewer: [news.targetViewer, Validators.required],
    });
  }

  public CreateNews() {
    this.newsForm = this.formBuilder.group({
      newsTitle: ['', Validators.required],
      content: ['', Validators.required],
      imageUrl: '',
      hideFlag: [false, Validators.required],
      targetViewer: ['', Validators.required],
    });
  }

  public openAddAttachDialog(){
    const dialogFilter = this.dialog.open(AddAttachmentDialogComponent, {
      height: '40%',
      width: '50%',
      autoFocus: false,
    });
    dialogFilter.afterClosed().subscribe(result => {
      if (result !== false) {
        this.newsForm.controls.imageUrl.setValue(result);
      }
    });
  }

  public openAddImageDialog(){
    const dialogFilter = this.dialog.open(AddImageDialogComponent, {
      height: '40%',
      width: '50%',
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
      this.news.createTime = new Date().toJSON('yyyy/MM/dd HH:mm');
      this.news.imageUrl = this.newsForm.controls.imageUrl.value;
      this.news.propId = this.propId;
      this.news.creatorPhoneNumber = this.phoneNumber;

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


}

