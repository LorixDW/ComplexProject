import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../services/notification.service";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";

@Component({
  selector: 'app-edit-notification',
  templateUrl: './edit-notification.component.html',
  styleUrls: ['./edit-notification.component.css']
})
export class EditNotificationComponent {
  public notifForm: FormGroup = {} as FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditNotificationComponent>,
    public dialog: MatDialog,
    private notifService: NotificationService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: NotifEditData,
    private router: Router
  ) {
    let jwt: String | null = localStorage.getItem('jwt')
    if(jwt != null){
      userService.token = jwt
      notifService.token = jwt
      userService.GetCurrent().subscribe(value => {},
        error => {
          router.navigate(['/account'])
        })
    }
    else {
      router.navigate(['/login'])
      this.dialogRef.close()
    }
    this.notifForm = new FormGroup({
      "text": new FormControl(data.text.toString(), [Validators.required]),
      "days": new FormControl(0, [Validators.required])
    })
  }
  submit(){
    this.notifService.Edit(this.data.id, this.notifForm.value['text'], this.notifForm.value['days']).subscribe(value => {
      this.dialogRef.close()
    }, error => {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Неверные Данные"}
      })
    })
  }
}
interface NotifEditData {
  id: number,
  text: String
}
