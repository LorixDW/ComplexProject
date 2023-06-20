import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthService{
  constructor(private http: HttpClient) {
  }
  public FirstLogin(email: String, password: String):Observable<{ text: String }>{
    return this.http.post<{ text: String }>("http://localhost:8080/auth/login/first", {email: email, password: password})
  }
  public SecondLogin(code: String, email: String):Observable<{ jwtToken: String }>{
    return this.http.post<{ jwtToken: String }>("http://localhost:8080/auth/login/second", {email: email, code: code})
  }
  public Register(lName: String, fName: String, patronymic: String, phone: String, email: String, password: String): Observable<{ text: String }>{
    return this.http.post<{ text: String }>("http://localhost:8080/auth/register", {
      lName: lName,
      fName: fName,
      patronymic: patronymic,
      phone: phone,
      email: email,
      password: password,
      roleId: 1
    })
  }
}

