import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/services/user.service";
import {CookieService} from "ngx-cookie-service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationResponseModel} from "../../../models/base-models/authenticationResponseModel.interface";
import {Router, RouterLink} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {AuthenticationRequestModel} from "../../../models/base-models/authenticationRequestModel.interface";
import {NgClass, NgIf} from "@angular/common";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {ToastrService} from "ngx-toastr";
import {catchError, of, Subject, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    HeaderComponent,
    NgClass
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../../styles.scss', '../../../../util.scss'],
  providers: [UserService, CookieService]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();

  constructor(private authService: UserService,
              private CookieService : CookieService,
              private router: Router,
              private toastr: ToastrService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      "username": new FormControl("", Validators.required),
      "password": new FormControl("",
        [Validators.required
        ])
    })
  }

  validateControl = (controlName: string) => {
    return this.loginForm.get(controlName)?.invalid && this.loginForm.get(controlName)?.touched
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch(Error) {
      return null;
    }
  }

  saveToCookieStorage(token: string): void{
    try {
      const tokenInfo = this.getDecodedAccessToken(token);

      const userInfo = {
        id: tokenInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
        username: tokenInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        role: tokenInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      }
      const exp = tokenInfo.exp;

      this.CookieService.set('token', token, exp);
      this.CookieService.set('user', JSON.stringify(userInfo), exp);
    } catch(Error) {
      console.log(Error)
    }
  }

  submit = (loginFormValue:any) => {

    const login = {...loginFormValue};

    const userObject: AuthenticationRequestModel = {
      name: login.username,
      password: login.password
    }

    this.authService.loginUser(userObject)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((data: AuthenticationResponseModel) => {
          if (data.isAuthSuccessful) {
            this.saveToCookieStorage(data.token);
            this.toastr.success("Logged in successfully.");
            this.router.navigate(["/music-recommendation"]).then(
              () => {},
              () => {}
            );
          } else this.toastr.error(data.errorMessage)
        }),
        catchError(() => {
          return of(undefined)
        })
      ).subscribe();
  }
}
