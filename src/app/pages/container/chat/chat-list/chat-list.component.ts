import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../../shared-services/auth.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  loggedInFullName;

  constructor(private authService: AuthService) {
    this.getLoggedInFullName();
  }

  ngOnInit(): void {
  }

  getLoggedInFullName() {
    this.loggedInFullName = this.authService.GetUserInSession().firstName + ' ' +
      this.authService.GetUserInSession().lastName;
  }

}
