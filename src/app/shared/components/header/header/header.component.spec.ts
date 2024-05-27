import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { UserService } from '../../../services/user.service';
import { UserInformationCollectorService } from '../../../services/userInformationCollector.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReloadService } from '../../../services/reload.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let userInformation: UserInformationCollectorService;
  let cookieService: jasmine.SpyObj<CookieService>;
  let library: FaIconLibrary;
  let reloadService: jasmine.SpyObj<ReloadService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['logout', 'isAuthenticated']);
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['set', 'get', 'deleteAll']);
    const reloadServiceSpy = jasmine.createSpyObj('ReloadService', ['reload']);

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: ReloadService, useValue: reloadServiceSpy },
        UserInformationCollectorService,
        FaIconLibrary,
        HeaderComponent,
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    userInformation = TestBed.inject(UserInformationCollectorService);
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
    library = TestBed.inject(FaIconLibrary);
    reloadService = TestBed.inject(ReloadService) as jasmine.SpyObj<ReloadService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false if user is not admin', () => {
    spyOnProperty(userInformation, 'userInfo', 'get').and.returnValue({ role: ['User'] });
    expect(component.isAdmin).toBeFalse();
  });

  it('should set culture and reload the window', () => {
    const reloadSpy = spyOn(component, 'reloadPage').and.callThrough();
    const culture = 'en';
    component.setCulture(culture);
    expect(cookieService.set).toHaveBeenCalledWith('culture', culture);
    expect(reloadSpy).toHaveBeenCalled();
    expect(reloadService.reload).toHaveBeenCalled();
  });

  it('should reload the page', () => {
    component.reloadPage();
    expect(reloadService.reload).toHaveBeenCalled();
  });
});
