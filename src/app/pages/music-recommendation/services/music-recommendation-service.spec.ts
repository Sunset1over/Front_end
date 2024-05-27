import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment.prod';
import { SongDbResponseModel } from '../models/song-db-response.model';
import { SongSpotifyResponseModel } from '../models/song-spotify-response.model';
import {MusicRecommendationService} from "./music-recommendation-service.service";

describe('MusicRecommendationService', () => {
  let service: MusicRecommendationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MusicRecommendationService]
    });
    service = TestBed.inject(MusicRecommendationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch songs by search string', () => {
    const mockSongs: SongDbResponseModel[] = [
      { id: '1', name: 'Song 1' },
      { id: '2', name: 'Song 2' }
    ];
    const songName = 'Song';

    service.GetSongBySearchString(songName).subscribe(songs => {
      expect(songs.length).toBe(2);
      expect(songs).toEqual(mockSongs);
    });

    const req = httpMock.expectOne(`${environment.urlAddress}/api/Song?searchString=${songName}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSongs);
  });

  it('should fetch recommendations by song IDs', () => {
    const mockRecommendations: SongSpotifyResponseModel[] = [
      {
        id: '1',
        name: 'Recommended Song 1',
        previewUrl: 'https://example.com/preview1',
        songLink: 'https://example.com/song1',
        artistName: 'Recommended Artist 1'
      },
      {
        id: '2',
        name: 'Recommended Song 2',
        previewUrl: 'https://example.com/preview2',
        songLink: 'https://example.com/song2',
        artistName: 'Recommended Artist 2'
      }
    ];
    const firstSongId = '1';
    const secondSongId = '2';

    service.GetRecommendationById(firstSongId, secondSongId).subscribe(recommendations => {
      expect(recommendations.length).toBe(2);
      expect(recommendations).toEqual(mockRecommendations);
    });

    const req = httpMock.expectOne(`${environment.urlAddress}/get-recommendation?FirstSongId=${firstSongId}&SecondSongId=${secondSongId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRecommendations);
  });

  it('should fetch last recommendations', () => {
    const mockLastRecommendations: SongSpotifyResponseModel[] = [
      {
        id: '1',
        name: 'Last Recommended Song 1',
        previewUrl: 'https://example.com/preview1',
        songLink: 'https://example.com/song1',
        artistName: 'Last Recommended Artist 1'
      },
      {
        id: '2',
        name: 'Last Recommended Song 2',
        previewUrl: 'https://example.com/preview2',
        songLink: 'https://example.com/song2',
        artistName: 'Last Recommended Artist 2'
      }
    ];

    service.GetLastRecommendations().subscribe(lastRecommendations => {
      expect(lastRecommendations.length).toBe(2);
      expect(lastRecommendations).toEqual(mockLastRecommendations);
    });

    const req = httpMock.expectOne(`${environment.urlAddress}/get-last-recommendations`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLastRecommendations);
  });
});
