import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { FirebasePropertiesModel } from '../pages/container/property-list/manager/firebase-properties.model';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private dbPath = '/users';

  settingsRef: AngularFireList<FirebasePropertiesModel> = null;

  constructor(private db: AngularFireDatabase) {
    this.settingsRef = db.list(this.dbPath, ref =>
      ref.orderByChild('uid'));
  }

  update(key: string, value: any): Promise<void> {
    return this.settingsRef.update(key, value);
  }
}

