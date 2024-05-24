import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {MusicRecommendationService} from "../services/music-recommendation-service.service";
import {SongDbResponseModel} from "../models/song-db-response.model";
import {SongRecommendationModel} from "../models/song-recommendation.model";
import {SongSpotifyResponseModel} from "../models/song-spotify-response.model";

@Component({
  selector: 'app-music-recommendation',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    HeaderComponent,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './music-recommendation.component.html',
  styleUrl: './music-recommendation.component.scss'
})
export class MusicRecommendationComponent implements OnInit{
  musicRecommendation!: FormGroup;
  listRecommendedSongs?: SongSpotifyResponseModel[];
  matchingFirstSongs?: SongDbResponseModel[];
  matchingSecondSongs?: SongDbResponseModel[];
  lastRecommendedSongs?: SongSpotifyResponseModel[];

  constructor(private musicRecommendationService: MusicRecommendationService,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.musicRecommendation = this.formBuilder.group({
      first_song_name: ['', Validators.required],
      second_song_name: ['', Validators.required],
      first_song_select: [''],
      second_song_select: ['']
    });

    this.musicRecommendationService.GetLastRecommendations().subscribe({
      next: (result: SongSpotifyResponseModel[] ) => {
        this.lastRecommendedSongs = result
      }, error: (err)=> {
        if (err.status != 423) {
          console.log(err);
        }
      }
    })
  }

  submit = (musicRecommendationForm: any) => {
    const data = {...musicRecommendationForm};

    const musicRecommendationRequest: SongRecommendationModel = {
      FirstSongId: data.first_song_select,
      SecondSongId: data.second_song_select,
    }

    this.musicRecommendationService.GetRecommendationById(musicRecommendationRequest.FirstSongId, musicRecommendationRequest.SecondSongId).subscribe({
      next: (data: SongSpotifyResponseModel[]) => {
        this.listRecommendedSongs = data
      }, error: (error: any) => console.log(error)
    })
  }

  onInputChange(e: any, inputId: number) {
    if(e.length >= 3) {
      this.musicRecommendationService.GetSongBySearchString(e).subscribe({
        next: (e: SongDbResponseModel[]) => {
          if(inputId == 0) {
            this.matchingFirstSongs = e
          }
          else this.matchingSecondSongs = e
        }, error: (error: any) => console.log(error)
      })
    }
  }
}
