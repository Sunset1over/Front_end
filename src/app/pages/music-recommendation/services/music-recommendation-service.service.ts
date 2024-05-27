import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SongDbResponseModel} from "../models/song-db-response.model";
import {SongSpotifyResponseModel} from "../models/song-spotify-response.model";


@Injectable({
  providedIn: "root",
})

export class MusicRecommendationService {
  private readonly api = environment.urlAddress;

  constructor(private http: HttpClient) {}

  GetSongBySearchString(songName: string): Observable<SongDbResponseModel[]> {
    const searchString = `${this.api}/api/Song?searchString=${songName}`;
    return this.http.get<SongDbResponseModel[]>(searchString);
  }

  GetRecommendationById(FirstSongId: string, SecondSongId: string): Observable<SongSpotifyResponseModel[]> {
    return this.http.get<SongSpotifyResponseModel[]>(`${this.api}/get-recommendation?FirstSongId=${FirstSongId}&SecondSongId=${SecondSongId}`);
  }

  GetLastRecommendations(): Observable<SongSpotifyResponseModel[]> {
    return this.http.get<SongSpotifyResponseModel[]>(`${this.api}/get-last-recommendations`);
  }
}
