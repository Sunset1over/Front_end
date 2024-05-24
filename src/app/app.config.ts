import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import {routes} from './app.routes';
import {HttpClient, provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./shared/services/user.service.interceptor";
import {provideToastr} from "ngx-toastr";
import {provideAnimations} from "@angular/platform-browser/animations";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";



export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideToastr(
      {
        positionClass: 'toast-bottom-right',
        closeButton: true,
        maxOpened: 2,
        timeOut: 4000
      }
    ),
    provideAnimations(),
    importProvidersFrom(TranslateModule.forRoot({
      loader:{
        provide: TranslateLoader,
        useFactory: (http:HttpClient) => {return new TranslateHttpLoader(http, './assets/i18n/', '.json');},
        deps: [HttpClient]
      }
    }))
  ],

};
