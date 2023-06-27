import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {EventResponse} from "../services/responses/EventResponse";
import {ParticipantService} from "../services/participant.service";
import {ApplicationService} from "../services/application.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserResponse} from "../services/responses/UserResponse";
import {ApplicationType} from "../services/responses/ApplicationType";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";

@Component({
  selector: 'app-add-participant',
  templateUrl: './add-participant.component.html',
  styleUrls: ['./add-participant.component.css']
})
export class AddParticipantComponent {
  public addForm: FormGroup = {} as FormGroup
  public searchForm: FormGroup = {} as FormGroup
  public user: UserResponse = {} as UserResponse
  public users: UserResponse[] = []
  public invitedUsers: String[] = []
  public applicatedUsers: String[] = []
  constructor(
    public dialogRef: MatDialogRef<AddParticipantComponent>,
    public dialog: MatDialog,
    private participantService: ParticipantService,
    private applicationService: ApplicationService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: AddParticipantData,
    private router: Router
  ) {
    let jwt: String | null = localStorage.getItem('jwt')
    if(jwt != null){
      userService.token = jwt
      participantService.token = jwt
      applicationService.token = jwt
      userService.GetCurrent().subscribe(value => {
          this.user = value
          this.usersUpdate()
        },
        error => {
          router.navigate(['/account'])
        })

    }
    else {
      router.navigate(['/login'])
      this.dialogRef.close()
    }
    this.addForm = new FormGroup({
      'text': new FormControl("", [Validators.required])
    })
    // this.addForm = new FormGroup({
    //   'text': new FormControl("", [])
    // })
  }
  usersUpdate(){
    this.userService.GetAll().subscribe(value => {
      // if(this.searchForm.value['text'] != ""){
      //   value.filter(value1 => this.patternCheck(value1))
      // }
      this.users = value.filter(v => v.email != this.user.email)
      this.users.forEach(value => {
        this.applicationService.GetAll(false, ApplicationType.INVITE, null, null, this.data.event.id, value.email.toString()).subscribe(value1 => {
          if(value1.length > 0){
            this.invitedUsers.push(value.email)
          }
        })
        this.applicationService.GetAll(true, ApplicationType.APPLICATION, null, null, this.data.event.id, value.email.toString()).subscribe(value1 => {
          if(value1.length > 0){
            this.applicatedUsers.push(value.email)
          }
        })
      })
    })
  }
  // patternCheck(user: UserResponse):boolean{
  //   let res: boolean = false;
  //   let search: string = this.searchForm.value['text']
  //   search.split(" ", 3).map((value) =>{
  //     return new RegExp(value)
  //   }).forEach((value) => {
  //     res = value.test(user.lName.toString()) || value.test(user.fName.toString()) || value.test(user.patronymic.toString())
  //   })
  //   return res
  // }
  submit(email: String | null){
    console.log({
      email: email,
      emailAlt: this.user.email,
      eventId: this.data.event.id,
      type: this.addForm.value['text'],
      eventType: this.data.event.privacy
    })
    if(!this.data.event.isSelf){
      if(this.data.event.privacy == 'OPEN'){
        this.participantService.Add(this.data.event.id, this.addForm.value['text']).subscribe(value => {this.dialogRef.close()},
          error => {
            this.dialog.open(AlertDialogComponent, {
              data: {title: "Ошибка", content: "Проверьте данные ввода"}
            })
          })
      }
      if(this.data.event.privacy == 'HALF_OPEN'){
        this.applicationService.Add(this.user.email, this.data.event.id, this.addForm.value['text'], ApplicationType.APPLICATION).subscribe(value => {this.dialogRef.close()},
          error => {
            this.dialog.open(AlertDialogComponent, {
              data: {title: "Ошибка", content: "Проверьте данные ввода"}
            })
          })
      }
    }
    else {
      if(this.data.event.privacy == 'HALF_OPEN' && email != null){
        this.applicationService.Add(email, this.data.event.id, this.addForm.value['text'], ApplicationType.INVITE).subscribe(value => {this.dialogRef.close()},
          error => {
            this.dialog.open(AlertDialogComponent, {
              data: {title: "Ошибка", content: "Проверьте данные ввода"}
            })
          })
      }
    }
  }
}

interface AddParticipantData{
  event: EventResponse
}
