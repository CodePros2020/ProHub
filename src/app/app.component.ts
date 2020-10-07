import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ProHub-Web-Frontend';
  items: string[] = ['java', 'html'];
  // constructor(private users: Users) {
  // }
}
