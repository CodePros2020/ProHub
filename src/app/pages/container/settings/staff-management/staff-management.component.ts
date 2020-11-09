import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {AddEditStaffComponent} from './add-edit-staff/add-edit-staff.component';
import {Router} from '@angular/router';
import {PropertyService} from '../../../../shared-services/property.service';
import {StaffModel} from './manager/Staff.model';
import {StaffService} from '../../../../shared-services/staff.service';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoaderComponent} from '../../../../shared-components/loader/loader.component';


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
  propertyId: string;
  property: any;
  propertyName: string;
  displayedColumns: string[] = ['fullName', 'role', 'action'];
  dataSource = new MatTableDataSource(STAFF_LIST);
  overlayRef = this.overlay.create({
    positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    hasBackdrop: true
  });
  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              public router: Router,
              public propertyService: PropertyService,
              public staffService: StaffService,
              private overlay: Overlay) {
    this.searchStaffFormGroup();
    this.propertyId = this.propertyService.getPropId();
  }
  showOverlay() {
    this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  hideOverLay() {
    this.overlayRef.detach();
  }
  ngOnInit(): void {
    this.property = this.propertyService.getClickedProp();
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


  openAddStaffDialog() {
    const dialogRef = this.dialog.open(AddEditStaffComponent, {
      height: '100%',
      width: '50%',
      autoFocus: false,
      data: {update: false, propId: this.property.propId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        console.log('After closing dialog', JSON.stringify(result));
        let staff = new StaffModel();
        staff = result;
        this.staffService.addStaff(staff);
      }
    });
  }

openEditStaffDialog(staff) {
  const dialogFilter = this.dialog.open(AddEditStaffComponent, {
    height: '100%',
    width: '50%',
    autoFocus: false,
    data: {update: true, staffData : staff, propId: this.property.propId}
  });
}

}

export interface Staff {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  province: string;
  country: string;
  propertyId: string;
  staffId: string;
  photo: string;
  role: string;
}
const STAFF_LIST: Staff[] = [
  {
    fullName: 'Ann Smith',
    email: 'ann@gmail.com',
    phone: '(416) 111-1111',
    addressLine1: 'Progress Ave',
    addressLine2: 'Suite 1001',
    postalCode: 'H0H0H0',
    city: 'Toronto',
    province: 'Ontario',
    country: 'Country',
    propertyId: '101',
    staffId: 'PM-101',
    photo: '',
    role: 'Property Manager'
  },
  {
    fullName: 'JOhn Smith',
    email: 'john@gmail.com',
    phone: '(416) 111-1111',
    addressLine1: 'Progress Ave',
    addressLine2: 'Suite 1001',
    postalCode: 'H0H0H0',
    city: 'Toronto',
    province: 'Ontario',
    country: 'Country',
    propertyId: '101',
    staffId: 'PM-101',
    photo: '',
    role: 'Superintendent'
  }

];
