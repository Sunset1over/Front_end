import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../shared/services/user.service";
import {CookieService} from "ngx-cookie-service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationResponseModel} from "../../../models/base-models/authenticationResponseModel.interface";
import {Router, RouterLink} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {AuthenticationRequestModel} from "../../../models/base-models/authenticationRequestModel.interface";
import {NgIf} from "@angular/common";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {IInput} from "../../../shared/components/input/models/input.interface";
import {faEye, faUser} from "@fortawesome/free-solid-svg-icons";
import {InputComponent} from "../../../shared/components/input/input/input.component";
import {LoginButtonComponent} from "../../../shared/components/login-button/login-button/login-button.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    HeaderComponent,
    InputComponent,
    LoginButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../../styles.scss', '../../../../util.scss'],
  providers: [UserService, CookieService]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  receivedUser : AuthenticationResponseModel | undefined;

  public loginConfig: IInput = {
    type: 'default',
    placeholder: 'Username',
    isDisabled: false,
    error:"Error",
    icon: faUser
  }
  public passwordConfig: IInput = {
    type: 'default',
    placeholder: 'Password',
    isDisabled: false,
    error: "Error",
    icon: faEye,
    isChangingType: true
  }

  constructor(private authService: UserService, private CookieService : CookieService, private router: Router) {}
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


    this.authService.loginUser(userObject).subscribe({
      next: (data: AuthenticationResponseModel) => {
        if (data.isAuthSuccessful) {
          this.saveToCookieStorage(data.token);
          this.router.navigate(["/profile"]);
        }
      },
      error: (error: any) => console.log(error)
    });
  }
}
