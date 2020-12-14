import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../shared-services/auth.service';
import {FirebaseService} from '../../../shared-services/firebase.service';
import {PropertyModel} from '../property-list/manager/property.model';
import {PropertyService} from '../../../shared-services/property.service';
import {UnitsService} from '../../../shared-services/units.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loggedInUserName: string;
  loggedInUser: any;
  propertyName = '';
  settingImg = './assets/dashboard/settings.jpg';
  unitsImg = './assets/dashboard/units.jpg';
  chatImg = './assets/dashboard/chats.jpg';
  newsImg = './assets/dashboard/news.jpg';
  staffImg = './assets/dashboard/staff.jpg';
  formsImg = './assets/dashboard/forms.jpg';
  property: PropertyModel;
  tenantProperty: any;
  constructor(
    public router: Router,
    public authService: AuthService,
    public propertyService: PropertyService,
    public unitService: UnitsService
  ) {
  }

  ngOnInit(): void {

    console.log('property in session in dashboard', this.property);
    this.loggedInUser = this.authService.GetUserInSession();
    this.loggedInUserName = this.loggedInUser !== undefined ? this.loggedInUser.firstName + ' ' + this.loggedInUser.lastName : '';
    this.checkPropertyForPersonalUser();
    this.getPropertyName();
  }
  goChats() {
    this.router.navigate(['container/chat']);
  }

  goStaff() {
    this.router.navigate(['container/staff']);
  }

  goForms() {
    this.router.navigate(['container/forms']);
  }

  goNews() {
    this.router.navigate(['container/newsroom']);
  }

  goUnits() {
    this.router.navigate(['container/units']);
  }

  goSettings() {
    this.router.navigate(['container/settings']);
  }

  goPropertyList() {
    this.propertyService.RemovePropertyInSession();
    this.router.navigate(['container/property-list']);
  }

  getPropertyName() {
    this.property = this.propertyService.GetPropertyInSession();
    if (this.property === null ||  this.property === undefined){
      this.propertyName = 'No Property';
    }
    if (this.property !== undefined && this.property !== null) {
      this.propertyName = this.property.name;
    } else {
      if (this.loggedInUser.userType.toUpperCase() === 'BUSINESS') {
        this.router.navigate(['container/property-list']);
      } else {
        this.unitService.getPropertyIdByUnit(this.loggedInUser.phoneNumber);
        this.propertyName = this.property.name === undefined ?   'No Property' : this.property.name;
      }
    }

  }

  checkPropertyForPersonalUser() {
    console.log('check property user', this.loggedInUser);
    if (this.loggedInUser.userType.toUpperCase() === 'PERSONAL') {
      this.unitService.getPropertyIdByUnit(this.loggedInUser.phoneNumber).snapshotChanges().pipe(
        map(unit =>
          unit.map(c =>
            ({key: c.payload.key, ...c.payload.val()})
          ))
      ).subscribe(data => {
        if (data.length !== 0) {
          const prop = data.find(r => r.tenantId === this.loggedInUser.phoneNumber);
          const tenantProp = this.propertyService.getPropertyById(prop.propId).subscribe(res => {
            this.tenantProperty = res;
            this.propertyService.setProperty(res);
            this.propertyName = this.tenantProperty === undefined ?  'No Property' : this.tenantProperty.name;
          });
        }
      });
    }
  }

}
