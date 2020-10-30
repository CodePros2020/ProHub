import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";
import {FirebaseFormsModel} from "../pages/container/forms/manager/firebase-forms.model";

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private dbPath = '/form'
  private propId ="M3Xe58nTHXxnaM6Mp-m";
  formsRef: AngularFireList<FirebaseFormsModel> = null;

  constructor(private db: AngularFireDatabase) {
    this.formsRef = db.list(this.dbPath, ref =>
      ref.orderByChild('phone').equalTo(this.propId));
  }

  getAll(): AngularFireList<FirebaseFormsModel> {
    return this.formsRef;
  }
}

