import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserProfileModel} from "../models/user-profile.model";
import {MainButtonInterface} from "../../../shared/components/main-button/models/main-button.interface";
import {faCheck, faEnvelope, faSignature, faUser, faXmark} from "@fortawesome/free-solid-svg-icons";
import {IInput} from "../../../shared/components/input/models/input.interface";
import {ProfileService} from "../profile-service/profile-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../shared/services/user.service";
import {UserEditRequest} from "../models/user-edit-request.model";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {NgIf} from "@angular/common";
import {InputComponent} from "../../../shared/components/input/input/input.component";
import {MainButtonComponent} from "../../../shared/components/main-button/main-button/main-button.component";

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    HeaderComponent,
    NgIf,
    ReactiveFormsModule,
    InputComponent,
    MainButtonComponent
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss'
})
export class ProfileEditComponent implements OnInit {
  editUserForm!: FormGroup;
  public isUserExists : boolean = false;
  public userInfo!: UserProfileModel;
  public confirmButton: MainButtonInterface = {
    classes: "green",
    icon: faCheck,
    size: "default",
    text: "Confirm"
  }
  public cancelButton: MainButtonInterface = {
    classes: "yellow",
    icon: faXmark,
    link: `/profile/edit`,
    size: "default",
    text: "Cancel"
  }
  public userNameConfig: IInput = {
    type: 'default',
    placeholder: 'Username',
    isDisabled: false,
    error:"Error",
    icon: faUser
  }

  public firstNameConfig: IInput = {
    type: 'default',
    placeholder: 'Firstname',
    isDisabled: false,
    error:"Error",
    icon: faSignature
  }
  public lastNameConfig: IInput = {
    type: 'default',
    placeholder: 'Lastname',
    isDisabled: false,
    error:"Error",
    icon: faSignature
  }
  public emailConfig: IInput = {
    type: 'default',
    placeholder: 'Email',
    isDisabled: false,
    error:"Error",
    icon: faEnvelope
  }
  constructor(private profileService: ProfileService, private route: ActivatedRoute,private router: Router, private  userService: UserService) {}

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
    this.profileService.getUserProfile().subscribe({
      next:(data:UserProfileModel) => {
        this.isUserExists = true;
        this.userInfo = data;
      },
      error: error => console.log(error)
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

    const userObject: UserEditRequest = {
      userName: info.username,
      email: info.email,
      firstName: info.firstname,
      lastName: info.lastname,
    }

    this.profileService.editUserProfile(userObject).subscribe({
      next:() => {
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
