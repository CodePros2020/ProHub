import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-prohub-logo',
  templateUrl: './prohub-logo.component.html',
  styleUrls: ['./prohub-logo.component.scss']
})
export class ProhubLogoComponent implements OnInit {

  @Input() size = 'medium';
  constructor() { }

  ngOnInit(): void {
  }

}
