import {Component, OnInit} from '@angular/core';
import {UserProfileModel} from "../../profile/models/user-profile.model";
import {AdminService} from "../services/admin-service.service";
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../../../shared/components/header/header/header.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {catchError, of, Subject, takeUntil, tap} from "rxjs";

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
  private unsubscribe$ = new Subject<void>();

  constructor(private adminService: AdminService,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.refreshUserList();
  }

  banUser(userId : string) : void{
    this.adminService.banUser(userId)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => {
          this.toastr.success("Changed user access");
          this.refreshUserList();
        }),
        catchError(() => {
          return of(undefined)
        })
      ).subscribe();
  }

  refreshUserList(): void {
    this.adminService.getUserList()
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((data?: UserProfileModel[]) => {
          this.userList = data;
        }),
        catchError(() => {
          return of(undefined);
        })
      ).subscribe();
  }

  filterUser() : void{
    const email = (document.querySelector('#email') as HTMLInputElement).value;
    const username = (document.querySelector('#username') as HTMLInputElement).value;

    this.adminService.getUserList(email, username)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((data: UserProfileModel[]) => {
          this.userList = data;
        }),
        catchError(() => {
          return of(undefined)
        })
      ).subscribe();
  }

  addAdminRole(userId: string): void {
    this.adminService.addAdminRole(userId)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => {
          this.toastr.success("Admin role added");
          this.refreshUserList();
        }),
        catchError(() => {
          return of(undefined)
        })
      ).subscribe();
  }

  removeAdminRole(userId: string): void {
    this.adminService.removeAdminRole(userId)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => {
          this.toastr.success("Admin role removed");
          this.refreshUserList();
        }),
        catchError(() => {
          return of(undefined)
        })
      ).subscribe();
  }
}
