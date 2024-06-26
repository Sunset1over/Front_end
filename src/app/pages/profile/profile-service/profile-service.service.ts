import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import { UserProfileModel } from "../models/user-profile.model";
import {Observable, Subject, takeUntil, tap} from "rxjs";
import {UserEditRequest} from "../models/user-edit-request.model";
import {UserPasswordRequest} from "../models/user-password-request.model";
import {UserPhotoModel} from "../models/user-photo.model";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ProfileService{
  private readonly api = environment.urlAddress;
  private unsubscribe$ = new Subject<void>();

  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private toastr: ToastrService) { }

  getUserProfile():Observable<UserProfileModel>{
    return this.http.get<UserProfileModel>(`${this.api}/api/UserAccount/GetUserInfo`);
  }

  deleteUserProfile() : void{
    this.http.delete(`${this.api}/api/UserAccount/DeleteAccount`)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => {
          this.cookieService.deleteAll()
          this.toastr.success("User Profile Deleted Successfully!");
        })
      ).subscribe();
  }

  editUserProfile(user: UserEditRequest):Observable<UserProfileModel>{
    const body = {firstName:user.firstName, lastName:user.lastName, userName:user.userName, email:user.email};
    return this.http.put<UserProfileModel>(`${this.api}/api/UserAccount/UpdateUserInfo`, body);
  }

  editUserPassword(user: UserPasswordRequest):Observable<UserProfileModel>{
    const body = {oldPassword:user.oldPassword, newPassword:user.newPassword};
    return this.http.patch<UserProfileModel>(`${this.api}/api/UserAccount/UpdatePassword`, body);
  }

  changeAvatar(photo?: File):Observable<UserPhotoModel>{
    const formData = new FormData();
    formData.append('photo', photo ? photo : "")

    return this.http.put<UserPhotoModel>(`${this.api}/api/UserAccount/ChangeAvatar`, formData);
  }
}
