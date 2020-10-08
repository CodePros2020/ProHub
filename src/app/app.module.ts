import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './angular.material';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { EmailVerificationDialogComponent } from './pages/registration/email-verification-dialog/email-verification-dialog.component';
import { LoginComponent } from './pages/login/login.component';
import { FirebaseService } from './shared-service/firebase.service';

// firebase set up
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { PropertyListComponent } from './pages/property-list/property-list.component';
import { ForgotPasswordDialogComponent } from './pages/login/forgot-password-dialog/forgot-password-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    EmailVerificationDialogComponent,
    LoginComponent,
    PropertyListComponent,
    ForgotPasswordDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // Only required for database features
    AngularFireAuthModule, // Only required for auth features,
    AngularFireStorageModule // Only required for storage features
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
