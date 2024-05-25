import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from '@angular/router';
import {NgIf} from "@angular/common";
import {UserService} from "../../../shared/services/user.service";
import {IRegistrationRequestModelInterface} from "../../../models/base-models/IRegistrationRequestModel.interface";
import {catchError, of, Subject, takeUntil, tap} from "rxjs";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    HeaderComponent,
    RouterLink
  ],
  templateUrl: 'registration.component.html',
  styleUrl: './registration.component.scss',
  providers: [UserService]
})

export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();
  error!: string;

  constructor(private authService: UserService,
              private router: Router,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      "username": new FormControl("", [Validators.required, Validators.minLength(8)]),
      "password": new FormControl("", [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,32}$')]),
      "firstname": new FormControl("", [Validators.required]),
      "lastname":new FormControl("", Validators.required),
      "email": new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]),
    })
  }

  validateControl = (controlName: string) => {
    return this.registrationForm.get(controlName)?.invalid && this.registrationForm.get(controlName)?.touched
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
        tap(() => {
          this.toastr.success("Registered successfully.")
          this.router.navigate(['/login']).then(
            () => {},
            () => {}
          )
        }),
        catchError(() => {
          this.toastr.error("User with such username or email already exists");
          return of(undefined);
        })
      )
      .subscribe();
  }
}
