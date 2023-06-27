import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ApplicationService} from "../services/application.service";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {UserResponse} from "../services/responses/UserResponse";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-accept-dialog',
  templateUrl: './accept-dialog.component.html',
  styleUrls: ['./accept-dialog.component.css']
})
export class AcceptDialogComponent {
  private user: UserResponse = {} as UserResponse;
  public acceptForm: FormGroup = {} as FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AcceptDialogComponent>,
    public dialog: MatDialog,
    private applicationService: ApplicationService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: AcceptData,
    private router: Router
  ) {
    let jwt: String | null = localStorage.getItem('jwt')
    if(jwt != null){
      userService.token = jwt
      applicationService.token = jwt
      userService.GetCurrent().subscribe(value => {
          this.user = value
        },
        error => {
          router.navigate(['/account'])
        })
    }
    else {
      router.navigate(['/login'])
      this.dialogRef.close()
    }
    this.acceptForm = new FormGroup({
      "type": new FormControl("", [Validators.required])
    })
  }
  submit(){
    this.applicationService.Accept(this.data.id, this.acceptForm.value['type']).subscribe(value => {
      this.dialogRef.close()
    })
  }
}

interface AcceptData{
  id: number
}
