import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared-services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  isInPropertyListComponent = false;

  constructor(public authService: AuthService,
              private router: Router) {
    console.log('what is router url? ', this.router.url);
    if (this.router.url === '/container/property-list') {
      this.isInPropertyListComponent = true;
    }
  }

  ngOnInit(): void {
  }
  SignOut(){
    this.authService.SignOut();
  }
}
