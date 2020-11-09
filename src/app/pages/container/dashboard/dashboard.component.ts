import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../shared-services/auth.service';
import {FirebaseService} from '../../../shared-services/firebase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loggedInUserName: string;
  loggedInUser: any;
  constructor(
    public router: Router,
    public authService: AuthService,
    public firebaseService: FirebaseService
  ) {
  }

  ngOnInit(): void {
    this.getUser();
  }
  getUser() {
    this.firebaseService.getUser( this.authService.userData.uid).subscribe( res => {
      console.log('Get user is', res);
      this.loggedInUser = res;
      this.loggedInUserName = (this.loggedInUser.firstName !== undefined ? this.loggedInUser.firstName : '') + ' ' +
        (this.loggedInUser.lastName !== undefined ? this.loggedInUser.lastName : '');

    });
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
    this.router.navigate(['container/property-list']);
  }

}
