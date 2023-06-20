import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ParticipantResponse} from "./responses/ParticipantResponse";

@Injectable({
  providedIn: 'root',
})
export class ParticipantService{
  public token: String = ""
  constructor(private http: HttpClient) {
  }
  public GetAll(eventId: number):Observable<ParticipantResponse[]>{
    return this.http.get<ParticipantResponse[]>(`/api/participant/event/${eventId}`, {headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public GetAllDeleted(eventId: number):Observable<ParticipantResponse[]>{
    return this.http.get<ParticipantResponse[]>(`/api/participant/event/deleted/${eventId}`, {headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public Add(eventId: number, type: String): Observable<{ text: String }>{
    return this.http.post<{ text: String }>("/api/participant", {
      eventId: eventId,
      type: type
    }, {headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public Edit(id: number, type: String): Observable<{ text: String }>{
    return this.http.put<{ text: String }>("/api/participant",{
      id: id,
      type: type
    },{headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public Delete(id: number): Observable<{ text: String }>{
      return this.http.delete<{ text: String }>(`/api/participant/${id}`,{headers:{
          "Authorization": `Bearer ${this.token}`
        }})
    }
  public Restore(id: number): Observable<{ text: String }>{
      return this.http.delete<{ text: String }>(`/api/participant/restore/${id}`,{headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
}
