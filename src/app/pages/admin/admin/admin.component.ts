import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UserProfileModel} from "../../profile/models/user-profile.model";
import {RoleEnum} from "../models/role-enum.model";
import {AdminService} from "../services/admin-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    HeaderComponent,
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit{
  public userList? : UserProfileModel[];

  constructor(private adminService: AdminService, private userService: UserService, private route: ActivatedRoute, private router: Router,private cdRef: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.refreshUserList();
  }

  banUser(userId : string) : void{
    this.adminService.banUser(userId).subscribe({
      next:() => {
        this.refreshUserList();
      },
      error: error => {
        console.log(error);
      }
    });
  }

  refreshUserList(): void {
    this.adminService.getUserList().subscribe({
      next: (data?: UserProfileModel[]) => {
        this.userList = data;
      },
      error: error => console.log(error)
    })
  }

  filterUser() : void{
    const email = (document.querySelector('#email') as HTMLInputElement).value;
    const username = (document.querySelector('#username') as HTMLInputElement).value;
    this.adminService.getUserList(email, username).subscribe({
      next: (data?:UserProfileModel[]) => {
        this.userList = data;
      }, error: error => console.log(error)
    });
  }

  addAdminRole(userId: string): void {
    this.adminService.addAdminRole(userId).subscribe({
      next: () => {
        this.refreshUserList();
      },
      error: error => console.log(error)
    });
  }

  removeAdminRole(userId: string): void {
    this.adminService.removeAdminRole(userId).subscribe({
      next: () => {
        this.refreshUserList();
      },
      error: error => console.log(error)
    });
  }

}
