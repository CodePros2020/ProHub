import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {

  // public formList: Forms[]
  public formList: string[] = [];
  public searchQuery: string;

  constructor() {
  }

  ngOnInit(): void {
    this.formList = ["A","B","C", "D", "E"];
  }

}
