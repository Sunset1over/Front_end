import {Component, Input, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.scss'
})
export class LoginButtonComponent implements OnInit {
  @Input() text: string | undefined;
  @Input() disabled: boolean = false;

  ngOnInit(): void {
  }
}
