import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserInformationCollectorService } from '../../../services/userInformationCollector.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule } from '@ngx-translate/core';
import { ReloadService } from '../../../services/reload.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    RouterLinkActive,
    FaIconComponent,
    TranslateModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [UserInformationCollectorService, UserService],
})
export class HeaderComponent {
  constructor(
    private userInformation: UserInformationCollectorService,
    private userService: UserService,
    private library: FaIconLibrary,
    private cookieService: CookieService,
    private reloadService: ReloadService
  ) {
    this.library.addIcons(faSignOutAlt);
  }

  public get isAdmin() {
    if (this.userInformation.userInfo) {
      for (let role of this.userInformation.userInfo.role) {
        if (role == 'Admin') return true;
      }
    }
    return false;
  }

  reloadPage() {
    this.reloadService.reload();
  }

  setCulture(culture: string) {
    this.cookieService.set('culture', culture);
    this.reloadPage();
  }

  public logout() {
    this.userService.logout();
  }
}
