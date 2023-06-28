import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ParticipantService} from "../services/participant.service";
import {ApplicationService} from "../services/application.service";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {ParticipantResponse} from "../services/responses/ParticipantResponse";
import {UserResponse} from "../services/responses/UserResponse";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";

@Component({
  selector: 'app-participant-edit',
  templateUrl: './participant-edit.component.html',
  styleUrls: ['./participant-edit.component.css']
})
export class ParticipantEditComponent {
  private user: UserResponse = {} as UserResponse
  public editForm: FormGroup = {} as FormGroup
  constructor(
    public dialogRef: MatDialogRef<ParticipantEditComponent>,
    public dialog: MatDialog,
    private participantService: ParticipantService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: EditParticipantData,
    private router: Router
  ) {
    let jwt: String | null = localStorage.getItem('jwt')
    if(jwt != null){
      userService.token = jwt
      participantService.token = jwt
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
    this.editForm = new FormGroup({
      "type": new FormControl(data.participant.type.toString(), [Validators.required])
    })
  }
  submit(){
    this.participantService.Edit(this.data.participant.id, this.editForm.value['type']).subscribe(value => {this.dialogRef.close()}, error => {
      this.dialog.open(AlertDialogComponent, {
        data: {title: "Ошибка", content: "Проверьте данные ввода"}
      })
    })
  }
}
interface EditParticipantData{
  participant: ParticipantResponse
}
