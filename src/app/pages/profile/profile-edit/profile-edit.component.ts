import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserProfileModel} from "../models/user-profile.model";
import {ProfileService} from "../profile-service/profile-service.service";
import {Router} from "@angular/router";
import {UserEditRequest} from "../models/user-edit-request.model";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {catchError, of, Subject, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    HeaderComponent,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss'
})
export class ProfileEditComponent implements OnInit {
  editUserForm!: FormGroup;
  public isUserExists : boolean = false;
  public userInfo!: UserProfileModel;
  private unsubscribe$ = new Subject<void>();

  constructor(private profileService: ProfileService,
              private router: Router,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.editUserForm = new FormGroup({
      "username": new FormControl("", Validators.minLength(8)),
      "email": new FormControl("",
        [Validators.email
        ]),
      "firstname": new FormControl("",
        [Validators.minLength(2)
        ]),
      "lastname": new FormControl("",
        [Validators.minLength(2)
        ])
    })
    this.profileService.getUserProfile()
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((data: UserProfileModel) => {
          this.isUserExists = true;
          this.userInfo = data;
        }),
        catchError(() => {
          return of(undefined)
        })
      ).subscribe();
  }

  validateControl = (controlName: string) => {
    return this.editUserForm.get(controlName)?.invalid && this.editUserForm.get(controlName)?.touched
  }

  cancel() : void{
    this.router.navigate(["/profile"]).then(
      () => {},
      () => {}
    )
  }

  submit = (editUserFormValue:any) => {

    const info = {...editUserFormValue};

    const userObject: UserEditRequest = {
      userName: info.username,
      email: info.email,
      firstName: info.firstname,
      lastName: info.lastname,
    }

    this.profileService.editUserProfile(userObject)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => {
          this.toastr.success("Profile update successfully.")
          this.router.navigate(["/profile"]).then(
            () => {},
            () => {}
          )
        }),
        catchError(() => {
          return of(undefined)
        })
      ).subscribe();
  }
}
