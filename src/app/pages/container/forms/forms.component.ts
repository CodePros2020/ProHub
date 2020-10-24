import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";

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

  displayedColumns: string[] = ['filename', 'creation_date', 'size', 'action'];
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

  //


  // controls
  public clickUpload() {
    alert();
    // showUploadDialog();
  }

}


// static code for testing purpose
export interface IForm {
  filename: string;
  creation_date: string;
  size: number;
}

const FORM_LIST_DATA: IForm[] = [
  {
    filename: 'Application Form.pdf',
    creation_date: '2020-01-01',
    size: 1024
  },
  {
    filename: 'Tenant Agreement.pdf',
    creation_date: '2020-02-02',
    size: 1024
  },
  {
    filename: 'IMG_20201024_2305418.jpg',
    creation_date: '2020-03-03',
    size: 1024
  },
  {
    filename: 'L4 Form V2.0.pdf',
    creation_date: '2020-04-04',
    size: 1024
  }


];
