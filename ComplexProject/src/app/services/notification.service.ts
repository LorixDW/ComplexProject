import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {NotificationResponse} from "./responses/NotificationResponse";

@Injectable({
  providedIn: 'root',
})
export class NotificationService{
  public token: String = ""
  constructor(private http: HttpClient) {
  }
  public GetAll(self: boolean, deleted: boolean | null, email: String | null, eventId: number | null): Observable<NotificationResponse[]>{
    let params: HttpParams = new HttpParams();
    params.set("self", self)
    if(deleted != null){
      params.set("deleted", deleted)
    }
    if(email != null){
      params.set("email", email)
    }
    if(eventId != null){
      params.set("eventId", eventId)
    }
    return this.http.get<NotificationResponse[]>("/api/notification", {headers:{
        "Authorization": `Bearer ${this.token}`
      }, params: params})
  }
  public Add(eventId: number, description: String, days: number):Observable<{ text: String }>{
    return this.http.post<{ text: String }>("/api/notification", {
      eventId: eventId,
      description: description,
      days: days
    },{headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public Edit(id: number, description: String, days: number):Observable<{ text: String }>{
    return this.http.put<{ text: String }>("/api/notification", {
      id: id,
      description: description,
      days: days
    },{headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public Delete(id: number): Observable<{ text: String }>{
    return this.http.delete<{ text: String }>(`/api/notification/${id}`,{headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public Restore(id: number): Observable<{ text: String }>{
    return this.http.delete<{ text: String }>(`/api/notification/restore/${id}`,{headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
}
