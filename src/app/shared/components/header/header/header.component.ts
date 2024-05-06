import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {UserInformationCollectorService} from "../../../services/userInformationCollector.service";
import {CookieService} from "ngx-cookie-service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [UserInformationCollectorService, UserService]
})
export class HeaderComponent implements OnInit {

  constructor(private userInformation: UserInformationCollectorService, private userService: UserService, private cookieService: CookieService) {}

  ngOnInit(): void {}

  private get userId() {
    return this.userInformation.userInfo ? this.userInformation.userInfo.id : undefined;
  }

  public get isAuthenticate() {
    return !!this.userInformation.token;
  }
  setCulture(culture: string) {
    this.cookieService.set('culture', culture);
  }
  public get isAdmin() {
    if (this.userInformation.userInfo) {
      for (let role of this.userInformation.userInfo.role) {
        if (role == "Admin") return true;
      }
    }
    return false;
  }

  public logout() {
    this.userService.logout();
  }

}
