import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../../db-services/users';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  items: Observable<any[]>;
  constructor(private router: Router, private users: Users) { }

  ngOnInit(): void {
  }

  openRegistration() {
    this.router.navigate(['/register']);
    this.users.delete();
  }
}
