import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserResponse} from "./responses/UserResponse";

@Injectable({
  providedIn: 'root',
})
export class UserService{
  public token: String = ""
  constructor(private http: HttpClient) {
  }
  public GetCurrent():Observable<UserResponse>{
    return this.http.get<UserResponse>("/api/user", {headers:{
      "Authorization": `Bearer ${this.token}`
      }})
  }
  public GetAll():Observable<UserResponse[]>{
    return this.http.get<UserResponse[]>("/api/user/all", {headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public SimpleUpdate(lName: String, fName: String, patronymic: String):Observable<{ text: String }>{
    return this.http.put<{ text: String }>("/api/user/update/fio", {
      lName: lName,
      fName: fName,
      patronymic: patronymic
    },{headers:{
      "Authorization": `Bearer ${this.token}`
    }});
  }
  public AdminUpdate(lName: String, fName: String, patronymic: String, phone: String, oldEmail:String, email: String):Observable<{ text: String }>{
    return this.http.put<{ text: String }>("/api/user/update/all", {
      oldEmail: oldEmail,
      lName: lName,
      fName: fName,
      patronymic: patronymic,
      email: email,
      phone: phone
    },{headers:{
      "Authorization": `Bearer ${this.token}`
    }})
  }
}
