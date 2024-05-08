import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {MusicRecommendationComponent} from "./music-recommendation/music-recommendation.component";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        "path":"music-recommendation", component: MusicRecommendationComponent
      }
    ])
  ]
})
export class MusicRecommendationModule { }
