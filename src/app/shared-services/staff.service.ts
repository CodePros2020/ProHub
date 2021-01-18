import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Router} from '@angular/router';
import {StaffModel} from '../pages/container/settings/staff-management/manager/Staff.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  staff: Observable<any[]>;
  constructor( private firestore: AngularFirestore,
               private db: AngularFireDatabase,
               public router: Router ) { }


  getStaff(staffId){
    return this.db.object('/staff/' + staffId).valueChanges();
  }
  getAllStaff(): Observable<any> {
    this.staff = this.db.list('staff').snapshotChanges();
    return this.staff;
  }
  deleteStaff(staffId: string): Promise<void> {
    return this.db.list('staff').remove(staffId);
  }

  updateStaff(staffId: string, staff: StaffModel): Promise<void> {
    return this.db.list('staff').update(staffId, staff);
  }
  addStaff(staff: StaffModel) {
    const staffId = this.db.createPushId();
    staff.staffId = staffId;
    return this.db.database.ref('staff').child(staffId).set(staff).then( () => {
          this.router.navigate(['container/staff']);
      }
    );
  }


}
