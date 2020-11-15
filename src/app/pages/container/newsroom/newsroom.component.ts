import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddEditNewsDialogComponent} from './add-edit-news-dialog/add-edit-news-dialog.component';
import {NewsModel} from './manager/news.model';
import {NewsService} from '../../../shared-services/news.service';
import {map} from 'rxjs/operators';
import {HideNewsDialogComponent} from './hide-news-dialog/hide-news-dialog.component';

@Component({
  selector: 'app-newsroom',
  templateUrl: './newsroom.component.html',
  styleUrls: ['./newsroom.component.scss']
})
export class NewsroomComponent implements OnInit {
  panelOpenState = false;
  newsList: NewsModel[];
  news: NewsModel;

  constructor(public dialog: MatDialog,
              private newsService: NewsService) { }

  ngOnInit(): void {
    this.newsService.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c => ({
        key: c.payload.key, ...c.payload.val()
      })))
    ).subscribe(data => {
      this.newsList = data;
    });
  }

  public openAddNewsDialog(){
    const dialogFilter = this.dialog.open(AddEditNewsDialogComponent, {
      height: '400px',
      width: '850px',
      disableClose: false
    });
  }

  public openEditDialog(key: string){
    const dialogFilter = this.dialog.open(AddEditNewsDialogComponent, {
      height: '400px',
      width: '850px',
      data: {key: key},
      disableClose: false
    });
  }

  public openHideDialog(newsKey: string, newsObject: NewsModel){
    const dialogFilter = this.dialog.open(HideNewsDialogComponent, {
      height: '200px',
      width: '400px',
      data: {key: newsKey, news: newsObject},
      disableClose: false
    });
  }
}
