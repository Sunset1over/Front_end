import {HttpErrorResponse, HttpInterceptorFn, HttpResponse} from "@angular/common/http";
import {inject} from "@angular/core";
import {UserService} from "./user.service";
import {tap} from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(UserService).getToken();
  let modifiedReq = req;

  if (token) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // const cultureParam = this.auth.getCultureParam();
  // if (cultureParam) {
  //   modifiedReq = modifiedReq.clone({
  //     params: modifiedReq.params.set('culture', cultureParam)
  //   });
  // }

  return next(modifiedReq).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {

        }
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 401) {
            console.log('Unauthorized');
          }
        }
      }
    })
  );
};
