import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireDatabase} from '@angular/fire/database';
import {Router} from '@angular/router';
import {RegistrationModel} from '../pages/registration/manager/registration.model';
import {StaffModel} from "../pages/container/settings/staff-management/manager/Staff.model";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor( private firestore: AngularFirestore,
               private db: AngularFireDatabase,
               public router: Router ) { }


  getStaff(staffId){
    return this.db.object('/staff/' + staffId).valueChanges();
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
