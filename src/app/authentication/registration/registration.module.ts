import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RegistrationComponent} from "./registration/registration.component";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";




@NgModule({
  declarations: [],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: RegistrationComponent,
            }
        ]),
    ]
})
export class RegistrationModule { }
