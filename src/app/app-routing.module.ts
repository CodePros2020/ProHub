import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ContainerComponent } from './pages/container/container.component';
import { PropertyListComponent } from './pages/container/property-list/property-list.component';
import {ChatComponent} from './pages/container/chat/chat.component';
import {DashboardComponent} from './pages/container/dashboard/dashboard.component';
import {FormsComponent} from './pages/container/forms/forms.component';
import {NewsroomComponent} from './pages/container/newsroom/newsroom.component';
import {SettingsComponent} from './pages/container/settings/settings.component';
import { SignupComponent } from './pages/signup/signup.component';


const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'signup', component: SignupComponent},
  {
    path: 'container',
    component: ContainerComponent,
    children: [
      {path: 'chat', component: ChatComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'forms', component: FormsComponent},
      {path: 'newsroom', component: NewsroomComponent},
      {path: 'property-list', component: PropertyListComponent},
      {path: 'settings', component: SettingsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
