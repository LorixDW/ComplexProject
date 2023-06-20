import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {UserResponse} from "../services/responses/UserResponse";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import {EditUserDialogComponent} from "../edit-user-dialog/edit-user-dialog.component";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  public user: UserResponse = {} as UserResponse;
  public EditClick():void{
    this.dialog.open(EditUserDialogComponent, {
      data: {user: this.user}
    }).afterClosed().subscribe(value => {
      this.userServies.GetCurrent().subscribe(value => {
        this.user = value
      },(error: HttpErrorResponse) => {
        localStorage.clear()
        this.router.navigate(["/login"])
      })
    })
  }
  constructor(public router: Router, private userServies: UserService, public dialog: MatDialog) {
    let jwt: string | null = localStorage.getItem('jwt')
    if(jwt == null){
      router.navigate(["/login"])
    }
    if(jwt != null){
      userServies.token = jwt
      console.log(jwt)
      userServies.GetCurrent().subscribe(value => {
         this.user = value
      },(error: HttpErrorResponse) => {
        console.log(error)
        this.dialog.open(AlertDialogComponent, {
          data: {title: "Ошибка", content: "Что-то пошло не так"}
        })
        localStorage.clear()
        this.router.navigate(["/login"])
      })
    }
  }
}

