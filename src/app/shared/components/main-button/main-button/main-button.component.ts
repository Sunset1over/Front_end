import {Component, Input, OnInit} from '@angular/core';
import {MainButtonInterface} from "../models/main-button.interface";
import {NgClass, NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-main-button',
  standalone: true,
  imports: [
    NgIf,
    FaIconComponent,
    RouterLink,
    NgClass
  ],
  templateUrl: './main-button.component.html',
  styleUrl: './main-button.component.scss'
})
export class MainButtonComponent implements OnInit{
  ngOnInit(): void {
  }
  private componentParameters!: MainButtonInterface;
  @Input() disabled: boolean = false;
  @Input() type? : string;
  @Input() set inputParameters(value: MainButtonInterface) {
    this.componentParameters = value;
  }

  get inputParameters(): MainButtonInterface {
    return this.componentParameters;
  }
}
