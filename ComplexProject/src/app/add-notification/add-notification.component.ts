import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EventService} from "../services/event.service";
import {UserService} from "../services/user.service";
import {AlertData, AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import {Router} from "@angular/router";
import {NotificationService} from "../services/notification.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.css']
})
export class AddNotificationComponent {
  public notifForm: FormGroup
  constructor(
    public dialogRef: MatDialogRef<AddNotificationComponent>,
    public dialog: MatDialog,
    private notifService: NotificationService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: NotifAddData,
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
      "text": new FormControl("", [Validators.required]),
      "days": new FormControl(0, [Validators.required])
    })
  }
  submit(){
    this.notifService.Add(this.data.eventId, this.notifForm.value['text'], this.notifForm.value['days']).subscribe(value => {
      this.dialogRef.close()
    }, error => {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Неверные Данные"}
      })
    })
  }
}
interface NotifAddData {
  eventId: number
}
