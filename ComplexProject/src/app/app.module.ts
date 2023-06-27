import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import { LoginComponent } from './login/login.component';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatStepperModule} from "@angular/material/stepper";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AccountComponent } from './account/account.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatListModule} from "@angular/material/list";
import {MatTabsModule} from "@angular/material/tabs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import {CommonModule, NgFor, NgForOf} from "@angular/common";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatChipsModule} from "@angular/material/chips";
import { AllEventsComponent } from './all-events/all-events.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { EventComponent } from './event/event.component';
import { AddEventComponent } from './add-event/add-event.component';
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {
  NGX_MAT_DATE_FORMATS,
  NgxMatDateFormats,
  NgxMatDatetimePicker,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule
} from "@angular-material-components/datetime-picker";
import { EditEventComponent } from './edit-event/edit-event.component';
import { AddNotificationComponent } from './add-notification/add-notification.component';
import { EditNotificationComponent } from './edit-notification/edit-notification.component';
import { AddParticipantComponent } from './add-participant/add-participant.component';
import { AcceptDialogComponent } from './accept-dialog/accept-dialog.component';

const appRouts: Routes = [
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path: "registration", component: RegisterComponent},
  {path: "account", component: AccountComponent},
  {path: "events/all", component: AllEventsComponent},
  {path: "event/:id", component: EventComponent},
  {path: "**", component: NotFoundComponent}

]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NotFoundComponent,
    RegisterComponent,
    AlertDialogComponent,
    AccountComponent,
    EditUserDialogComponent,
    AllEventsComponent,
    EventComponent,
    AddEventComponent,
    EditEventComponent,
    AddNotificationComponent,
    EditNotificationComponent,
    AddParticipantComponent,
    AcceptDialogComponent
  ],
  imports: [
    NgFor,
    NgForOf,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRouts),
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatListModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
