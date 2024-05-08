import {Component, Input, OnInit} from '@angular/core';
import {IIconButton} from "../models/icon-button.interface";
import {NgClass, NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    FaIconComponent,
    RouterLink
  ],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss'
})
export class IconButtonComponent implements OnInit{
  ngOnInit(): void {
  }
  private componentParameters!: IIconButton;
  @Input() set inputParameters(value: IIconButton) {
    this.componentParameters = value;
  }

  get inputParameters(): IIconButton {
    return this.componentParameters;
  }
}
