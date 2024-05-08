import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {UserInformationCollectorService} from "../../../services/userInformationCollector.service";
import {CookieService} from "ngx-cookie-service";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {IIconButton} from "../../icon-button/models/icon-button.interface";
import {faAddressCard, faArrowRightToBracket, faUser} from "@fortawesome/free-solid-svg-icons";
import {IconButtonComponent} from "../../icon-button/icon-button/icon-button.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    IconButtonComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [UserInformationCollectorService, UserService]
})
export class HeaderComponent implements OnInit {

  public loginIcon: IIconButton = {
    classes: "default",
    icon: faUser,
    isOutside: false,
    link: '/login'
  }
  public logoutIcon: IIconButton = {
    classes: "default",
    icon: faArrowRightToBracket,
    isOutside: false,
    link: '/login'
  }
  public userProfile: IIconButton = {
    classes: "default",
    icon: faAddressCard,
    isOutside: false,
    link: `/profile`
  }

  constructor(private userInformation: UserInformationCollectorService, private userService: UserService, private cookieService: CookieService) {}

  ngOnInit(): void {}

  public get isAuthenticate() {
    return !!this.userInformation.token;
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
