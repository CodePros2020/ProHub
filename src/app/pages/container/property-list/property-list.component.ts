import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {CreateUpdatePropertyComponent} from './create-update-property/create-update-property.component';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit, AfterViewInit{

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public propertyListForm: FormGroup;
  public propertyListResult: Observable<PropertyListInterface[]>;

  displayedColumns: string[] = ['name', 'address', 'action'];
  dataSource = new MatTableDataSource(PROPERTY_LIST_DATA);

  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder) {
    this.createPropertyListFormGroup();
  }

  ngOnInit(): void {
    this.filteredOptions();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
    const dialogFilter = this.dialog.open(CreateUpdatePropertyComponent,{
      height: '690px',
      width: '850px',
      disableClose: true
    });
  }

  filteredOptions() {
    this.propertyListResult = this.formControls.propertySearch.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value): PropertyListInterface[] {
    const filterValue = value.toLowerCase();

    return this.dataSource.data.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
}


// static values for testing only

export interface PropertyListInterface {
  id: number;
  name: string;
  address: string;
}

const PROPERTY_LIST_DATA: PropertyListInterface[] = [
  {
    id: 1,
    name: 'Apartment 1',
    address: 'Toronto, ON'
  },
  {
    id: 2,
    name: 'Apartment 2',
    address: 'Vaughan, ON'
  },
  {
    id: 3,
    name: 'Apartment 3',
    address: 'Etobicoke, ON'
  },
  {
    id: 4,
    name: 'Apartment 4',
    address: 'Pickering, ON'
  },
  {
    id: 5,
    name: 'Apartment 5',
    address: 'Collingwood, ON'
  },
  {
    id: 6,
    name: 'Apartment 6',
    address: 'Markham, ON'
  }
];
