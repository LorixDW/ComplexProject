import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApplicationType} from "./responses/ApplicationType";
import {ApplicationResponse} from "./responses/ApplicationResponse";
import {EventResponse} from "./responses/EventResponse";

@Injectable({
  providedIn: 'root',
})
export class ApplicationService{
  public token: String = ""
  constructor(private http: HttpClient) {
  }
  public GetAll(self: boolean, type: ApplicationType, accepted: boolean | null, deleted: boolean | null, eventId: number | null, email: string | null):Observable<ApplicationResponse[]>{
    let params: HttpParams = new HttpParams();
    params = params.set("self", self)
    params = params.set("type", type)
    if(accepted != null) {
      params = params.set("accepted", accepted)
    }
    if(deleted != null) {
      params = params.set("deleted", deleted)
    }
    if(eventId != null) {
      params = params.set("eventId", eventId)
    }
    if(email != null) {
      params = params.set("email", email)
    }
    return this.http.get<ApplicationResponse[]>("/api/application/all", {headers:{
        "Authorization": `Bearer ${this.token}`
      }, params: params})
  }
  public Add(email: String, eventId: number, message: String, type: ApplicationType): Observable<{ text: String }>{
    return this.http.post<{ text: String }>("/api/application", {
      email: email,
      eventId: eventId,
      message: message,
      type: type
    }, {headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public Accept(id: number, type: string): Observable<{ text: String }>{
    let params: HttpParams = new HttpParams()
    params = params.set("participantType", type)
    return this.http.put<{ text: String }>(`/api/application/${id}`, {}, {headers:{
        "Authorization": `Bearer ${this.token}`
      }, params: params})
  }
  public Delete(id: number): Observable<{ text: String }>{
    return this.http.delete<{ text: String }>(`/api/application/${id}`,{headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public Restore(id: number): Observable<{ text: String }>{
    return this.http.delete<{ text: String }>(`/api/application/restore/${id}`,{headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
}
