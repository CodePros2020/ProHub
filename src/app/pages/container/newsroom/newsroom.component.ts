import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-newsroom',
  templateUrl: './newsroom.component.html',
  styleUrls: ['./newsroom.component.scss']
})
export class NewsroomComponent implements OnInit {

  @ViewChild('FileSelectInputDialog') fileSelectInputDialog: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  openAddFilesDialog() {
    const e: HTMLElement = this.fileSelectInputDialog.nativeElement;
    e.click();
  }

  handle(event) {
    console.log('what is event: ', event.target.files[0]);
  }
}
