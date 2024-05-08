import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent implements OnInit, DoCheck{
public title?:string;
public message?: string;
public isAppear?:boolean = true;
private timer:any;
@Input() set errorTitle(erTitle:string){
    this.title =erTitle;
  }
@Input() set errorMessage(erMessage:string){
    this.message = erMessage;
  }

  ngOnInit(): void {
    this.timer = setInterval(()=>{
      this.isAppear = false;
    },6000)
  }

  ngDoCheck(): void {
    if (!this.isAppear){
    clearInterval(this.timer);
  }
}
}
