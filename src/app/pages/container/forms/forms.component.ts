import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {CreateUpdatePropertyComponent} from "../property-list/create-update-property/create-update-property.component";

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
  constructor() {

  }

  // life cycle hooks
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

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
    filename: 'A',
    creation_date: '2020-01-01',
    size: 1024
  },
  {
    filename: 'B',
    creation_date: '2020-02-02',
    size: 1024
  },
  {
    filename: 'C',
    creation_date: '2020-03-03',
    size: 1024
  },
  {
    filename: 'D',
    creation_date: '2020-04-04',
    size: 1024
  }


];
