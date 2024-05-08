import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {ProfileComponent} from "./profile/profile.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProfileEditComponent} from "./profile-edit/profile-edit.component";
import {ProfileEditPasswordComponent} from "./profile-edit-password/profile-edit-password.component";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'profile', component: ProfileComponent},
      {path: 'profile/edit', component: ProfileEditComponent},
      {path: 'profile/changePassword', component: ProfileEditPasswordComponent},
      // {path: 'payer-page', component: PayPalPageComponent}
    ]),
    //HeaderModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ProfileModule { }
