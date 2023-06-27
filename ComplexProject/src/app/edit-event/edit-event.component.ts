import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Privacy} from "../services/responses/Privacy";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EventService} from "../services/event.service";
import {UserService} from "../services/user.service";
import {AlertData, AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import {Router} from "@angular/router";
import {DateTime} from "../services/responses/DateTime";
import {EventResponse} from "../services/responses/EventResponse";

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent {
  public editForm: FormGroup = {} as FormGroup
  public event: EventResponse = {} as EventResponse
  public testEvent: EventResponse = {} as EventResponse
  public privaces = {
    open: Privacy.OPEN,
    half: Privacy.HALF_OPEN,
    close: Privacy.PRIVATE
  };
  constructor(
    public dialogRef: MatDialogRef<EditEventComponent>,
    public dialog: MatDialog,
    private eventService: EventService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: EditData,
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
    eventService.GetById(data.id).subscribe(value => {
      this.testEvent = value
      this.editForm = new FormGroup({
        "title": new FormControl(value.title.toString(), [Validators.required]),
        "summary": new FormControl(value.summary.toString(), [Validators.required]),
        "description": new FormControl(value.description.toString(), [Validators.required]),
        "place": new FormControl(value.place.toString(), [Validators.required]),
        "start": new FormControl<Date>(new Date(value.start.year, value.start.month, value.start.day, value.start.hour, value.start.minute), [Validators.required]),
        "end": new FormControl<Date>(new Date(value.end.year, value.end.month, value.end.day, value.end.hour, value.end.minute), [Validators.required])
      })
    }, error => router.navigate(['/account']))

  }
  submit(){
    let start: Date = this.editForm.value['start']
    let end: Date = this.editForm.value['end']
    if(start > new Date() && end > start){
      this.eventService.Edit(
        this.data.id,
        this.editForm.value['title'],
        this.editForm.value['summary'],
        this.editForm.value['description'],
        this.editForm.value['place'],
        new DateTime(start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()),
        new DateTime(end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes())
      ).subscribe(value => {
        this.dialogRef.close()
      })
    }else {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Неверные даты начала/окончания"}
      })
    }
  }
}
interface EditData{
  id: number
}
