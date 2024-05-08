import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {AdminComponent} from "./admin/admin.component";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:'admin-panel', component: AdminComponent
      }
    ])
  ]
})
export class AdminModule { }
