import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AlertData} from "../alert-dialog/alert-dialog.component";
import {UserResponse} from "../services/responses/UserResponse";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent {
  public EditForm: FormGroup
  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditUserData,
    private userService: UserService,
    private router: Router
  ) {
    let jwt: String | null = localStorage.getItem('jwt')
    if(jwt != null){
      userService.token = jwt
    }
    else {
      router.navigate(['/login'])
      this.dialogRef.close()
    }
    this.EditForm = new FormGroup({
      "lName": new FormControl(data.user.lName, [Validators.required]),
      "fName": new FormControl(data.user.fName, [Validators.required]),
      "patronymic": new FormControl(data.user.patronymic, [Validators.required]),
      "email": new FormControl(data.user.email, [Validators.required, Validators.email]),
      "phone": new FormControl(data.user.phone, [Validators.required, Validators.pattern("^[0-9]{11,13}$")])
    })
  }
  onConfirmClick(): void {
    if(this.data.user.role != "admin"){
      this.userService.SimpleUpdate(
        this.EditForm.value["lName"],
        this.EditForm.value["fName"],
        this.EditForm.value["patronymic"]
      ).subscribe(value => {
        this.dialogRef.close()
      }, (error: HttpErrorResponse) => {
        console.log(error)
        this.dialogRef.close()
      })
    }else {
      this.userService.AdminUpdate(
        this.EditForm.value["lName"],
        this.EditForm.value["fName"],
        this.EditForm.value["patronymic"],
        this.EditForm.value["phone"],
        this.data.user.email,
        this.EditForm.value["email"]
      ).subscribe(value => {
        this.dialogRef.close()
      },(error:HttpErrorResponse) => {
        console.log(error)
      })
    }

  }
  onClose(): void{
    this.dialogRef.close();
  }
}
export interface EditUserData{
  user: UserResponse
}
