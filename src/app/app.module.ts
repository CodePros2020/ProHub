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
import { LoginComponent } from './pages/login/login.component';
import { FirebaseService } from './shared-services/firebase.service';
import { SignupComponent} from './pages/signup/signup.component';
// firebase set up
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { PropertyListComponent } from './pages/container/property-list/property-list.component';
import { ForgotPasswordDialogComponent } from './pages/login/forgot-password-dialog/forgot-password-dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AuthService } from './shared-services/auth.service';
import { ContainerComponent } from './pages/container/container.component';
import { CreateUpdatePropertyComponent } from './pages/container/property-list/create-update-property/create-update-property.component';
import { DashboardComponent } from './pages/container/dashboard/dashboard.component';
import { SettingsComponent } from './pages/container/settings/settings.component';
import { AccountInfoComponent } from './pages/container/settings/account-info/account-info.component';
import { StaffManagementComponent } from './pages/container/settings/staff-management/staff-management.component';
import { AddEditStaffComponent } from './pages/container/settings/staff-management/add-edit-staff/add-edit-staff.component';
import { UploadFileDialogComponent } from './pages/container/settings/staff-management/add-edit-staff/upload-file-dialog/upload-file-dialog.component';
import { FormsComponent } from './pages/container/forms/forms.component';
import { UploadFormDialogComponent } from './pages/container/forms/upload-form-dialog/upload-form-dialog.component';
import { UnitsManagementComponent } from './pages/container/settings/units-management/units-management.component';
import { AddEditUnitComponent } from './pages/container/settings/units-management/add-edit-unit/add-edit-unit.component';
import { NewsroomComponent } from './pages/container/newsroom/newsroom.component';
import { AddEditNewsDialogComponent } from './pages/container/newsroom/add-edit-news-dialog/add-edit-news-dialog.component';
import { AddAttachmentDialogComponent } from './pages/container/newsroom/add-edit-news-dialog/add-attachment-dialog/add-attachment-dialog.component';
import { AddImageDialogComponent } from './pages/container/newsroom/add-edit-news-dialog/add-image-dialog/add-image-dialog.component';
import { ChatComponent } from './pages/container/chat/chat.component';
import { ProhubLogoComponent } from './components/prohub-logo/prohub-logo.component';
import {StoreModule} from '@ngrx/store';
import {storageMetaReducer} from './shared-services/storage.metareducer';
import {metaReducer} from './shared-services/metaReducer';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    PropertyListComponent,
    ForgotPasswordDialogComponent,
    ContainerComponent,
    CreateUpdatePropertyComponent,
    DashboardComponent,
    SettingsComponent,
    AccountInfoComponent,
    StaffManagementComponent,
    AddEditStaffComponent,
    UploadFileDialogComponent,
    FormsComponent,
    UploadFormDialogComponent,
    UnitsManagementComponent,
    AddEditUnitComponent,
    NewsroomComponent,
    AddEditNewsDialogComponent,
    AddAttachmentDialogComponent,
    AddImageDialogComponent,
    ChatComponent,
    SignupComponent,
    ProhubLogoComponent,
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
    AngularFireStorageModule, // Only required for storage features
    AngularFireMessagingModule
  ],
  providers: [FirebaseService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
