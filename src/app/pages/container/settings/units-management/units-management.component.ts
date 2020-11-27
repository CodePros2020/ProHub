import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddEditUnitComponent } from './add-edit-unit/add-edit-unit.component';
import { PropertyService } from '../../../../shared-services/property.service';
import { PropertyModel } from '../../property-list/manager/property.model';
import { GenericDeleteDialogComponent } from '../../../../shared-components/generic-delete-dialog/generic-delete-dialog.component';
import { UnitModel } from './manager/Unit.model';
import { UnitsService } from '../../../../shared-services/units.service';
import { map, startWith } from 'rxjs/operators';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoaderComponent } from '../../../../shared-components/loader/loader.component';
import { Overlay } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { GenericMessageDialogComponent } from '../../../../shared-components/genericmessagedialog/genericmessagedialog.component';
import {ChatMessagesService} from '../../../../shared-services/chat-messages.service';
import {AuthService} from '../../../../shared-services/auth.service';
import {ChatMessagesModel} from '../../chat/manager/chat-messages.model';


@Component({
  selector: 'app-units-management',
  templateUrl: './units-management.component.html',
  styleUrls: ['./units-management.component.scss'],
})
export class UnitsManagementComponent implements OnInit {
  landlordPhoneNumber;
  landlordName;
  landlordPhotoUrl;
  private unitExist = false;
  property: PropertyModel;
  unit: UnitModel;
  chatMessage: ChatMessagesModel;
  units = [];
  unitsProp = [];
  displayedColumns: string[] = ['unitName', 'tenantId', 'tenantName', 'action'];
  dataSource;
  public unitsList: Observable<UnitModel[]>;
  public unitListForm: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public router: Router,
    public propertyService: PropertyService,
    public unitsService: UnitsService,
    public overlay: Overlay,
    public authService: AuthService,
    public chatMessagesService: ChatMessagesService
  ) {
    this.searchUnitFormGroup();
    this.getLandlordDetails();
    this.property = this.propertyService.GetPropertyInSession();
    this.units = [];
  }

  overlayRef = this.overlay.create({
    positionStrategy: this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically(),
    hasBackdrop: true,
  });

  ngOnInit(): void {
    this.unit = new UnitModel();
    this.getUnits();
    this.filteredOptions();
  }

  showOverlay() {
    this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  hideOverLay() {
    this.overlayRef.detach();
  }

  searchUnitFormGroup() {
    this.unitListForm = this.formBuilder.group({
      unitSearch: [''],
    });
  }

  get formControls() {
    return this.unitListForm.controls;
  }


  deleteUnit(element: UnitModel) {
    const dialogRef = this.dialog.open(GenericDeleteDialogComponent, {
      width: '500px',
      data: { currentDialog: element.unitName },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.unitsService.deleteUnit(element.unitId);
      }
    });
  }

  getUnits() {
    this.showOverlay();
    this.unitsService
      .getAllUnits()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data) => {
        this.units = [];
        data.forEach((res) => {
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
        this.hideOverLay();
       });
  }

  filteredOptions() {
    this.unitsList = this.formControls.unitSearch.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value): UnitModel[] {
    const filterValue = value.toLowerCase();
    return this.dataSource.data.filter(
      (option) => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  openAddUnitDialog() {
    const dialogFilter = this.dialog.open(AddEditUnitComponent, {
      height: '80%',
      width: '50%',
      autoFocus: false,
      data: { update: false, propId: this.property.propId, unitsList: this.units },
    });

    dialogFilter.afterClosed().subscribe(res => {
      if (res !== false) {
        console.log('this is res unit', res.unitInfo);
        console.log('this is res tenant', res.tenantInfo);
        this.createChatMessageInstances(res.unitInfo.tenantId, res.unitInfo.tenantName, res.tenantInfo.photoURL);
      }
    });
  }

  openEditUnitDialog(unit) {
    const dialogFilter = this.dialog.open(AddEditUnitComponent, {
      height: '80%',
      width: '50%',
      autoFocus: false,
      data: { update: true, propId: this.property.propId, unitData: unit, unitsList: this.units },
    });
  }

  searchUnit(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createChatMessageInstances(tenantNumber, tenantName, tenantPhotoUrl) {
    console.log('this is chat message instance create');
    this.chatMessage = new ChatMessagesModel();
    this.chatMessage.chatMessageId = this.landlordPhoneNumber + '_' + tenantNumber;
    this.chatMessage.receiverNumber = this.landlordPhoneNumber;
    this.chatMessage.senderName = tenantName;
    this.chatMessage.senderNumber = tenantNumber;
    if (tenantPhotoUrl !== undefined) {
      this.chatMessage.senderPhotoUrl = tenantPhotoUrl;
    } else {
      this.chatMessage.senderPhotoUrl = '';
    }
    this.chatMessagesService.create(this.chatMessage);

    this.chatMessage = new ChatMessagesModel();
    this.chatMessage.chatMessageId = this.landlordPhoneNumber + '_' + tenantNumber;
    this.chatMessage.receiverNumber = tenantNumber;
    this.chatMessage.senderName = this.landlordName;
    this.chatMessage.senderNumber = this.landlordPhoneNumber;
    if (this.landlordPhotoUrl !== undefined) {
      this.chatMessage.senderPhotoUrl = this.landlordPhotoUrl;
    }
    this.chatMessagesService.create(this.chatMessage);
  }

  getLandlordDetails() {
    this.landlordPhoneNumber = this.authService.GetUserInSession().phoneNumber;
    this.landlordName = this.authService.GetUserInSession().firstName + ' ' +
      this.authService.GetUserInSession().lastName;

    if (this.authService.GetUserInSession().photoURL !== undefined) {
      this.landlordPhotoUrl = this.authService.GetUserInSession().photoURL;
    } else {
      this.landlordPhotoUrl = '';
    }
  }
}
