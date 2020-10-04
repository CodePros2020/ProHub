import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { EmailVerificationDialogComponent } from './pages/registration/email-verification-dialog/email-verification-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    EmailVerificationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
