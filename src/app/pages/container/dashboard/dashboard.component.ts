import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../shared-services/auth.service';
import {FirebaseService} from '../../../shared-services/firebase.service';
import {PropertyModel} from '../property-list/manager/property.model';
import {PropertyService} from '../../../shared-services/property.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loggedInUserName: string;
  loggedInUser: any;
  property: PropertyModel;
  constructor(
    public router: Router,
    public authService: AuthService,
    public propertyService: PropertyService
  ) {
  }

  ngOnInit(): void {
    this.property = this.propertyService.GetPropertyInSession();
    this.loggedInUser = this.authService.GetUserInSession();
    this.loggedInUserName = this.loggedInUser !== undefined ? this.loggedInUser.firstName + ' ' + this.loggedInUser.lastName : '';
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
    this.router.navigate(['container/property-list']);
  }

}
