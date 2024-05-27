import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UserService } from './shared/services/user.service';
import { of, Subject } from 'rxjs';
import {environment} from "./environments/enviroment";


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let translateService: jasmine.SpyObj<TranslateService>;
  let userService: jasmine.SpyObj<UserService>;
  let cultureChangeSubject: Subject<void>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'addLangs', 'use']);
    cultureChangeSubject = new Subject<void>();
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getCultureParam'], { cultureChange: cultureChangeSubject.asObservable() });

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        AppComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'angular-app' title`, () => {
    expect(component.title).toEqual('angular-app');
  });

  it('should set default language on init', () => {
    fixture.detectChanges();

    expect(translateService.setDefaultLang).toHaveBeenCalledWith(environment.defaultLocale);
    expect(translateService.addLangs).toHaveBeenCalledWith(['en', 'uk']);
    expect(translateService.use).toHaveBeenCalledWith(userService.getCultureParam() || 'en');
  });

  it('should subscribe to cultureChange and use the culture param', () => {
    userService.getCultureParam.and.returnValue('uk');
    fixture.detectChanges();

    // Emit a value to the cultureChange subject
    cultureChangeSubject.next();

    expect(translateService.use).toHaveBeenCalledWith('uk');
  });

  it('should use default language if getCultureParam returns a falsy value', () => {
    userService.getCultureParam.and.returnValue('');
    fixture.detectChanges();

    // Emit a value to the cultureChange subject
    cultureChangeSubject.next();

    expect(translateService.use).toHaveBeenCalledWith('en');
  });
});
