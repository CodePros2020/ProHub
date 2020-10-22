// reference:
// https://material.angular.io/components/table/overview

import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

export interface IForm {
  filename: string;
  creation_date: string;
  size: number;
}

const ELEMENT_DATA: IForm[] = [
  {
    filename: 'A',
    creation_date: '2020-01-01',
    size: 1024
  },
  {
    filename: 'B',
    creation_date: '2020-01-01',
    size: 1024
  }
];

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements AfterViewInit  {
  displayedColumns: string[] = ['filename', 'creation_date', 'size'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  public formList: Object[] = [];
  public searchQuery: string;

  constructor() {

  }

  public clickUpload() {
    alert();
    // showUploadDialog();
  }

}
