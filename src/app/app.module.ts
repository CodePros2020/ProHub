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
import { AngularFireDatabaseModule } from '@angular/fire/database';
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
import { FormsComponent } from './pages/container/forms/forms.component';
import { UploadFormDialogComponent } from './pages/container/forms/upload-form-dialog/upload-form-dialog.component';
import { UnitsManagementComponent } from './pages/container/settings/units-management/units-management.component';
import { AddEditUnitComponent } from './pages/container/settings/units-management/add-edit-unit/add-edit-unit.component';
import { NewsroomComponent } from './pages/container/newsroom/newsroom.component';
import { AddEditNewsDialogComponent } from './pages/container/newsroom/add-edit-news-dialog/add-edit-news-dialog.component';
import { AddAttachmentDialogComponent } from './pages/container/newsroom/add-edit-news-dialog/add-attachment-dialog/add-attachment-dialog.component';
import { AddImageDialogComponent } from './pages/container/newsroom/add-edit-news-dialog/add-image-dialog/add-image-dialog.component';
import { ChatComponent } from './pages/container/chat/chat.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapsNominatimService } from './shared-services/maps-nominatim.service';
import { ProhubLogoComponent } from './shared-components/prohub-logo/prohub-logo.component';
import { VerifyEmailAddressComponent } from './pages/signup/verify-email-address/verify-email-address.component';
import { ErrorDialogComponent } from './shared-components/error-dialog/error-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GenericDeleteDialogComponent } from './shared-components/generic-delete-dialog/generic-delete-dialog.component';
import { ChatListComponent } from './pages/container/chat/chat-list/chat-list.component';
import { ChatRoomComponent } from './pages/container/chat/chat-room/chat-room.component';
import { ChatListCardComponent } from './pages/container/chat/chat-list/chat-list-card/chat-list-card.component';
import { DatePipe } from '@angular/common';
import { PropertyService } from './shared-services/property.service';
import { ChatService } from './shared-services/chat.service';
import { ImageUploadDialogComponent } from './pages/container/chat/chat-room/image-upload-dialog/image-upload-dialog.component';

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
    VerifyEmailAddressComponent,
    ErrorDialogComponent,
    GenericDeleteDialogComponent,
    ChatListComponent,
    ChatRoomComponent,
    ChatListCardComponent,
    ImageUploadDialogComponent,
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
    AngularFireDatabaseModule,
    AngularFirestoreModule, // Only required for database features
    AngularFireAuthModule, // Only required for auth features,
    AngularFireStorageModule, // Only required for storage features
    AngularFireMessagingModule,
    LeafletModule,
    FlexLayoutModule

  ],
  providers: [
    FirebaseService,
    AuthService,
    MapsNominatimService,
    DatePipe,
    ChatService,
    PropertyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
