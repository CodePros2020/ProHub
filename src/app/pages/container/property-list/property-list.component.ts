import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {CreateUpdatePropertyComponent} from './create-update-property/create-update-property.component';
import {PropertyService} from '../../../shared-services/property.service';
import {FirebasePropertiesModel} from './manager/firebase-properties.model';
import {PropertyModel} from './manager/property.model';
import {GenericDeleteDialogComponent} from '../../../shared-components/generic-delete-dialog/generic-delete-dialog.component';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit, AfterViewInit{

  properties = [];
  property: PropertyModel;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public propertyListForm: FormGroup;
  public propertyListResult: Observable<FirebasePropertiesModel[]>;

  displayedColumns: string[] = ['name', 'address', 'action'];
  dataSource;

  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private propertyService: PropertyService) {
    this.createPropertyListFormGroup();
  }

  ngOnInit(): void {
    this.filteredOptions();
    this.retrieveProperties();
  }

  ngAfterViewInit() {

  }

  retrieveProperties() {
    this.properties = [];
    this.propertyService.getAll().snapshotChanges().pipe(
      map(changes =>
      changes.map(c =>
        ({key: c.payload.key, ...c.payload.val()})
      ))
    ).subscribe(data => {
      data.forEach(res => {
        this.property = new PropertyModel();
        this.property.key = res.key;
        this.property.name = res.name;
        this.property.streetLine1 = res.streetLine1;
        this.property.streetLine2 = res.streetLine2;
        this.property.city = res.city;
        this.property.province = res.province;
        this.property.postalCode = res.postalCode;
        this.property.propId = res.key;
        this.property.phone = res.phone;
        this.property.long = res.long;
        this.property.lat = res.lat;
        this.properties.push(this.property);
      });
      // this.properties = data;
      console.log('what are properties: ', this.properties);
      this.dataSource = new MatTableDataSource(this.properties);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  createPropertyListFormGroup() {
    this.propertyListForm = this.formBuilder.group({
      propertySearch: ['']
    });
  }

  get formControls() {
    return this.propertyListForm.controls;
  }

  openCreateNewPropertyDialog() {
    const dialogFilter = this.dialog.open(CreateUpdatePropertyComponent, {
      height: '690px',
      width: '850px',
      disableClose: true,
      data: { update: false }
    });

    dialogFilter.afterClosed().subscribe(res => {
      if (res === 'added') {
        this.retrieveProperties();
      }
    });
  }

  filteredOptions() {
    this.propertyListResult = this.formControls.propertySearch.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value): FirebasePropertiesModel[] {
    const filterValue = value.toLowerCase();

    return this.dataSource.data.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  deleteProperty(element: PropertyModel) {
    console.log(JSON.stringify(element));
    const dialogRef = this.dialog.open(GenericDeleteDialogComponent, {
      width: '500px',
      data: { currentDialog: element.name }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.propertyService.delete(element.key).then(() => {
          this.retrieveProperties();
        });
      }
    });
  }

  updateProperty(element: PropertyModel) {
    const dialogRef = this.dialog.open(CreateUpdatePropertyComponent, {
      height: '690px',
      width: '850px',
      disableClose: true,
      data: { update: true, property: element }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res === 'updated') {
        console.log('Property updated successfully');
        this.retrieveProperties();
      }
    });
  }
}

