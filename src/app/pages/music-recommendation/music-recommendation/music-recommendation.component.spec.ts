import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MusicRecommendationComponent } from './music-recommendation.component';
import { MusicRecommendationService } from '../services/music-recommendation-service.service';
import { SongSpotifyResponseModel } from '../models/song-spotify-response.model';
import { SongDbResponseModel } from '../models/song-db-response.model';

describe('MusicRecommendationComponent', () => {
  let component: MusicRecommendationComponent;
  let fixture: ComponentFixture<MusicRecommendationComponent>;
  let musicRecommendationServiceMock: any;
  let toastrServiceMock: any;
  let activatedRouteMock: any;
  let translateServiceMock: any;

  beforeEach(waitForAsync(() => {
    musicRecommendationServiceMock = jasmine.createSpyObj('MusicRecommendationService', ['GetLastRecommendations', 'GetRecommendationById', 'GetSongBySearchString']);
    toastrServiceMock = jasmine.createSpyObj('ToastrService', ['info', 'success', 'warning']);
    activatedRouteMock = { snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue('test-id') } } };
    translateServiceMock = jasmine.createSpyObj('TranslateService', ['instant', 'get']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MusicRecommendationService, useValue: musicRecommendationServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TranslateService, useValue: translateServiceMock },
        MusicRecommendationComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MusicRecommendationComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    const mockSongSpotifyResponse: SongSpotifyResponseModel[] = [
      { id: '1', name: 'song1', artistName: 'artist1', previewUrl: 'http://example.com/preview1', songLink: 'http://example.com/song1' },
      { id: '2', name: 'song2', artistName: 'artist2', previewUrl: 'http://example.com/preview2', songLink: 'http://example.com/song2' }
    ];

    const mockSongDbResponse: SongDbResponseModel[] = [
      { id: '1', name: 'song1' },
      { id: '2', name: 'song2' }
    ];

    musicRecommendationServiceMock.GetLastRecommendations.and.returnValue(of(mockSongSpotifyResponse));
    musicRecommendationServiceMock.GetRecommendationById.and.returnValue(of(mockSongSpotifyResponse));
    musicRecommendationServiceMock.GetSongBySearchString.and.returnValue(of(mockSongDbResponse));

    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    expect(component.musicRecommendation).toBeTruthy();
    expect(component.musicRecommendation.controls['first_song_name']).toBeTruthy();
    expect(component.musicRecommendation.controls['second_song_name']).toBeTruthy();
  });

  it('should fetch last recommendations on ngOnInit', () => {
    const mockLastRecommendations: SongSpotifyResponseModel[] = [
      { id: '1', name: 'song1', artistName: 'artist1', previewUrl: 'http://example.com/preview1', songLink: 'http://example.com/song1' },
      { id: '2', name: 'song2', artistName: 'artist2', previewUrl: 'http://example.com/preview2', songLink: 'http://example.com/song2' }
    ];
    musicRecommendationServiceMock.GetLastRecommendations.and.returnValue(of(mockLastRecommendations));

    component.ngOnInit();

    expect(musicRecommendationServiceMock.GetLastRecommendations).toHaveBeenCalled();
    expect(component.lastRecommendedSongs).toEqual(mockLastRecommendations);
  });

  it('should show toastr info if fetching last recommendations fails', () => {
    musicRecommendationServiceMock.GetLastRecommendations.and.returnValue(throwError(() => new Error('Error fetching recommendations')));

    component.ngOnInit();

    expect(musicRecommendationServiceMock.GetLastRecommendations).toHaveBeenCalled();
    expect(toastrServiceMock.info).toHaveBeenCalledWith("To access your recommendation history, please subscribe.", undefined, { timeOut: 8000 });
  });

  it('should submit the form and get recommendations', () => {
    const mockRecommendations: SongSpotifyResponseModel[] = [
      { id: '1', name: 'song1', artistName: 'artist1', previewUrl: 'http://example.com/preview1', songLink: 'http://example.com/song1' },
      { id: '2', name: 'song2', artistName: 'artist2', previewUrl: 'http://example.com/preview2', songLink: 'http://example.com/song2' }
    ];
    musicRecommendationServiceMock.GetRecommendationById.and.returnValue(of(mockRecommendations));

    component.musicRecommendation.setValue({
      first_song_name: 'song1',
      second_song_name: 'song2',
      first_song_select: '1',
      second_song_select: '2'
    });

    component.submit(component.musicRecommendation.value);

    expect(musicRecommendationServiceMock.GetRecommendationById).toHaveBeenCalledWith('1', '2');
    expect(toastrServiceMock.success).toHaveBeenCalledWith("Recommendations received successfully.");
    expect(component.listRecommendedSongs).toEqual(mockRecommendations);
  });

  it('should show toastr warning if recommendations fetch fails', () => {
    musicRecommendationServiceMock.GetRecommendationById.and.returnValue(throwError(() => new Error('Error fetching recommendations')));

    component.musicRecommendation.setValue({
      first_song_name: 'song1',
      second_song_name: 'song2',
      first_song_select: '1',
      second_song_select: '2'
    });

    component.submit(component.musicRecommendation.value);

    expect(toastrServiceMock.warning).toHaveBeenCalledWith("Both songs must be selected.");
  });

  it('should search for songs when input changes', () => {
    const mockSongDbResponse: SongDbResponseModel[] = [
      { id: '1', name: 'song1' },
      { id: '2', name: 'song2' }
    ];
    musicRecommendationServiceMock.GetSongBySearchString.and.returnValue(of(mockSongDbResponse));

    component.onInputChange('abc', 0);

    expect(musicRecommendationServiceMock.GetSongBySearchString).toHaveBeenCalledWith('abc');
    expect(component.matchingFirstSongs).toEqual(mockSongDbResponse);
  });

  it('should handle error in song search gracefully', () => {
    musicRecommendationServiceMock.GetSongBySearchString.and.returnValue(throwError(() => new Error('Error searching for songs')));

    component.onInputChange('abc', 0);

    expect(musicRecommendationServiceMock.GetSongBySearchString).toHaveBeenCalledWith('abc');
    expect(component.matchingFirstSongs).toBeUndefined();
  });

  it('should search for second set of songs when input changes', () => {
    const mockSongDbResponse: SongDbResponseModel[] = [
      { id: '1', name: 'song1' },
      { id: '2', name: 'song2' }
    ];
    musicRecommendationServiceMock.GetSongBySearchString.and.returnValue(of(mockSongDbResponse));

    component.onInputChange('abc', 1);

    expect(musicRecommendationServiceMock.GetSongBySearchString).toHaveBeenCalledWith('abc');
    expect(component.matchingSecondSongs).toEqual(mockSongDbResponse);
  });
});
