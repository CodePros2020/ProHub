import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {CreateUpdatePropertyComponent} from "../property-list/create-update-property/create-update-property.component";
import {UploadFormDialogComponent} from "./upload-form-dialog/upload-form-dialog.component";

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements AfterViewInit  {
  // property decorators
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public searchForm: FormGroup;

  displayedColumns: string[] = ['filename', 'upload_date', 'size', 'action'];
  dataSource = new MatTableDataSource(FORM_LIST_DATA);

  // constructor
  constructor(public dialog: MatDialog
              // private formBuilder: FormBuider,
              // private formService: FormService
              ) {
  }

  // life cycle hooks
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  retrieveForms() {
    // form service here
  }

  public openUploadFormDialog() {
    const dialogFilter = this.dialog.open(UploadFormDialogComponent, {
      height: '690px',
      width: '850px',
      disableClose: true
    })
  }

  openCreateNewPropertyDialog() {
    const dialogFilter = this.dialog.open(CreateUpdatePropertyComponent, {
      height: '690px',
      width: '850px',
      disableClose: true
    });
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
