import {ChangeDetectorRef, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs";
import {UserProfileModel} from "../../profile/models/user-profile.model";
import {environment} from "../../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly api = environment.urlAddress;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  banUser(userId: string): Observable<UserProfileModel[]> {
    return this.http.patch<UserProfileModel[]>(`${this.api}/api/Admin/BanUser/${userId}`, null);
  }

  getUserList(email?: string, username?: string): Observable<UserProfileModel[]> {
    const queryParams = [];
    if (email) {
      queryParams.push(`SearchRequest=${email}`);
    }
    if (username) {
      queryParams.push(`UserName=${username}`);
    }
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    console.log(queryString)
    return this.http.get<UserProfileModel[]>(`${this.api}/api/Admin/GetUserList${queryString}`);
  }
}
