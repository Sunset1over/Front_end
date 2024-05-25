import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProfileService} from "../profile-service/profile-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../shared/services/user.service";
import {UserPasswordRequest} from "../models/user-password-request.model";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";

import {NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {catchError, of, Subject, takeUntil, tap} from "rxjs";

@Component({
  selector: 'app-profile-edit-password',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './profile-edit-password.component.html',
  styleUrl: './profile-edit-password.component.scss'
})
export class ProfileEditPasswordComponent implements OnInit {
  editUserForm!: FormGroup;
  private unsubscribe$ = new Subject<void>();

  constructor(private profileService: ProfileService,
              private router: Router,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.editUserForm = new FormGroup({
      "oldPassword": new FormControl("", Validators.minLength(8)),
      "newPassword": new FormControl("",
        [Validators.minLength(8)
        ])
    })
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

    const passwordObject: UserPasswordRequest = {
      oldPassword: info.oldPassword,
      newPassword: info.newPassword
    }

    this.profileService.editUserPassword(passwordObject)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => {
          this.toastr.success("Password update successfully.")
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
