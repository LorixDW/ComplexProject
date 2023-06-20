import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {delay} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading: boolean = false;
  isLogined: boolean = false;
  canResend: boolean = false;
  hidePass: boolean = true;
  email: String = "";
  password: String = "";
  loginForm: FormGroup;
  codeSend: FormGroup;
  ResendClick(){
    alert("resend")
  }
  BackClick(){
    this.isLogined = false
  }
  SubmiLogin(){
    this.isLoading = true;
    this.email = this.loginForm.value["email"]
    this.password = this.loginForm.value["password"]
    this.authService.FirstLogin(this.email, this.password).subscribe(value => {
      console.log(value.text)
      this.isLogined = true;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Неверный пароль или аддресс электронной почты!"}
      })
    });

  }
  SubmitCode(){
    this.authService.SecondLogin(this.codeSend.value["code"], this.email).subscribe(value => {
      localStorage.setItem("jwt", value.jwtToken.toString())
      this.router.navigate(['/account'])
    }, error => {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Неверный код!"}
      })
    })

  }
  constructor(private router: Router, private authService: AuthService, public dialog: MatDialog) {
    this.loginForm = new FormGroup({
      "email": new FormControl("", [Validators.required, Validators.email]),
      "password": new FormControl("", [Validators.required, Validators.minLength(8)])
    })
    this.codeSend = new FormGroup({
      "code": new FormControl("", [Validators.required])
    })
    if(localStorage.getItem('jwt') != null){
      this.router.navigate(['/account'])
    }
  }
}
