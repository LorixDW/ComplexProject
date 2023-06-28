import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../services/notification.service";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import {NotificationResponse} from "../services/responses/NotificationResponse";

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
    console.log(this.getDays())
    this.notifForm = new FormGroup({
      "text": new FormControl(data.notification.description.toString(), [Validators.required]),
      "days": new FormControl(this.getDays(), [Validators.required, Validators.min(0)])
    })
  }
  submit(){
    this.notifService.Edit(this.data.notification.id, this.notifForm.value['text'], this.notifForm.value['days']).subscribe(value => {
      this.dialogRef.close()
    }, error => {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Неверные Данные"}
      })
    })
  }
  public getDays(): number{
    let start: Date = new Date(this.data.notification.start.year, this.data.notification.start.month -1, this.data.notification.start.day)
    let sent: Date = new Date(this.data.notification.sent.year, this.data.notification.sent.month - 1, this.data.notification.sent.day)
    return (start.valueOf() - sent.valueOf()) / (1000*3600*24)
  }
}
interface NotifEditData {
  notification:NotificationResponse
}
