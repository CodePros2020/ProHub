import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {UploadFormDialogComponent} from "./upload-form-dialog/upload-form-dialog.component";
import {FormService} from "../../../shared-services/form.service";
import {map} from "rxjs/operators";
import {FormModel} from "./manager/form.model";
import {GenericDeleteDialogComponent} from "../../../shared-components/generic-delete-dialog/generic-delete-dialog.component";

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements AfterViewInit  {
  // property decorators
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  forms = [];
  form: FormModel;

//  displayedColumns: string[] = ['filename', 'upload_date', 'size', 'action'];
  displayedColumns: string[] = ['filename', 'upload_date', 'action'];
  dataSource;

  // constructor
  constructor(public dialog: MatDialog,
              private formService: FormService
              ) {
  }

  // life cycle hooks
  ngOnInit(): void {
    this.retrieveForms();
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  retrieveForms() {
    this.forms = [];
    this.formService.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c=>({
        key: c.payload.key, ...c.payload.val()
      })))
    ).subscribe(data =>{
      data.forEach(res=>{
        this.form = new FormModel();
        this.form.key = res.key;
        this.form.filename = res.formTitle;
        this.form.upload_date = res.dateCreated;
        this.form.contentUrl = res.contentUrl;
        this.form.propId = res.propId;
        // this.form.size = 1024;
        this.forms.push(this.form);
      });
      // this.properties = data;
      console.log('Forms retrieved: ', this.forms);
      this.dataSource = new MatTableDataSource(this.forms);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  public openUploadFormDialog() {
    const dialogFilter = this.dialog.open(UploadFormDialogComponent, {
      height: '400px',
      width: '850px',
      disableClose: true
    })
  }

  deleteForm(element: FormModel) {
    console.log(JSON.stringify(element));
    const dialogRef = this.dialog.open(GenericDeleteDialogComponent, {
      width: '500px',
      data: { currentDialog: element.filename }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.formService.delete(element.key).then(() => {
          this.retrieveForms();
        });
      }
    });
  }

}
