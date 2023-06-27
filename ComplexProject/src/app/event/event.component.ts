import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {EventService} from "../services/event.service";
import {ParticipantService} from "../services/participant.service";
import {NotificationService} from "../services/notification.service";
import {ApplicationService} from "../services/application.service";
import {UserResponse} from "../services/responses/UserResponse";
import {EventResponse} from "../services/responses/EventResponse";
import {ParticipantResponse} from "../services/responses/ParticipantResponse";
import {NotificationResponse} from "../services/responses/NotificationResponse";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import {Privacy} from "../services/responses/Privacy";
import {EditEventComponent} from "../edit-event/edit-event.component";
import {AddNotificationComponent} from "../add-notification/add-notification.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EditNotificationComponent} from "../edit-notification/edit-notification.component";
import {AddParticipantComponent} from "../add-participant/add-participant.component";
import {ApplicationType} from "../services/responses/ApplicationType";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent {
  id: number
  isParticipant: boolean = false
  user: UserResponse = {} as UserResponse
  event: EventResponse = {} as EventResponse
  participants: ParticipantResponse[] = []
  notifications: NotificationResponse[] = []
  privacy: string = ""
  isApplicated: boolean = false
  public notifEdit: FormGroup = {} as FormGroup
  constructor(public router: Router, private userServies: UserService, public dialog: MatDialog, private eventService: EventService, private activateRoute: ActivatedRoute, private participantService: ParticipantService, private notificationService: NotificationService, private applicationService: ApplicationService) {
    this.id = activateRoute.snapshot.params['id']
    let jwt: string | null = localStorage.getItem('jwt')
    if(jwt == null){
      router.navigate(["/login"])
    }
    if(jwt != null){
      userServies.token = jwt
      eventService.token = jwt
      participantService.token = jwt
      notificationService.token = jwt
      applicationService.token = jwt
      userServies.GetCurrent().subscribe(value => {
        this.user = value
      }, error => {
        this.dialog.open(AlertDialogComponent, {
          data: {title: "Ошибка", content: "Время сеанса истекло"}
        })
        localStorage.clear()
        this.router.navigate(["/login"])
      })
      eventService.GetById(this.id).subscribe(value => {
        this.event = value
        console.log(this.event)
        value.start.date = new Date(value.start.year, value.start.month, value.start.day, value.start.hour, value.start.minute).toLocaleString()
        value.end.date = new Date(value.start.year, value.start.month, value.start.day, value.start.hour, value.start.minute).toLocaleString()
        if(value.privacy == Privacy.OPEN){this.privacy = "Открытое"}
        if(value.privacy == Privacy.HALF_OPEN){this.privacy = "Полуоткрытое"}
        if(value.privacy == Privacy.PRIVATE){this.privacy = "Закрытое"}
        this.participantUpdate()
      }, error => {
        this.dialog.open(AlertDialogComponent, {
          data: {title: "Ошибка", content: `Событие ${this.id} не найдено`}
        })
        this.router.navigate(["/login"])
      })
      notificationService.GetAll(true, null, null, this.id).subscribe(value => {
        this.notifications = value
      })
      this.notifEdit = new FormGroup({
        "text": new FormControl("", [Validators.required]),
        "days": new FormControl(0, [Validators.required])
      })

    }
  }
  NotifUpdate(){
    this.notificationService.GetAll(true, null, null, this.id).subscribe(value => {
      this.notifications = value
    })
  }
  editEvent(){
    this.dialog.open(EditEventComponent, {
      data: {id: this.id}
    })
  }
  addNotification(){
    this.dialog.open(AddNotificationComponent, {
      data: {eventId: this.id}
    }).afterClosed().subscribe(value => {this.NotifUpdate()})
  }
  editNotification(id: number,  text: String){
    this.dialog.open(EditNotificationComponent, {
      data: {id: id, text: text}
    }).afterClosed().subscribe(value => {this.NotifUpdate()})
  }
  addParticipant(){
    this.dialog.open(AddParticipantComponent, {
      data: {event: this.event}
    }).afterClosed().subscribe(value => {this.participantUpdate()})
  }
  participantUpdate(){
    this.participantService.GetAll(this.id).subscribe(value => {
      this.participants = value
      if(this.participants.filter(value => value.email == this.user.email && value.eventId == this.event.id).length != 0){
        this.isParticipant = true
      }
    })
    this.applicationService.GetAll(true, ApplicationType.INVITE, null, null, null, null).subscribe(value => {
      this.isApplicated = value.filter(value1 => value1.user.email == this.user.email && value1.eventId == this.event.id).length != 0
    })
    this.applicationService.GetAll(false, ApplicationType.APPLICATION, null, null, null, this.event.creator.email.toString()).subscribe(value => {
      this.isApplicated = value.filter(value1 => value1.user.email == this.user.email && value1.eventId == this.event.id).length != 0
    })
  }
}
