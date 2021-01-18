import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";
import {FirebaseFormsModel} from "../pages/container/forms/manager/firebase-forms.model";
import {AuthService} from "./auth.service";
import {PropertyService} from "./property.service";

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private dbPath = '/form'

  formsRef: AngularFireList<FirebaseFormsModel> = null;
  formsRefCreate: AngularFireList<FirebaseFormsModel> = null;

  constructor(private db: AngularFireDatabase,
              private propertyService: PropertyService,
              private authService: AuthService) {

    this.formsRef = db.list(this.dbPath, ref =>
    ref.orderByChild('formTitle')
    );
    this.formsRefCreate = db.list(this.dbPath);
  }

  create(value: any): any {
    return this.formsRefCreate.push(value);
  }

  update(key: string, value: any): any {
    return this.formsRef.update(key, value)
  }


  getAll(): AngularFireList<FirebaseFormsModel> {
    return this.formsRef;
  }

  upload(value: any): any {
    return this.formsRefCreate.push(value);
  }

  delete(key: string): Promise<void> {
    return this.formsRef.remove(key);
  }

}

