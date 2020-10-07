import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './angular.material';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { RegistrationComponent } from './pages/registration/registration.component';
import { EmailVerificationDialogComponent } from './pages/registration/email-verification-dialog/email-verification-dialog.component';
import { LoginComponent } from './pages/login/login.component';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    EmailVerificationDialogComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'my-app-name'),
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
