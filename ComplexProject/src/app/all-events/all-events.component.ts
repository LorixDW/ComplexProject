import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {MatDialog} from "@angular/material/dialog";
import {EventService} from "../services/event.service";
import {EventResponse} from "../services/responses/EventResponse";
import {Privacy} from "../services/responses/Privacy";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent {
  public event: EventResponse[] = [];
  public privaces: Privacy[] = [];
  public search: FormGroup = {} as FormGroup;
  public searchPath: string = "";
  constructor(public router: Router, public dialog: MatDialog, private eventService: EventService, private userServies: UserService) {
    let jwt: string | null = localStorage.getItem('jwt')
    if(jwt == null){
      router.navigate(["/login"])
    }else {
      userServies.GetCurrent().subscribe(value => {}, error => {
        router.navigate(["/account"])
      })
      eventService.token = jwt
      eventService.GetAll(false, null, null).subscribe(value => {
        this.event = value.filter(v => v.privacy != Privacy.PRIVATE)
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
      false,
      null,
      types
    ).subscribe(value => {
      this.event = value.filter(v => v.privacy != Privacy.PRIVATE)
      this.event.forEach((value) => {
        value.start.date = new Date(value.start.year, value.start.month, value.start.day, value.start.hour, value.start.minute).toLocaleString()
        value.end.date = new Date(value.start.year, value.start.month, value.start.day, value.start.hour, value.start.minute).toLocaleString()
      })
      this.event.sort((e1, e2) => e1.id - e2.id)
      let pattern: RegExp = new RegExp(this.searchPath)
      this.event = this.event.filter((value) => pattern.test(value.title.toString()) && value.privacy != Privacy.PRIVATE)
    })
  }
  public eventSearch(){
    this.searchPath = this.search.value["searchField"]
    this.EventsReload()
  }
}
