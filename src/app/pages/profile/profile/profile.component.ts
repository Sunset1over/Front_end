import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../profile-service/profile-service.service";
import {UserProfileModel} from "../models/user-profile.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../shared/services/user.service";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {NgIf} from "@angular/common";
import {MainButtonInterface} from "../../../shared/components/main-button/models/main-button.interface";
import {faKey, faMoneyBill, faPencil, faTrash} from "@fortawesome/free-solid-svg-icons";
import {MainButtonComponent} from "../../../shared/components/main-button/main-button/main-button.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    NgIf,
    MainButtonComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit{

  public isUserExists : boolean = false;
  public isUserIsHospitalHost : boolean = false;
  public userInfo!: UserProfileModel;
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
