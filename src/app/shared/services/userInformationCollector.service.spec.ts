import { TestBed } from "@angular/core/testing";
import { UserInformationCollectorService } from "./userInformationCollector.service";
import { UserService } from "./user.service";
import { CookieService } from "ngx-cookie-service";

describe("UserInformationCollectorService", () => {
  let service: UserInformationCollectorService;
  let userService: jasmine.SpyObj<UserService>;
  let cookieService: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj("UserService", ["isAuthenticated"]);
    const cookieServiceSpy = jasmine.createSpyObj("CookieService", ["get"]);

    TestBed.configureTestingModule({
      providers: [
        UserInformationCollectorService,
        { provide: UserService, useValue: userServiceSpy },
        { provide: CookieService, useValue: cookieServiceSpy }
      ]
    });

    service = TestBed.inject(UserInformationCollectorService);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return user info if authenticated", () => {
    const mockUser = { name: "John Doe", role: "Admin" };
    userService.isAuthenticated.and.returnValue(true);
    cookieService.get.and.returnValue(JSON.stringify(mockUser));

    expect(service.userInfo()).toEqual(mockUser);
    expect(userService.isAuthenticated).toHaveBeenCalled();
    expect(cookieService.get).toHaveBeenCalledWith("user");
  });

  it("should return null if not authenticated", () => {
    userService.isAuthenticated.and.returnValue(false);

    expect(service.userInfo()).toBeNull();
    expect(userService.isAuthenticated).toHaveBeenCalled();
    expect(cookieService.get).not.toHaveBeenCalledWith("user");
  });

  it("should return the token from cookies", () => {
    const mockToken = "some-token";
    cookieService.get.and.returnValue(mockToken);

    expect(service.token).toBe(mockToken);
    expect(cookieService.get).toHaveBeenCalledWith("token");
  });
});
