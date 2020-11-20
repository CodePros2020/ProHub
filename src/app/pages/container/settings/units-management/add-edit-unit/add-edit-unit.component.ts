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



@Component({
  selector: 'app-add-edit-unit',
  templateUrl: './add-edit-unit.component.html',
  styleUrls: ['./add-edit-unit.component.scss']
})
export class AddEditUnitComponent implements OnInit {

  unit: UnitModel;
  newUnit: UnitModel;
  unitForm: FormGroup;
  unitsArr = [];
  tenants = [];
  user: RegistrationModel;
  propId: string;
  private unitExist = false;
  private isTenant = false;

  constructor(public dialogRef: MatDialogRef<AddEditUnitComponent>, public formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any, public dialog: MatDialog,
              public unitsService: UnitsService,
              public firebaseService: FirebaseService,
              public overlay: Overlay) {

    this.unit = new UnitModel();
    this.newUnit = new UnitModel();
    this.propId = this.data.propId;
    this.unitsArr = this.data.unitsList;
    if (this.data.update === true) {
      this.unit = this.data.unitData;
    }
  }
  overlayRef = this.overlay.create({
    positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    hasBackdrop: true
  });
  showOverlay() {
    this.overlayRef.attach(new ComponentPortal(LoaderComponent));
  }

  hideOverLay() {
    this.overlayRef.detach();
  }
  ngOnInit(): void {
    if (this.data.update === true) {
      this.updateUnitForm();
    } else {
      this.getUnitForm();
    }


  }

  get formControls() {
    return this.unitForm.controls;
  }

  returnZero() {
    return 0;
  }

  getUnitForm() {
    this.unitForm = this.formBuilder.group({
      unitNumber: ['', Validators.required],
      tenantId: ['', Validators.required],
      tenantName: ['', Validators.required]
    });
  }

  updateUnitForm() {
    this.unitForm = this.formBuilder.group({
      unitNumber: [this.unit.unitName, Validators.required],
      tenantId: [this.unit.tenantId, Validators.required],
      tenantName: [this.unit.tenantName, Validators.required]
    });
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

  saveUnit() {
    this.showOverlay();
    if (this.unitForm.valid) {
      this.newUnit.tenantName = this.formControls.tenantName.value;
      this.getAllTenants(this.formControls.tenantId.value);
      if (this.isTenant) {
        this.newUnit.tenantId = this.formControls.tenantId.value;
        this.newUnit.unitName = this.formControls.unitNumber.value;

        if (this.data.update === true) {
          this.newUnit.unitId = this.unit.unitId;
          this.newUnit.propId = this.unit.propId;
          this.checkUnitDuplicity();
        } else {
          this.newUnit.propId = this.propId;
          this.checkUnitDuplicity();
        }
      } else {
        this.openMessageDialog(
          'E R R O R',
          'Tenant phone number does not exist.'
        );
      }
    }
  }


  checkUnitDuplicity(){
    for (const i in this.unitsArr) {
      if (this.unitsArr[i].unitName === this.newUnit.unitName) {
        console.log('The unit in list,', this.unitsArr[i].unitName);
        this.unitExist = true;
        break;
      } else {
        this.unitExist = false;
      }
    }
    if (!this.unitExist) {
      if (this.data.update === true) {
        this.unitsService.updateUnit(this.newUnit.unitId, this.newUnit);
        this.openMessageDialog('S U C C E S S', 'Unit edited successfully!');
      } else {
        this.unitsArr.push(this.newUnit);
        this.unitsService.addUnit(this.newUnit);
        this.openMessageDialog('S U C C E S S', 'Unit added successfully!');
      }
      this.dialogRef.close(true);
    } else {
      this.openMessageDialog(
        'E R R O R',
        'Unit with this name already exist.'
      );
    }

  }
  /**  Error Message pop up */
  openMessageDialog(titleMsg, msg) {
    this.dialog.open(GenericMessageDialogComponent, {
      data: { title: titleMsg, message: msg },
    });
  }
  getAllTenants(id) {
    this.tenants = this.firebaseService.getUsers();
    this.hideOverLay();
    console.log('Tenants are, ', this.tenants);
    for (const t in this.tenants) {
      if (this.tenants[t].userType.toUpperCase() === 'PERSONAL') {
        if (this.tenants[t].phoneNumber === id) {
          console.log('Tenants numbers ', this.tenants[t].phoneNumber);
          this.isTenant = true;
          break;
        } else {
          this.isTenant = false;
        }
      }
    }
  }



}
