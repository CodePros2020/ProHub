import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UnitModel} from '../manager/Unit.model';
import validate = WebAssembly.validate;
import {ProvinceEnum} from "../../../../../shared-models/enum/province.enum";

@Component({
  selector: 'app-add-edit-unit',
  templateUrl: './add-edit-unit.component.html',
  styleUrls: ['./add-edit-unit.component.scss']
})
export class AddEditUnitComponent implements OnInit {

  unit: UnitModel;
  unitForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddEditUnitComponent>, public formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA)private data: any, public dialog: MatDialog) {

    this.unit = new UnitModel();
    if (this.data.update === true){
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
     unitId: ['', Validators.required],
      unitName: ['', Validators.required],
      tenantId: ['', Validators.required]
    });
  }
  updateUnitForm() {
    this.unitForm = this.formBuilder.group({
      unitId: [this.unit.unitId, Validators.required],
      unitName: [this.unit.unitName, Validators.required],
      tenantId: [this.unit.tenantId, Validators.required]
    });
  }
  /** Clicking on close */
  close() {
    // if (this.addMedicationForm.dirty) {
    //   const unsavedDialog = this.dialog.open(PendingChangesDialogComponent);
    //
    //   unsavedDialog.afterClosed().subscribe(res => {
    //     if (res === true) {
    //       this.dialogRef.close(false);
    //     }
    //   });
    // } else {
    //   this.dialogRef.close(false);
    // }
    this.dialogRef.close();
  }
}
