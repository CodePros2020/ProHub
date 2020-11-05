import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { FirebasePropertiesModel } from '../pages/container/property-list/manager/firebase-properties.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private dbPath = '/properties';
  private lessorPhoneNumber = '6475545687';

  propertiesRef: AngularFireList<FirebasePropertiesModel> = null;
  propertiesRefCreate: AngularFireList<FirebasePropertiesModel> = null;

  constructor(private db: AngularFireDatabase) {
    this.propertiesRef = db.list(this.dbPath, ref =>
      ref.orderByChild('phone').equalTo(this.lessorPhoneNumber));
    this.propertiesRefCreate = db.list(this.dbPath);
  }

  getAll(): AngularFireList<FirebasePropertiesModel> {
    return this.propertiesRef;
  }

  delete(key: string): Promise<void> {
    return this.propertiesRef.remove(key);
  }

  update(key: string, value: any): Promise<void> {
    return this.propertiesRef.update(key, value);
  }

  create(value: any): any {
    return this.propertiesRefCreate.push(value);
  }
}
