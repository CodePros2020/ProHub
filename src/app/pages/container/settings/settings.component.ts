import { Component, OnInit } from '@angular/core';
import {StaffManagementComponent} from './staff-management/staff-management.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openStaffManagementDialog() {
    const dialogRef = this.dialog.open(StaffManagementComponent, {
      maxWidth: 'auto',
      maxHeight: 'auto',
      height: '100%',
      width: '100%',
      panelClass: 'no-padding-container',
      data: {}
    });
    // dialogRef.componentInstance.onAdd.subscribe(result => {
    //   console.log('AfterAdd dialog', JSON.stringify(result));
    //
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //
    //   }
    // });
  }


}
