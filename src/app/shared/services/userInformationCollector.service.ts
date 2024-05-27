import {Injectable} from "@angular/core";
import {CookieService} from "ngx-cookie-service";
import {UserService} from "./user.service";

@Injectable()
export class UserInformationCollectorService{

  constructor(private userService: UserService,
              private cookieService: CookieService) {}

  public get userInfo():any{
    if (this.userService.isAuthenticated()){
      return JSON.parse(this.cookieService.get('user'));
    }
    return null;
  }

  public get token():string{
    return this.cookieService.get('token');
  }
}
