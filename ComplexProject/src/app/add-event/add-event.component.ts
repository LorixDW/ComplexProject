import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {EventService} from "../services/event.service";
import {Privacy} from "../services/responses/Privacy";
import {EditUserData} from "../edit-user-dialog/edit-user-dialog.component";
import {AlertData, AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import {formatDate} from "@angular/common";
import {DateTime} from "../services/responses/DateTime";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {
  public addForm: FormGroup
  public privaces = {
    open: Privacy.OPEN,
    half: Privacy.HALF_OPEN,
    close: Privacy.PRIVATE
  };
  constructor(
    public dialogRef: MatDialogRef<AddEventComponent>,
    public dialog: MatDialog,
    private eventService: EventService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: AlertData,
    private router: Router) {
    let jwt: String | null = localStorage.getItem('jwt')
    if(jwt != null){
      userService.token = jwt
      eventService.token = jwt
      userService.GetCurrent().subscribe(value => {},
        error => {
          router.navigate(['/account'])
        })
    }
    else {
      router.navigate(['/login'])
      this.dialogRef.close()
    }
    this.addForm = new FormGroup({
      "title": new FormControl("", [Validators.required]),
      "summary": new FormControl("", [Validators.required]),
      "description": new FormControl("", [Validators.required]),
      "place": new FormControl("", [Validators.required]),
      "start": new FormControl<Date>(new Date(), [Validators.required]),
      "end": new FormControl<Date>(new Date(), [Validators.required]),
      "privacy": new FormControl<Privacy>(Privacy.OPEN, [Validators.required])
    })
  }
  submit(){
    let start: Date = this.addForm.value['start']
    let end: Date = this.addForm.value['end']
    if(start > new Date() && end > start){
      this.eventService.Add(
        this.addForm.value['title'],
        this.addForm.value['summary'],
        this.addForm.value['description'],
        this.addForm.value['place'],
        new DateTime(start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()),
        new DateTime(end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes()),
        this.addForm.value['privacy']
      ).subscribe(value => {
        this.dialogRef.close()
      }, error => {
        this.dialog.open(AlertDialogComponent, {
          data: {title: "Ошибка", content: "Неверные даты начала/окончания"}
        })
      })
    }else {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Неверные даты начала/окончания"}
      })
    }
  }
}
