import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../profile-service/profile-service.service";
import {UserProfileModel} from "../models/user-profile.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit{

  public isUserExists : boolean = false;
  public isUserIsHospitalHost : boolean = false;
  public userInfo!: UserProfileModel;


  public get isUserHospitalHost() : boolean{
    const decodedToken = this.userService.getDecodedAccessToken(this.userService.getToken());
    const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    return Array.isArray(roles) && roles.includes('HospitalHost');
  }
  constructor(private profileService: ProfileService, private route: ActivatedRoute, private router: Router, private  userService: UserService) {
  }

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe({
      next:(data:UserProfileModel) => {
        this.isUserExists = true;
        this.userInfo = data;
        this.isUserIsHospitalHost = this.isUserHospitalHost;
        console.log(this.isUserIsHospitalHost)
      },
      error: error => console.log(error)
    })
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
