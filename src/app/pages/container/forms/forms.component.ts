import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {UploadFormDialogComponent} from "./upload-form-dialog/upload-form-dialog.component";
import {FormService} from "../../../shared-services/form.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements AfterViewInit  {
  // property decorators
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //
  forms: any[];
  displayedColumns: string[] = ['filename', 'upload_date', 'size', 'action'];
  dataSource = new MatTableDataSource(FORM_LIST_DATA);

  // constructor
  constructor(public dialog: MatDialog,
              private formService: FormService
              ) {
  }

  // life cycle hooks
  ngOnInit(): void {
    // UNDER DEVELOPMENT
//    this.retrieveForms();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  retrieveForms() {
    this.formService.getAll().snapshotChanges().pipe(
      map(changes => changes.map(c=>({
        key: c.payload.key, ...c.payload.val()
      })))
    ).subscribe(data =>{
      this.forms = data;
      console.log(this.forms);
      // this.dataSource = new MatTableDataSource<IForm>(this.forms)
      this.dataSource = new MatTableDataSource(this.forms)
    })
  }

  public openUploadFormDialog() {
    const dialogFilter = this.dialog.open(UploadFormDialogComponent, {
      height: '400px',
      width: '850px',
      disableClose: true
    })
  }
}

// static code for testing purpose
export interface IForm {
  filename: string;
  upload_date: string;
  size: number;
}

const FORM_LIST_DATA: IForm[] = [
  {
    filename: 'Application Form.pdf',
    upload_date: '2020-01-01',
    size: 1024
  },
  {
    filename: 'Tenant Agreement.pdf',
    upload_date: '2020-02-02',
    size: 1024
  },
  {
    filename: 'IMG_20201024_2305418.jpg',
    upload_date: '2020-03-03',
    size: 1024
  },
  {
    filename: 'L4 Form V2.0.pdf',
    upload_date: '2020-04-04',
    size: 1024
  }

];
