import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {StatisticComponent} from "./statistic/statistic.component";
import {StatisticService} from "./services/statistic.service";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:'statistic', component: StatisticComponent
      }
    ])
  ]
})
export class StatisticModule { }
