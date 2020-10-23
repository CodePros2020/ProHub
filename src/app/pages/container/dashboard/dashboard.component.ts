import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public router: Router
  ) {
  }

  ngOnInit(): void {
  }

  goChats() {
    this.router.navigate(['container/chat']);
  }

  goStaff() {
    this.router.navigate(['container/propertyList']);
  }

  goForms() {
    this.router.navigate(['container/forms']);
  }

  goNews() {
    this.router.navigate(['container/newsroom']);
  }

  goUnits() {
    this.router.navigate(['container/property-list']);
  }

  goSettings() {
    this.router.navigate(['container//settings']);
  }

}
