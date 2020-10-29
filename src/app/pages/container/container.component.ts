import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared-services/auth.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  userType;
  isPropertySelected;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.userType = 'business';
    this.isPropertySelected = true;
  }
  SignOut(){
    this.authService.SignOut();
  }
}
