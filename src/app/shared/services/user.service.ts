import {HttpClient} from "@angular/common/http";
import {EventEmitter, Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {jwtDecode} from "jwt-decode";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../environments/environment.prod";
import {IUserResponse} from "../../models/base-models/IUserResponseModel.interface";
import {IRegistrationRequestModelInterface} from "../../models/base-models/IRegistrationRequestModel.interface";
import {AuthenticationRequestModel} from "../../models/base-models/authenticationRequestModel.interface";
import {AuthenticationResponseModel} from "../../models/base-models/authenticationResponseModel.interface";

@Injectable({providedIn: "root"})
export class UserService {
  private readonly api = environment.urlAddress;

  constructor(private http: HttpClient, public cookieService: CookieService) {
  }

  loginUser(user:AuthenticationRequestModel):Observable<AuthenticationResponseModel>{
    const body = {userName:user.name, password:user.password};
    return this.http.post<AuthenticationResponseModel>(`${this.api}/api/Authentication/Login`, body);
  }

  logout(){
    this.cookieService.deleteAll();
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  public getToken(): string {
    return this.cookieService.get('token') ?? '';
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether the token is expired
    return token != '';
  }

  registerUser(user: IRegistrationRequestModelInterface): Observable<IUserResponse> {
    const body = {
      Firstname: user.Firstname,
      Lastname: user.Lastname,
      UserName: user.UserName,
      Email: user.Email,
      Password: user.Password,
      Role: 100
    }
    return this.http.post<IUserResponse>(`${this.api}/api/Authentication/Registration`, body);
  }
}
