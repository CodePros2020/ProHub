import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-genericmessagedialog',
  templateUrl: './genericmessagedialog.component.html',
  styleUrls: ['./genericmessagedialog.component.scss']
})
export class GenericMessageDialogComponent implements OnInit {

  title: string;
  message: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit(): void {
  }

}
