import { Component } from '@angular/core';
import {NavigationStart, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLogined: boolean = false;
  lName: string = "Kargapoltsev"
  fName: String = "Stanislav"
  loginClick(){
    this.router.navigate(['/login'])
  }
  regClick(){
    this.router.navigate(['/registration'])
  }
  accountClick(){
    this.router.navigate(['/account'])
  }
  selfEventsClick(){}
  exitClick(){
    localStorage.clear()
    this.router.navigate(["/login"])
  }
  constructor(private router: Router) {
    router.events.subscribe(event => {
      if(event instanceof NavigationStart){
        if(localStorage.getItem('jwt') != null){
          this.isLogined = true
        }
        else {
          this.isLogined = false
        }
      }
    })
  }
}
