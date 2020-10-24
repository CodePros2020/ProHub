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

  constructor(private db: AngularFireDatabase) {
    this.propertiesRef = db.list(this.dbPath, ref =>
      ref.orderByChild('phone').equalTo(this.lessorPhoneNumber));
  }

  getAll(): AngularFireList<FirebasePropertiesModel> {
    return this.propertiesRef;
  }
}
