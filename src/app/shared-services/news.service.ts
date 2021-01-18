import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {AuthService} from './auth.service';
import {NewsModel} from '../pages/container/newsroom/manager/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService{
  private dbPath = '/news';
  propId: string;
  newsRef: AngularFireList<NewsModel> = null;

  constructor(private db: AngularFireDatabase,
              private authService: AuthService) {
    this.propId = this.authService.GetUserInSession().propId;

    this.newsRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<NewsModel> {
    return this.newsRef;
  }

  delete(key: string): Promise<void> {
    return this.newsRef.remove(key);
  }

  save(news: NewsModel): Promise<void> {
    if (news.key !== ''){
      return this.newsRef.update(news.key, news);
    }
    else {
      const newsId = this.db.createPushId();
      news.key = newsId;
      return this.db.database.ref('news').child(newsId).set(news);
    }
  }

  update(key: string, news: NewsModel): Promise<void> {
    return this.newsRef.update(key, news);
  }

  hide(key: string, news: NewsModel): Promise<void> {
    news.hideFlag = true;
    return this.newsRef.update(key, news);
  }
}
