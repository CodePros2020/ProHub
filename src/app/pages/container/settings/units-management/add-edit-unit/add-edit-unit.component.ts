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
      tenantName: ['']
    });
    this.formControls.tenantName.disable();
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

    if (this.unitForm.valid) {
      this.showOverlay();
      this.getAllTenants(this.formControls.tenantId.value);
      this.hideOverLay();
      // if (this.isTenant) {
      //   this.newUnit.tenantId = this.formControls.tenantId.value;
      //   this.newUnit.unitName = this.formControls.unitNumber.value;

      if (this.data.update === true) {
          this.newUnit.tenantId = this.formControls.tenantId.value;
          this.newUnit.unitName = this.formControls.unitNumber.value;
          this.newUnit.unitId = this.unit.unitId;
          this.newUnit.propId = this.unit.propId;
          // this.checkUnitDuplicity();
        } else {
          if (this.isTenant) {
            this.newUnit.tenantId = this.formControls.tenantId.value;
            this.newUnit.unitName = this.formControls.unitNumber.value;
            this.newUnit.propId = this.propId;
            this.checkUnitDuplicity();
          }
          // else{
          //   this.openMessageDialog(
          //     'E R R O R',
          //     'Tenant phone number does not exist.'
          //   );

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
    this.firebaseService.getUsers().pipe(
      map((changes) =>
        changes.map((c) => ({ key: c.payload.key, ...c.payload.val() as  RegistrationModel })))
    ).subscribe(data => {
      this.tenants = [];
      data.forEach((res) => {
        console.log('User res', res);
        this.user = new RegistrationModel();
        if (res.key === res.uid) {
          this.user = res;
          if (this.user.userType === 'personal' ) {
            console.log('User in array', this.user);
            if (this.user.phoneNumber === id) {
              this.tenants.push(this.user);
              const name = this.user.firstName + ' ' + this.user.lastName;
              this.formControls.tenantName.setValue(name);
              this.newUnit.tenantName = this.formControls.tenantName.value;
              this.isTenant = true;
              console.log('isTenant ', this.isTenant);
            }
          }
        }
      });
    });
  }
  // getUsers(){
  //
  //   this.firebaseService.getUsers().pipe(
  //     map((changes) =>
  //       changes.map((c) => ({ key: c.payload.key, ...c.payload.val() as  RegistrationModel })))
  //   ).subscribe(data => {
  //     this.tenants = [];
  //     data.forEach((res) => {
  //       console.log('User res', res);
  //       this.user = new RegistrationModel();
  //       if (res.key === res.uid) {
  //         this.user = res;
  //         if (this.user.userType === 'personal' ) {
  //           this.tenants.push(this.user);
  //         }
  //       }
  //     });
  //   });
  //   // console.log('All users, ', this.tenantsArr);
  //    return this.tenants;
  // }



}
