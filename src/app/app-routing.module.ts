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
import {VerifyEmailAddressComponent} from './pages/signup/verify-email-address/verify-email-address.component';
import {StaffManagementComponent} from './pages/container/settings/staff-management/staff-management.component';
import {UnitsManagementComponent} from './pages/container/settings/units-management/units-management.component';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {ContainerGuardService} from './shared-services/container-guard.service';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'verify-email-address', component: VerifyEmailAddressComponent},

  {
    path: 'container',
    component: ContainerComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      {path: 'chat', component: ChatComponent, canActivate: [ContainerGuardService]},
      {path: 'dashboard', component: DashboardComponent, canActivate: [ContainerGuardService]},
      {path: 'forms', component: FormsComponent, canActivate: [ContainerGuardService]},
      {path: 'newsroom', component: NewsroomComponent, canActivate: [ContainerGuardService]},
      {path: 'settings', component: SettingsComponent, canActivate: [ContainerGuardService]},
      {path: 'property-list', component: PropertyListComponent},
      {path: 'staff', component: StaffManagementComponent, canActivate: [ContainerGuardService]},
      {path: 'units', component: UnitsManagementComponent, canActivate: [ContainerGuardService]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
