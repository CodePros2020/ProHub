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
import {map, startWith} from 'rxjs/operators';
import {GenericDeleteDialogComponent} from '../../../../shared-components/generic-delete-dialog/generic-delete-dialog.component';



@Component({
  selector: 'app-staff-management',
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss']
})
export class StaffManagementComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public staffListForm: FormGroup;
  public staffList: Observable<StaffModel[]>;
  public staff = [];
  public staffModel: StaffModel;
  propertyId: string;
  propertyName: string;
  displayedColumns: string[] = ['name', 'role', 'action'];
  dataSource;
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
  }

  showOverlay() {
    this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  hideOverLay() {
    this.overlayRef.detach();
  }

  ngOnInit(): void {
    this.propertyId = this.propertyService.GetPropertyInSession().propId;
    this.filteredOptions();
    this.getStaff();
  }

  ngAfterViewInit() {

  }

  getStaff() {
    this.showOverlay();
    this.staff = [];
    this.staffService.getAllStaff().pipe(
      map(changes =>
        changes.map(c =>
          ({key: c.payload.key, ...c.payload.val()})
        ))
    ).subscribe(data => {
      data.forEach(res => {
        if (res.propId === this.propertyId) {
          this.staffModel = new StaffModel();
          this.staffModel.imgUrl = res.imgUrl;
          this.staffModel.addressLine2 = res.addressLine2;
          this.staffModel.postalCode = res.postalCode;
          this.staffModel.city = res.city;
          this.staffModel.country = res.country;
          this.staffModel.province = res.province;
          this.staffModel.staffId = res.staffId;
          this.staffModel.email = res.email;
          this.staffModel.address = res.address;
          this.staffModel.name = res.name;
          this.staffModel.phoneNum = res.phoneNum;
          this.staffModel.propId = res.propId;
          this.staffModel.role = res.role;
          this.staff.push(this.staffModel);
        }
      });
      console.log('Staff List: ', this.staff);
      this.dataSource = new MatTableDataSource(this.staff);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.hideOverLay();
    });
  }


  get formControls() {
    return this.staffListForm.controls;
  }

  searchStaffFormGroup() {
    this.staffListForm = this.formBuilder.group({
      staffSearch: ['']
    });
  }

  filteredOptions() {
    this.staffList = this.formControls.staffSearch.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value): StaffModel[] {
    const filterValue = value.toLowerCase();
    return this.dataSource.data.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }


  openAddStaffDialog() {
    const dialogRef = this.dialog.open(AddEditStaffComponent, {
      height: '100%',
      width: '70%',
      autoFocus: false,
      data: {update: false, propId: this.propertyId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getStaff();
      }
    });
  }

  deleteStaff(element: StaffModel) {
    const dialogRef = this.dialog.open(GenericDeleteDialogComponent, {
      width: '500px',
      data: {currentDialog: element.name}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.staffService.deleteStaff(element.staffId).then(() => {
          this.getStaff();
        });
      }
    });
  }

  openEditStaffDialog(staff) {
    const dialogFilter = this.dialog.open(AddEditStaffComponent, {
      height: '100%',
      width: '70%',
      autoFocus: false,
      data: {update: true, staffData: staff, propId: this.propertyId}
    });
    dialogFilter.afterClosed().subscribe(result => {
      if (result) {
        this.getStaff();
      }
    });
  }
}



