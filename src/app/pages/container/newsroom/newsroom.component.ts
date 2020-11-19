import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddEditNewsDialogComponent} from './add-edit-news-dialog/add-edit-news-dialog.component';
import {NewsModel} from './manager/news.model';
import {NewsService} from '../../../shared-services/news.service';
import {map} from 'rxjs/operators';
import {HideNewsDialogComponent} from './hide-news-dialog/hide-news-dialog.component';
import {PropertyService} from '../../../shared-services/property.service';
import {AuthService} from '../../../shared-services/auth.service';

@Component({
  selector: 'app-newsroom',
  templateUrl: './newsroom.component.html',
  styleUrls: ['./newsroom.component.scss']
})
export class NewsroomComponent implements OnInit {
  panelOpenState = false;
  newsList: NewsModel[];
  news: NewsModel;
  propertyId: string;
  phoneNumber: string;

  constructor(public dialog: MatDialog,
              public propertyService: PropertyService,
              private authService: AuthService,
              private newsService: NewsService) { }

  ngOnInit(): void {
    this.propertyId = this.propertyService.GetPropertyInSession().propId;
    this.phoneNumber = this.authService.GetUserInSession().phoneNumber;
    this.newsService.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c => ({
        key: c.payload.key, ...c.payload.val()
      })))
    ).subscribe(data => {
      this.newsList = data.reverse().filter(a => !a.hideFlag).filter(a => a.propId === this.propertyId);
    });
  }

  public openAddNewsDialog(){
    const dialogFilter = this.dialog.open(AddEditNewsDialogComponent, {
      height: '680px',
      width: '1200px',
      data: {news: null, propId: this.propertyId, phoneNumber: this.phoneNumber},
      disableClose: false
    });
  }

  public openEditDialog(newsObject: NewsModel){
    const dialogFilter = this.dialog.open(AddEditNewsDialogComponent, {
      height: '680px',
      width: '1200px',
      data: {news: newsObject},
      disableClose: false
    });
  }

  public openHideDialog(newsObject: NewsModel){
    const dialogFilter = this.dialog.open(HideNewsDialogComponent, {
      height: '200px',
      width: '400px',
      data: {news: newsObject},
      disableClose: false
    });
  }
}
