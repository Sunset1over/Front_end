import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../profile-service/profile-service.service";
import {UserProfileModel} from "../models/user-profile.model";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {UserService} from "../../../shared/services/user.service";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {NgIf} from "@angular/common";
import {MainButtonInterface} from "../../../shared/components/main-button/models/main-button.interface";
import {faKey, faMoneyBill, faPencil, faTrash} from "@fortawesome/free-solid-svg-icons";
import {MainButtonComponent} from "../../../shared/components/main-button/main-button/main-button.component";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {UserPhotoModel} from "../models/user-photo.model";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    NgIf,
    MainButtonComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit{

  public isUserExists : boolean = false;
  public userInfo!: UserProfileModel;
  public changeAvatar!: FormGroup;
  UserPhotoUrl?: string;
  selectedFile: File | null = null;
  public deleteButton: MainButtonInterface = {
    classes: "red",
    icon: faTrash,
    size: "default",
    text: "Delete"
  }
  public editButton: MainButtonInterface = {
    classes: "yellow",
    icon: faPencil,
    link: `/profile/edit`,
    size: "default",
    text: "Edit"
  }
  public subscriptionButton: MainButtonInterface = {
    classes: "green",
    icon: faMoneyBill,
    link: "/payer-page",
    size: "default",
    text: "Create subscription"
  }
  public changePasswordButton: MainButtonInterface = {
    classes: "yellow",
    icon: faKey,
    link: `/profile/changePassword`,
    size: "default",
    text: "Change password"
  }

  constructor(private profileService: ProfileService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {
    this.changeAvatar = this.fb.group({
      avatar: ['']
    });
  }

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe({
      next:(data:UserProfileModel) => {
        this.isUserExists = true;
        this.userInfo = data;
        this.initializeUserPhoto();
      },
      error: error => console.log(error)
    })
  }

  submit(event: Event) {
    event.preventDefault();
    if (this.selectedFile) {
      this.profileService.changeAvatar(this.selectedFile).subscribe({
        next: (data: UserPhotoModel) => {
          this.UserPhotoUrl = data.uri;
        },
        error: error => console.log(error)
      });
    } else {
      console.log('No file selected');
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  initializeUserPhoto(): void {
    if (this.userInfo.photo && this.userInfo.photo.uri) {
      this.UserPhotoUrl = this.userInfo.photo.uri;
    } else {
      this.UserPhotoUrl = 'https://melodyfusion.blob.core.windows.net/photo/pngtree-businessman.png';
    }
  }

  deleteUserAccount() : void{
    this.profileService.deleteUserProfile();
    this.router.navigate(["/login"]);
  }

  editUserAccount(): void {
    console.log("deleted")
  }

  editPasswordAccount(): void {
    console.log("deleted")
  }
}
