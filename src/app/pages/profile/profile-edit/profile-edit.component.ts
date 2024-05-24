import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserProfileModel} from "../models/user-profile.model";
import {ProfileService} from "../profile-service/profile-service.service";
import {Router} from "@angular/router";
import {UserEditRequest} from "../models/user-edit-request.model";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";

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
    this.profileService.getUserProfile().subscribe({
      next:(data:UserProfileModel) => {
        this.isUserExists = true;
        this.userInfo = data;
      },
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
        this.toastr.success("Profile update successfully.")
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
