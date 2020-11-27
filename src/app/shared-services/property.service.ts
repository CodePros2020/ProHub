import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { FirebasePropertiesModel } from '../pages/container/property-list/manager/firebase-properties.model';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private dbPath = '/properties';
  lessorPhoneNumber;
  public propId: string;


  propertiesRef: AngularFireList<FirebasePropertiesModel> = null;
  propertiesRefCreate: AngularFireList<FirebasePropertiesModel> = null;

  constructor(private db: AngularFireDatabase,
              private authService: AuthService) {
    this.lessorPhoneNumber = this.authService.GetUserInSession().phoneNumber;
    this.propertiesRef = db.list(this.dbPath, ref =>
      ref.orderByChild('phone').equalTo(this.lessorPhoneNumber));
    this.propertiesRefCreate = db.list(this.dbPath);
    // Assigning Property Id
    this.propId = this.db.createPushId();
  }

  getAll(): AngularFireList<FirebasePropertiesModel> {
    return this.propertiesRef;
  }

  getPropertyById(id) {
    return this.db.object('/properties/' + id).valueChanges();
  }

  delete(key: string): Promise<void> {
    return this.propertiesRef.remove(key);
  }

  update(key: string, value: any): Promise<void> {
    return this.propertiesRef.update(key, value);
  }

  create(value: any): any {
     value.propId = this.propId;
     return this.db.database.ref('properties').child(value.propId).set(value);
  }

  setProperty(property) {
    console.log('Setting prop', property);
    localStorage.setItem('property', JSON.stringify(property));
  }

  GetPropertyInSession() {
    return JSON.parse(localStorage.getItem('property'));
  }

  RemovePropertyInSession(){
    localStorage.removeItem('property');
  }

}

