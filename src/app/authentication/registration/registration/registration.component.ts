import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from '@angular/router';
import {NgIf} from "@angular/common";
import {UserService} from "../../../shared/services/user.service";
import {IRegistrationRequestModelInterface} from "../../../models/base-models/IRegistrationRequestModel.interface";
import {catchError, of, Subject, takeUntil, tap} from "rxjs";
import {IUserResponse} from "../../../models/base-models/IUserResponseModel.interface";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: 'registration.component.html',
  styleUrl: './registration.component.scss',
  providers: [UserService]
})


export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();


  constructor(private authService: UserService, private router: Router) {}
  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      "username": new FormControl("", [Validators.required, Validators.minLength(8)]),
      "password": new FormControl("", [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$')]),
      "firstname": new FormControl("", [Validators.required]),
      "lastname":new FormControl("", Validators.required),
      "email": new FormControl("", [Validators.required, Validators.email])
    })
  }

  validateControl = (controlName: string) => {
    return this.registrationForm.get(controlName)?.invalid && this.registrationForm.get(controlName)?.touched
  }

  hasError = (controlName: string, errorName: string) => {
    return this.registrationForm.get(controlName)?.hasError(errorName)
  }

  submit = (registrationFormValue:any) => {
    const registration = {...registrationFormValue}

    const registrationRequest: IRegistrationRequestModelInterface = {
      Firstname: registration.firstname,
      Lastname: registration.lastname,
      UserName: registration.username,
      Email: registration.email,
      Password: registration.password
    }

    this.authService.registerUser(registrationRequest)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((data: IUserResponse) => {
          this.router.navigate(['/login'])
        }),
        catchError((error) => {
          return of(undefined);
        })
      )
      .subscribe();
  }
}
