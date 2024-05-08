import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MainButtonInterface} from "../../../shared/components/main-button/models/main-button.interface";
import {faCheck, faSignature, faUser, faXmark} from "@fortawesome/free-solid-svg-icons";
import {IInput} from "../../../shared/components/input/models/input.interface";
import {ProfileService} from "../profile-service/profile-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../shared/services/user.service";
import {UserPasswordRequest} from "../models/user-password-request.model";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {InputComponent} from "../../../shared/components/input/input/input.component";
import {MainButtonComponent} from "../../../shared/components/main-button/main-button/main-button.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-profile-edit-password',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    InputComponent,
    MainButtonComponent,
    NgIf
  ],
  templateUrl: './profile-edit-password.component.html',
  styleUrl: './profile-edit-password.component.scss'
})
export class ProfileEditPasswordComponent implements OnInit {
  editUserForm!: FormGroup;

  public confirmButton: MainButtonInterface = {
    classes: "green",
    icon: faCheck,
    size: "default",
    text: "Confirm"
  }
  public cancelButton: MainButtonInterface = {
    classes: "yellow",
    icon: faXmark,
    size: "default",
    text: "Cancel"
  }
  public oldPasswordConfig: IInput = {
    type: 'default',
    placeholder: 'Old Password',
    isDisabled: false,
    error:"Error",
    icon: faUser
  }

  public newPasswordConfig: IInput = {
    type: 'default',
    placeholder: 'New Password',
    isDisabled: false,
    error:"Error",
    icon: faSignature
  }
  constructor(private profileService: ProfileService, private route: ActivatedRoute,private router: Router, private  userService: UserService) {}

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
    this.router.navigate(["/profile"])
  }

  submit = (editUserFormValue:any) => {
    const info = {...editUserFormValue};

    const passwordObject: UserPasswordRequest = {
      oldPassword: info.oldPassword,
      newPassword: info.newPassword
    }

    this.profileService.editUserPassword(passwordObject).subscribe({
      next: () => {
        this.router.navigate(["/profile"])
      },
      error: error => {
        if (error.error instanceof ErrorEvent) {
          console.log('An error occurred:', error.error.message);
        } else {
          console.log(`Server returned code ${error.status}, error message is: ${error.error}`);
        }
      }
    });
  }
}
