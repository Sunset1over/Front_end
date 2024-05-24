import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../profile-service/profile-service.service";
import {UserProfileModel} from "../models/user-profile.model";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {NgIf} from "@angular/common";
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
    this.router.navigate(["/profile/edit"]);
  }

  editPasswordAccount(): void {
    this.router.navigate(["/profile/changePassword"]);
  }
}
