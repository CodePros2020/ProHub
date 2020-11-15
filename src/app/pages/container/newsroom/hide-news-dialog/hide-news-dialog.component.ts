import { Component, OnInit, Inject } from '@angular/core';
import {NewsService} from '../../../../shared-services/news.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NewsModel} from '../manager/news.model';

@Component({
  selector: 'app-hide-news-dialog',
  templateUrl: './hide-news-dialog.component.html',
  styleUrls: ['./hide-news-dialog.component.scss']
})
export class HideNewsDialogComponent implements OnInit {

  key: string;
  news: NewsModel;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private newsService: NewsService) {
    this.key = data.key;
    this.news = data.news;
  }

  ngOnInit(): void {

  }

  public HideNews() {
    this.newsService.hide(this.key, this.news).then( () => {
      console.log('news hidden!');
    });
  }
}
