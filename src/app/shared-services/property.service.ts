import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { FirebasePropertiesModel } from '../pages/container/property-list/manager/firebase-properties.model';
import {AuthService} from './auth.service';
import {PropertyModel} from '../pages/container/property-list/manager/property.model';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private dbPath = '/properties';
  lessorPhoneNumber;
  public propId: string;
  property: PropertyModel;


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
    this.property = new PropertyModel();
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
     value.propId = this.propId;
     return this.db.database.ref('properties').child(value.propId).set(value);
  }
  getPropId(){
  return  this.propId;
}
  getPropertyById(propID: string){
    return this.db.object('/properties/' + propID).valueChanges();
  }
  setProperty(property) {
    console.log('Setting prop');
    this.property.creatorEmail = property.creatorEmail;
    this.property.city = property.city;
    this.property.key = property.key;
    this.property.lat = property.lat;
    this.property.long = property.long;
    this.property.name = property.name;
    this.property.phone = property.phone;
    this.property.postalCode = property.postalCode;
    this.property.propId = property.propId;
    this.property.province = property.province;
    this.property.streetLine1 = property.string;
    this.property.streetLine2 = property.streetLine2;
  }
  getClickedProp(){
    return this.property;
  }



}

