import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UserService} from "./shared/services/user.service";
import {environment} from "./environments/enviroment";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-app';

  constructor(private translateService: TranslateService, private userService: UserService) {}

  ngOnInit(): void {
    this.translateService.setDefaultLang(environment.defaultLocale);
    this.translateService.addLangs(['en', 'uk']);
    this.translateService.use(this.userService.getCultureParam() || 'en');

    this.userService.cultureChange.subscribe(() => {
      this.translateService.use(this.userService.getCultureParam() || 'en');
    });
  }
}
