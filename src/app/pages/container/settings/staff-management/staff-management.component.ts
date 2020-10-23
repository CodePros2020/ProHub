import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {PropertyListInterface} from '../../property-list/property-list.component';
import {CreateUpdatePropertyComponent} from '../../property-list/create-update-property/create-update-property.component';
import {AddEditStaffComponent} from './add-edit-staff/add-edit-staff.component';

@Component({
  selector: 'app-staff-management',
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss']
})
export class StaffManagementComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public staffListForm: FormGroup;
  public staffList: Observable<Staff[]>;

  displayedColumns: string[] = ['name', 'role', 'action'];
  dataSource = new MatTableDataSource(STAFF_LIST);

  constructor( public dialog: MatDialog,
               private formBuilder: FormBuilder, public dialogRef: MatDialogRef<StaffManagementComponent>) {
    this.searchStaffFormGroup();
  }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  searchStaffFormGroup() {
    this.staffListForm = this.formBuilder.group({
      staffSearch: ['']
    });
  }

  get formControls() {
    return this.staffListForm.controls;
  }

  openAddEditStaffDialog() {
    const dialogFilter = this.dialog.open(AddEditStaffComponent, {
      height: '80%',
      width: '70%',
      disableClose: true
    });
  }

  /** Clicking on close */
  close() {
    // if (this.addMedicationForm.dirty) {
    //   const unsavedDialog = this.dialog.open(PendingChangesDialogComponent);
    //
    //   unsavedDialog.afterClosed().subscribe(res => {
    //     if (res === true) {
    //       this.dialogRef.close(false);
    //     }
    //   });
    // } else {
    //   this.dialogRef.close(false);
    // }
    this.dialogRef.close();
  }
}

export interface Staff {
  id: number;
  name: string;
  role: string;
}
const STAFF_LIST: Staff[] = [
  {
    id: 1,
    name: 'Ann Smith',
    role: 'Property Manager'
  },
  {
    id: 2,
    name: 'Jane Doe',
    role: 'Superintendent'
  },
  {
    id: 3,
    name: 'Chris Thomas',
    role: 'Manager'
  },

];
