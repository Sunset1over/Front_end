import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {MusicRecommendationService} from "../services/music-recommendation-service.service";
import {SongDbResponseModel} from "../models/song-db-response.model";
import {SongRecommendationModel} from "../models/song-recommendation.model";
import {SongSpotifyResponseModel} from "../models/song-spotify-response.model";
import {catchError, of, Subject, takeUntil, tap} from "rxjs";
import {ToastrService} from "ngx-toastr";

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
  private unsubscribe$ = new Subject<void>();

  constructor(private musicRecommendationService: MusicRecommendationService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.musicRecommendation = this.formBuilder.group({
      first_song_name: ['', Validators.required],
      second_song_name: ['', Validators.required],
      first_song_select: [''],
      second_song_select: ['']
    });

    this.musicRecommendationService.GetLastRecommendations()
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((result: SongSpotifyResponseModel[]) => {
          this.lastRecommendedSongs = result;
        }),
        catchError(() => {
          this.toastr.info("To access your recommendation history, please subscribe.", undefined, {timeOut: 8000})
          return of(undefined);
        })
      ).subscribe();
  }

  submit = (musicRecommendationForm: any) => {
    const data = {...musicRecommendationForm};

    const musicRecommendationRequest: SongRecommendationModel = {
      FirstSongId: data.first_song_select,
      SecondSongId: data.second_song_select,
    }

    this.musicRecommendationService.GetRecommendationById(
      musicRecommendationRequest.FirstSongId,
      musicRecommendationRequest.SecondSongId)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((data: SongSpotifyResponseModel[]) => {
          this.toastr.success("Recommendations received successfully.")
          this.listRecommendedSongs = data;
        }),
        catchError(() => {
          this.toastr.warning("Both songs must be selected.")
          return of(undefined);
        })
      ).subscribe();
  }

  onInputChange(e: any, inputId: number) {
    if(e.length == 3) {
      this.musicRecommendationService.GetSongBySearchString(e)
        .pipe(
          takeUntil(this.unsubscribe$),
          tap((e: SongDbResponseModel[]) => {
            if(inputId == 0) this.matchingFirstSongs = e
            else this.matchingSecondSongs = e
          }),
          catchError(() => {
            return of(undefined)
          })
        ).subscribe();
    }
  }
}
