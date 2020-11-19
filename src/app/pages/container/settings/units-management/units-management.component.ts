import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AddEditUnitComponent} from './add-edit-unit/add-edit-unit.component';
import {PropertyService} from '../../../../shared-services/property.service';
import {PropertyModel} from '../../property-list/manager/property.model';
import {GenericDeleteDialogComponent} from '../../../../shared-components/generic-delete-dialog/generic-delete-dialog.component';
import {UnitModel} from './manager/Unit.model';
import {UnitsService} from '../../../../shared-services/units.service';
import {map, startWith} from 'rxjs/operators';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoaderComponent} from '../../../../shared-components/loader/loader.component';
import {Overlay} from '@angular/cdk/overlay';
import {Observable} from 'rxjs';
import {GenericMessageDialogComponent} from '../../../../shared-components/genericmessagedialog/genericmessagedialog.component';


@Component({
  selector: 'app-units-management',
  templateUrl: './units-management.component.html',
  styleUrls: ['./units-management.component.scss']
})
export class UnitsManagementComponent implements OnInit, AfterViewInit {
  private unitExist = false;
  property: PropertyModel;
  unit: UnitModel;
  units = [];
  displayedColumns: string[] = ['unitName', 'tenantId', 'tenantName', 'action'];
  dataSource;
  public unitsList: Observable<UnitModel[]>;
  public unitListForm: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              public router: Router,
              public propertyService: PropertyService,
              public unitsService: UnitsService,
              public overlay: Overlay,
              ) {
    this.searchUnitFormGroup();
    this.property = this.propertyService.GetPropertyInSession();
    this.units = [];
  }
  get formControls() {
    return this.unitListForm.controls;
  }

  overlayRef = this.overlay.create({
    positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    hasBackdrop: true
  });

  ngOnInit(): void {
    this.unit = new UnitModel();
    this.getUnits();
    this.filteredOptions();

  }
  ngAfterViewInit() {
  }
  showOverlay() {
    this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  hideOverLay() {
    this.overlayRef.detach();
  }
  searchUnitFormGroup() {
    this.unitListForm = this.formBuilder.group({
      unitSearch: ['']
    });
  }

  deleteUnit(element: UnitModel) {
    const dialogRef = this.dialog.open(GenericDeleteDialogComponent, {
      width: '500px',
      data: { currentDialog: element.unitName}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.unitsService.deleteUnit(element.unitId);
        this.getUnits();
      }
    });
  }
  getUnits() {
    this.units = [];
    this.showOverlay();
    this.unitsService.getAllUnits().pipe(
      map(changes =>
        changes.map(c =>
          ({key: c.payload.key, ...c.payload.val()})
        ))
    ).subscribe(data => {
      data.forEach(res => {
        if (res.propId === this.property.propId) {
          this.unit = new UnitModel();
          this.unit.unitId = res.unitId;
          this.unit.unitName = res.unitName;
          this.unit.tenantId = res.tenantId;
          this.unit.propId = res.propId;
          this.unit.tenantName = res.tenantName;
          this.units.push(this.unit);
        }
      });
      console.log('Units List: ', this.units);
      this.dataSource = new MatTableDataSource(this.units);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this. hideOverLay();
    });
  }

  filteredOptions() {
    this.unitsList = this.formControls.unitSearch.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value): UnitModel[] {
    const filterValue = value.toLowerCase();
    return this.dataSource.data.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  openAddUnitDialog() {
    const dialogFilter = this.dialog.open(AddEditUnitComponent, {
      height: '80%',
      width: '50%',
      autoFocus: false,
      data: {update: false, propId: this.property.propId}
    });
    dialogFilter.afterClosed().subscribe(result => {
      if (result) {
        for (const i in this.units) {
          if (this.units[i].unitName === result.unitName) {
            console.log('The unit in list,' , this.units[i].unitName);
            this.unitExist = true;
            break;
          } else {
            this.unitExist = false;
          }
        }
        if (!this.unitExist) {
          this.units = [];
          this.units.push(result);
          this.unitsService.addUnit(result);
          this.openMessageDialog('S U C C E S S', 'Unit added successfully!');
          this.getUnits();
        } else {
          this.openMessageDialog('E R R O R', 'Unit with this name already exist.');
        }
      }
    });
}

  /**  Error Message pop up */
  openMessageDialog(titleMsg, msg) {
    this.dialog.open(GenericMessageDialogComponent,
      {
        data: {title: titleMsg, message: msg}
      });
  }

  openEditUnitDialog(unit) {
    const dialogFilter = this.dialog.open(AddEditUnitComponent, {
      height: '80%',
      width: '50%',
      autoFocus: false,
      data: {update: true, unitData : unit}
    });
    dialogFilter.afterClosed().subscribe(result => {
      if (result) {
        this.units.push(result);
        this.unitsService.updateUnit(result.unitId, result).then( res => {
          console.log('Updated Unit ', res);
          this.getUnits();
        });
      }
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
