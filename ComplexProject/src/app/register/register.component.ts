import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import {NavigationStart, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  HidePass1: boolean = true;
  HidePass2: boolean = true;
  regForm: FormGroup;

  SubmitClick(){
    if(this.regForm.value['pass1'] === this.regForm.value['pass2']){
      this.authService.Register(
        this.regForm.value["lName"],
        this.regForm.value["fName"],
        this.regForm.value["patronymic"],
        this.regForm.value["phone"],
        this.regForm.value["email"],
        this.regForm.value["pass1"]
      ).subscribe(value => {
        this.router.navigate(['/login'])
      }, (error: HttpErrorResponse) => {
        this.dialog.open(AlertDialogComponent, {
          data: {title: "Ошибка", content: "Email занят"}
        })
      })
    }
    else {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Пароли не совпадают"}
      })
    }
  }

  constructor(public dialog: MatDialog, private router: Router, private authService: AuthService) {
    this.regForm = new FormGroup({
      "lName": new FormControl("", [Validators.required, Validators.maxLength(20)]),
      "fName": new FormControl("", [Validators.required, Validators.maxLength(20)]),
      "patronymic": new FormControl("", [Validators.required, Validators.maxLength(20)]),
      "email": new FormControl("", [Validators.required, Validators.email]),
      "phone": new FormControl("", [Validators.required, Validators.pattern("^[0-9]{11,13}$")]),
      "pass1": new FormControl("", [Validators.required, Validators.minLength(8)]),
      "pass2": new FormControl("", [Validators.required, Validators.minLength(8)])
    })

  }
}
