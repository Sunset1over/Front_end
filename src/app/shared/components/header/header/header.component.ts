import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {UserInformationCollectorService} from "../../../services/userInformationCollector.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf} from "@angular/common";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import {IconButtonComponent} from "../../icon-button/icon-button/icon-button.component";
import {FaIconComponent, FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    IconButtonComponent,
    RouterLinkActive,
    FaIconComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [UserInformationCollectorService, UserService]
})
export class HeaderComponent implements OnInit {

  constructor(private userInformation: UserInformationCollectorService, private userService: UserService, private library: FaIconLibrary, private  cookieService: CookieService) {
    this.library.addIcons(faSignOutAlt);
  }

  ngOnInit(): void {}

  public get isAdmin() {
    if (this.userInformation.userInfo) {
      for (let role of this.userInformation.userInfo.role) {
        if (role == "Admin") return true;
      }
    }
    return false;
  }

  setCulture(culture: string) {
    this.cookieService.set('culture', culture);
  }

  public logout() {
    this.userService.logout();
  }
}
