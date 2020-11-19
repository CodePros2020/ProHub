import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UnitModel} from '../manager/Unit.model';
import {PendingChangesDialogComponent} from '../../../../../shared-components/pending-changes-dialog/pending-changes-dialog.component';
import {UnitsService} from '../../../../../shared-services/units.service';



@Component({
  selector: 'app-add-edit-unit',
  templateUrl: './add-edit-unit.component.html',
  styleUrls: ['./add-edit-unit.component.scss']
})
export class AddEditUnitComponent implements OnInit {

  unit: UnitModel;
  newUnit: UnitModel;
  unitForm: FormGroup;
  propId: string;

  constructor(public dialogRef: MatDialogRef<AddEditUnitComponent>, public formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private data: any, public dialog: MatDialog,
              public unitsService: UnitsService) {

    this.unit = new UnitModel();
    this.newUnit = new UnitModel();
    this.propId = this.data.propId;
    if (this.data.update === true) {
      this.unit = this.data.unitData;
    }
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
      unitName: ['', Validators.required],
      tenantId: ['', Validators.required],
      tenantName: ['', Validators.required]
    });
  }

  updateUnitForm() {
    this.unitForm = this.formBuilder.group({
      unitName: [this.unit.unitName, Validators.required],
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
      this.newUnit.tenantName = this.formControls.tenantName.value;
      this.newUnit.tenantId = this.formControls.tenantId.value;
      this.newUnit.unitName = this.formControls.unitName.value;

      if (this.data.update === true) {
        this.newUnit.unitId = this.unit.unitId;
        this.newUnit.propId = this.unit.propId;
        this.dialogRef.close(this.newUnit);

      } else {
        this.newUnit.propId = this.propId;
        this.dialogRef.close(this.newUnit);
      }

    }
  }
}
