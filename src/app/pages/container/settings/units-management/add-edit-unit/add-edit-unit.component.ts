import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UnitModel} from '../manager/Unit.model';
import {PendingChangesDialogComponent} from '../../../../../shared-components/pending-changes-dialog/pending-changes-dialog.component';
import {UnitsService} from '../../../../../shared-services/units.service';
import {GenericMessageDialogComponent} from '../../../../../shared-components/genericmessagedialog/genericmessagedialog.component';
import {FirebaseService} from '../../../../../shared-services/firebase.service';
import {RegistrationModel} from '../../../../registration/manager/registration.model';
import {Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {LoaderComponent} from '../../../../../shared-components/loader/loader.component';
import {map} from 'rxjs/operators';
import {UsersTableService} from '../../../../../shared-services/users-table.service';
import {ErrorDialogComponent} from '../../../../../shared-components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-add-edit-unit',
  templateUrl: './add-edit-unit.component.html',
  styleUrls: ['./add-edit-unit.component.scss']
})
export class AddEditUnitComponent implements OnInit {

  isUpdateMode = false;
  tenant;
  unit: UnitModel;
  unitForm: FormGroup;
  unitsArr = [];
  user: RegistrationModel;
  propId: string;

  constructor(public dialogRef: MatDialogRef<AddEditUnitComponent>,
              public formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any,
              public dialog: MatDialog,
              public unitsService: UnitsService,
              public usersTableService: UsersTableService,
              public overlay: Overlay) {

    this.unit = new UnitModel();
    this.propId = this.data.propId;
    this.unitsArr = this.data.unitsList;

    if (this.data.update === true) {
      this.unit = this.data.unitData;
      this.isUpdateMode = true;
    }
  }

  overlayRef = this.overlay.create({
    positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    hasBackdrop: true
  });

  ngOnInit(): void {
    this.getUnitForm();
  }

  showOverlay() {
    this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  hideOverLay() {
    this.overlayRef.detach();
  }

  getUnitForm() {
    this.unitForm = this.formBuilder.group({
      unitNumber: [this.unit.unitName, Validators.required],
      tenantId: [ this.unit.tenantId , Validators.required],
      tenantName: [{value: this.unit.tenantName, disabled: true}]
    });
    if (this.data.update){
      console.log('In edit mode');
      this.formControls.tenantId.disable();
    }


  }

  get formControls() {
    return this.unitForm.controls;
  }

  checkTenantInfo() {
    this.showOverlay();
    const tenantId = this.formControls.tenantId.value;
    console.log('what is tenantId', tenantId);
    this.usersTableService.getTenant().snapshotChanges().pipe(
      map(tenants =>
        tenants.map(c =>
          ({key: c.payload.key, ...c.payload.val()})
        ))
    ).subscribe(data => {

      this.tenant = data.find(r => r.phoneNumber === tenantId);
      console.log('who is tenant? ', this.tenant);

      if (this.tenant !== undefined) {

        const isTenantNumExist = this.unitsArr.some(num => num.tenantId === tenantId);
        console.log('does tenant num exist', isTenantNumExist);
        if (!isTenantNumExist) {
          this.hideOverLay();
          this.formControls.tenantName.setValue(this.tenant.firstName + ' ' + this.tenant.lastName);
        } else {
          this.hideOverLay();
          this.errorMessageDialog('Phone number is already registered to a unit.');
          this.formControls.tenantId.reset();
        }
      } else {
        this.hideOverLay();
        this.errorMessageDialog('Phone number is not a registered tenant.');
        this.formControls.tenantId.reset();
      }
    });
  }

  checkUnitDuplicity() {
    const unitNum = this.formControls.unitNumber.value;
    const isUnitExist = this.unitsArr.some(num => num.unitName === unitNum);
    if (isUnitExist) {
      this.openMessageDialog(
        'E R R O R',
        'Unit number already exist.'
      );
      this.formControls.unitNumber.reset();
    }
  }

  saveUnit() {
    console.log('is this unit form valid', this.unitForm.valid);
    if (this.unitForm.valid) {

      this.unit.unitName = this.formControls.unitNumber.value;
      this.unit.tenantName = this.formControls.tenantName.value;
      this.unit.tenantId = this.formControls.tenantId.value;
      this.unit.propId = this.propId;

      if (this.data.update === true) {
        this.unitsService.updateUnit(this.unit.unitId, this.unit).then(() => {
          console.log('unit updated successfully');
        }, ((err) => {
          console.log('error updating unit', err);
        }));
      } else {
        this.unitsService.addUnit(this.unit).then(() => {
          console.log('unit added successfully');
        }, ((err) => {
          console.log('error updating unit', err);
        }));
      }

      this.dialogRef.close({unitInfo: this.unit, tenantInfo: this.tenant});
    }
  }

  /** Clicking on close */
  close() {
    if (this.unitForm.dirty) {
      const unsavedDialog = this.dialog.open(PendingChangesDialogComponent);
      unsavedDialog.afterClosed().subscribe(res => {
        if (res === true) {
          this.dialogRef.close(false);
        }
      });
    } else {
      this.dialogRef.close(false);
    }
  }

  /**  Error Message pop up */
  openMessageDialog(titleMsg, msg) {
    this.dialog.open(GenericMessageDialogComponent, {
      data: { title: titleMsg, message: msg },
    });
  }

  errorMessageDialog(message) {
    this.dialog.open(ErrorDialogComponent, {
      height: '40%',
      width: '30%',
      autoFocus: false,
      data: { msg: message },
    });
  }
}
