import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {

  // public formList: Forms[] = []
  public formList: Object[] = [];
  public searchQuery: string;

  constructor() {
  }

  ngOnInit(): void {
    this.formList = [
            {
                filename: 'A',
                creation_date: '2020-01-01',
                size: 1024
            },
            {
                filename: 'A',
                creation_date: '2020-01-01',
                size: 1024
                }
    ];
  }

//
  public clickUpload() {
      alert();
      // showUploadDialog();
    }

  showUploadDialog(){
  }

}
