import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {AuthService} from './auth.service';
import {NewsModel} from '../pages/container/newsroom/manager/news.model';
import {FirebaseFormsModel} from '../pages/container/forms/manager/firebase-forms.model';

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

  update(key: string, news: NewsModel): Promise<void> {
    return this.newsRef.update(key, news);
  }

  hide(key: string, news: NewsModel): Promise<void> {
    news.hideFlag = true;
    return this.newsRef.update(key, news);
  }
}
