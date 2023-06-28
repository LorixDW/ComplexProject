import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {UserResponse} from "../services/responses/UserResponse";
import {HttpErrorResponse} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import {EditUserDialogComponent} from "../edit-user-dialog/edit-user-dialog.component";
import {EventResponse} from "../services/responses/EventResponse";
import {EventService} from "../services/event.service";
import {Privacy} from "../services/responses/Privacy";
import {FormControl, FormGroup} from "@angular/forms";
import {AddEventComponent} from "../add-event/add-event.component";
import {NotificationResponse} from "../services/responses/NotificationResponse";
import {ApplicationResponse} from "../services/responses/ApplicationResponse";
import {NotificationService} from "../services/notification.service";
import {ApplicationService} from "../services/application.service";
import {ApplicationType} from "../services/responses/ApplicationType";
import {EditNotificationComponent} from "../edit-notification/edit-notification.component";
import {AcceptDialogComponent} from "../accept-dialog/accept-dialog.component";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  public notifications: NotificationResponse[] = []
  public invitations: ApplicationResponse[] = []
  public applications: ApplicationResponse[] = []
  public user: UserResponse = {} as UserResponse;
  public eventItem: EventResponse = {} as EventResponse
  public event: EventResponse[] = []
  public privaces: Privacy[] = []
  public search: FormGroup = {} as FormGroup;
  public searchPath: string = "";
  public deleted: boolean = false
  public NotifyDeleted: boolean = false
  public ApplicationDeleted: boolean = false
  public applicationToggle: boolean = false;
  public EditClick():void{
    this.dialog.open(EditUserDialogComponent, {
      data: {user: this.user}
    }).afterClosed().subscribe(value => {
      this.userServies.GetCurrent().subscribe(value => {
        this.user = value
      },(error: HttpErrorResponse) => {
        localStorage.clear()
        this.router.navigate(["/login"])
      })
    })
  }
  public openEvent(id: number){
    this.router.navigate([`/event/${id}`])
  }
  public firstChipClick(){
    if(this.privaces.includes(Privacy.OPEN)){
      this.privaces = this.privaces.filter((p) => p != Privacy.OPEN)
    }
    else {
      this.privaces.push(Privacy.OPEN)
    }
    this.EventsReload()
  }
  public secondChipClick(){
    if(this.privaces.includes(Privacy.HALF_OPEN)){
      this.privaces = this.privaces.filter((p) => p != Privacy.HALF_OPEN)
    }
    else {
      this.privaces.push(Privacy.HALF_OPEN)
    }
    this.EventsReload()
  }
  public thirdChipClick(){
    if(this.privaces.includes(Privacy.PRIVATE)){
      this.privaces = this.privaces.filter((p) => p != Privacy.PRIVATE)
    }
    else {
      this.privaces.push(Privacy.PRIVATE)
    }
    this.EventsReload()
  }
  private EventsReload(){
    let types: Privacy[] | null
    if(this.privaces.length == 0){
      types = null
    }else {
      types = this.privaces
    }
    this.eventService.GetAll(
      true,
      this.deleted,
      types
    ).subscribe(value => {
      this.event = value
      this.event.forEach((value) => {
        value.start.date = new Date(value.start.year, value.start.month, value.start.day, value.start.hour, value.start.minute).toLocaleString()
        value.end.date = new Date(value.start.year, value.start.month, value.start.day, value.start.hour, value.start.minute).toLocaleString()
      })
      this.event.sort((e1, e2) => e1.id - e2.id)
      let pattern: RegExp = new RegExp(this.searchPath)
      this.event = this.event.filter((value) => pattern.test(value.title.toString()))
    })
  }
  public eventSearch(){
    this.searchPath = this.search.value["searchField"]
    this.EventsReload()
  }
  public deletedTogle(val: boolean){
    this.deleted = val
    this.EventsReload()
  }
  public notifyDeletedToggle(val: boolean){
    this.NotifyDeleted = val
    this.notificationsReload(null)
  }
  public applicationDeletedToggle(val: boolean){
    this.ApplicationDeleted = val
    this.applicationsReload()
  }
  public addEvent(){
    this.dialog.open(AddEventComponent).afterClosed().subscribe(value => {
      this.EventsReload()
    })
  }
  public applicationsReload(){
    this.applicationService.GetAll(true, ApplicationType.APPLICATION, null, this.ApplicationDeleted, null, null).subscribe(value => {
      this.applications = value
    })
    this.applicationService.GetAll(true, ApplicationType.INVITE, null, this.ApplicationDeleted, null, null).subscribe(value => {
      this.invitations = value
    })
  }
  public notificationsReload(mode: string | null){
    this.notificationService.GetAll(true, this.NotifyDeleted, null, null).subscribe(value => {
      this.notifications = value
      if(mode == 'today'){
        let date: Date = new Date()
        this.notifications = this.notifications.filter(v => v.sent.year == date.getFullYear() && v.sent.month == date.getMonth() + 1 && v.sent.day == date.getDate())
      }
      if(mode == 'tomorrow'){
        let date: Date = new Date()
        date.setDate(date.getDate() + 1)
        this.notifications = this.notifications.filter(v => v.sent.year == date.getFullYear() && v.sent.month == date.getMonth() + 1 && v.sent.day == date.getDate())
      }
      if(mode == 'actual'){
        let date: Date = new Date()
        this.notifications = this.notifications.filter(value => new Date(value.sent.year, (value.sent.month - 1), value.sent.day) > date )
      }
    })
  }
  editNotification(notif: NotificationResponse){
    this.dialog.open(EditNotificationComponent, {
      data: {notification: notif}
    }).afterClosed().subscribe(value => {this.notificationsReload(null)})
  }
  applicationToggleF(action: boolean){
    this.applicationToggle = action
    console.log(this.applications, this.invitations)
  }
  acceptApplication(id: number){
    this.dialog.open(AcceptDialogComponent, {
      data: {id: id}
    }).afterClosed().subscribe(value => {this.applicationsReload()})
  }
  deleteEvent(id: number){
    this.eventService.Delete(id).subscribe(value => {this.EventsReload()}, error => {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Удаление не удалось"}
      })
    })
  }
  restoreEvent(id: number){
    this.eventService.Restore(id).subscribe(value => {this.EventsReload()}, error => {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Восстановление не удалось"}
      })
    })
  }
  deleteNotification(id: number){
    this.notificationService.Delete(id).subscribe(value => {this.notificationsReload(null)},error => {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Удаление не удалось"}
      })
    })
  }
  restoreNotification(id: number){
    this.notificationService.Restore(id).subscribe(value => {this.notificationsReload(null)}, error => {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Восстановление не удалось"}
      })
    })
  }
  deleteApplication(id: number){
    this.applicationService.Delete(id).subscribe(value => {this.applicationsReload()}, error => {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Удаление не удалось"}
      })
    })
  }
  restoreApplication(id: number){
    this.applicationService.Restore(id).subscribe(value => {this.applicationsReload()},error => {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Восстановление не удалось"}
      })
    })
  }
  constructor(public router: Router, private userServies: UserService, public dialog: MatDialog, private eventService: EventService, private notificationService: NotificationService, private applicationService: ApplicationService) {
    let jwt: string | null = localStorage.getItem('jwt')
    if(jwt == null){
      router.navigate(["/login"])
    }
    if(jwt != null){
      userServies.token = jwt
      eventService.token = jwt
      notificationService.token = jwt
      applicationService.token = jwt
      console.log(jwt)
      userServies.GetCurrent().subscribe(value => {
         this.user = value
        this.applicationsReload()
        this.notificationsReload(null)
      },(error: HttpErrorResponse) => {
        this.dialog.open(AlertDialogComponent, {
          data: {title: "Ошибка", content: "Время сеанса истекло"}
        })
        localStorage.clear()
        this.router.navigate(["/login"])
      })
      eventService.GetAll(
        true,
        null,
        null
      ).subscribe(value => {
        this.event = value
        this.event.forEach((value) => {
          value.start.date = new Date(value.start.year, value.start.month, value.start.day, value.start.hour, value.start.minute).toLocaleString()
          value.end.date = new Date(value.start.year, value.start.month, value.start.day, value.start.hour, value.start.minute).toLocaleString()
        })
        this.event.sort((e1, e2) => e1.id - e2.id)
      })
      this.search = new FormGroup({
        'searchField': new FormControl("", [])
      })
    }
  }
}
