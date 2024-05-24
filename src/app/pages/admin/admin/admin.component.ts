import {Component, OnInit} from '@angular/core';
import {UserProfileModel} from "../../profile/models/user-profile.model";
import {AdminService} from "../services/admin-service.service";
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    HeaderComponent,
    NgForOf,
    FormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit{
  public userList? : UserProfileModel[];

  constructor(private adminService: AdminService,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.refreshUserList();
  }

  banUser(userId : string) : void{
    this.adminService.banUser(userId).subscribe({
      next:() => {
        this.toastr.success("Changed user access");
        this.refreshUserList();
      },
      error: error => {}
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
        this.toastr.success("Admin role added");
        this.refreshUserList();
      },
      error: error => console.log(error)
    });
  }

  removeAdminRole(userId: string): void {
    this.adminService.removeAdminRole(userId).subscribe({
      next: () => {
        this.toastr.success("Admin role removed");
        this.refreshUserList();
      },
      error: error => console.log(error)
    });
  }
}
