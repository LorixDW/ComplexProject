import { Component } from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {UserService} from "./services/user.service";
import {UserResponse} from "./services/responses/UserResponse";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLogined: boolean = false;
  loginClick(){
    this.router.navigate(['/login'])
  }
  regClick(){
    this.router.navigate(['/registration'])
  }
  accountClick(){
    this.router.navigate(['/account'])
  }
  selfEventsClick(){
    this.router.navigate(['/events/all'])
  }
  exitClick(){
    localStorage.clear()
    this.router.navigate(["/login"])
  }
  constructor(private router: Router, private userServies: UserService) {
    let jwt: string | null = localStorage.getItem('jwt')
    router.events.subscribe(event => {
      if(event instanceof NavigationStart){
        let jwt: string | null = localStorage.getItem('jwt')
        this.isLogined = jwt != null;
      }
    })
  }
}
