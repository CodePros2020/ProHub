import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";
import {FirebaseFormsModel} from "../pages/container/forms/manager/firebase-forms.model";
import {FirebasePropertiesModel} from "../pages/container/property-list/manager/firebase-properties.model";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private dbPath = '/form'
  // private propId ="M3Xe58nTHXxnaM6Mp-m";

  formsRef: AngularFireList<FirebaseFormsModel> = null;
  // formsRefCreate: AngularFireList<FirebaseFormsModel> = null;
  propId;

  constructor(private db: AngularFireDatabase,
              private authService: AuthService) {
    this.propId = this.authService.GetUserInSession().propId;

    this.formsRef = db.list(this.dbPath);

    // this.formsRefCreate = db.list(this.dbPath);
  }

  getAll(): AngularFireList<FirebaseFormsModel> {
    return this.formsRef;
  }

  delete(key: string): Promise<void> {
    return this.formsRef.remove(key);
  }

}

