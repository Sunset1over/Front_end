import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment.prod';
import { AuthenticationRequestModel } from '../../models/base-models/authenticationRequestModel.interface';
import { AuthenticationResponseModel } from '../../models/base-models/authenticationResponseModel.interface';
import { IRegistrationRequestModelInterface } from '../../models/base-models/IRegistrationRequestModel.interface';
import { IUserResponse } from '../../models/base-models/IUserResponseModel.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let cookieService: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['get', 'deleteAll']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: CookieService, useValue: cookieServiceSpy }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should log in a user', () => {
    const mockUser: AuthenticationRequestModel = { name: 'testUser', password: 'testPassword' };
    const mockResponse: AuthenticationResponseModel = {
      isAuthSuccessful: true,
      errorMessage: '',
      token: 'testToken'
    };

    service.loginUser(mockUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.urlAddress}/api/Authentication/Login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userName: 'testUser', password: 'testPassword' });
    req.flush(mockResponse);
  });

  it('should get the culture parameter from cookies', () => {
    const culture = 'en';
    cookieService.get.and.returnValue(culture);

    const result = service.getCultureParam();
    expect(result).toBe(culture);
    expect(cookieService.get).toHaveBeenCalledWith('culture');
  });

  it('should delete all cookies on logout', () => {
    service.logout();
    expect(cookieService.deleteAll).toHaveBeenCalled();
  });

  it('should register a new user', () => {
    const mockUser: IRegistrationRequestModelInterface = {
      Firstname: 'John',
      Lastname: 'Doe',
      UserName: 'johndoe',
      Email: 'john.doe@example.com',
      Password: 'password123'
    };
    const mockResponse: IUserResponse = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe'
    };

    service.registerUser(mockUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.urlAddress}/api/Authentication/Registration`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      Firstname: 'John',
      Lastname: 'Doe',
      UserName: 'johndoe',
      Email: 'john.doe@example.com',
      Password: 'password123',
      Role: 100
    });
    req.flush(mockResponse);
  });
});
