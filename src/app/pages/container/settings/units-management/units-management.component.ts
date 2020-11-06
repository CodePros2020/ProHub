import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AddEditUnitComponent} from './add-edit-unit/add-edit-unit.component';

@Component({
  selector: 'app-units-management',
  templateUrl: './units-management.component.html',
  styleUrls: ['./units-management.component.scss']
})
export class UnitsManagementComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['unitId', 'unitName', 'tenantId', 'tenantName', 'action'];
  dataSource = new MatTableDataSource(UNITS_LIST);
  public unitListForm: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              public router: Router) {
    this.searchUnitFormGroup();
  }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  get formControls() {
    return this.unitListForm.controls;
  }


  openAddUnitDialog() {
    const dialogFilter = this.dialog.open(AddEditUnitComponent, {
      height: '80%',
      width: '50%',
      autoFocus: false,
      data: {update: false}
    });
  }

  openEditUnitDialog(unit) {
    const dialogFilter = this.dialog.open(AddEditUnitComponent, {
      height: '80%',
      width: '50%',
      autoFocus: false,
      data: {update: true, unitData : unit}
    });
  }

  searchUnitFormGroup() {
    this.unitListForm = this.formBuilder.group({
      unitSearch: ['']
    });
  }
}


export interface UNIT {
unitId: string;
propId: string;
tenantId: string;
  tenantName: string;
 unitName: string;
}
const UNITS_LIST: UNIT[] = [
  {
    unitId: '1001',
    propId: '101',
    tenantId: '2002',
    tenantName: 'Anna Smith',
    unitName: 'Suite',
  },
  {
    unitId: '1100',
    propId: '101',
    tenantId: '2020',
    tenantName: 'John Doe',
    unitName: 'Suite',
  }

];
