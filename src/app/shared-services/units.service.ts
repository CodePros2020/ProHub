import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireDatabase} from '@angular/fire/database';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UnitModel} from '../pages/container/settings/units-management/manager/Unit.model';
import {map} from 'rxjs/operators';
import {PropertyService} from './property.service';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {
  units: Observable<any[]>;
  allUnits = [];
  unit: UnitModel;
  constructor(private firestore: AngularFirestore,
              private db: AngularFireDatabase,
              public router: Router ,
              public propertyService: PropertyService) {
    this.unit = new UnitModel();
  }

  getUnit(unitId){
    return this.db.object('/units/' + unitId).valueChanges();
  }

  getAllUnits(): Observable<any> {
    this.units = this.db.list('units').snapshotChanges();
    return this.units;
  }

  deleteUnit(unitId: string): Promise<void> {
    return this.db.list('units').remove(unitId);
  }

  updateUnit(unitId: string, unit: UnitModel): Promise<void> {
    return this.db.list('units').update(unitId, unit);
  }
  addUnit(unit: UnitModel) {
    const unitId = this.db.createPushId();
    unit.unitId = unitId;
    return this.db.database.ref('units').child(unitId).set(unit).then( () => {
        this.router.navigate(['container/units']);
      }
    );
  }
}
