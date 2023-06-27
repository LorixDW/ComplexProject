import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Privacy} from "./responses/Privacy";
import {EventResponse} from "./responses/EventResponse";
import {DateTime} from "./responses/DateTime";

@Injectable({
  providedIn: 'root',
})
export class EventService{
  constructor(private http: HttpClient) {
  }
  public token: String = ""
  public GetAll(self: boolean, deleted: boolean | null, privacies: Privacy[] | null):Observable<EventResponse[]>{
    let params: HttpParams = new HttpParams();
    params = params.append("self", self)
    if(deleted != null){
      params = params.append("deleted", deleted);
    }
    if(privacies != null){
      params = params.append("types", privacies.join(", "))
    }
    console.log(params.get("self"))
    return this.http.get<EventResponse[]>("/api/event/all", {headers:{
        "Authorization": `Bearer ${this.token}`
      }, params: params})
  }
  public GetById(id: number):Observable<EventResponse>{
    return this.http.get<EventResponse>(`/api/event/${id}`, {headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public Add(title: String, summary: String, description: String, place: String, start: DateTime, end: DateTime, privacy: Privacy): Observable<{ text: String }>{
    return this.http.post<{ text: String }>("/api/event", {
      title: title,
      summary: summary,
      description: description,
      place: place,
      start: start,
      end: end,
      privacy: privacy
    }, {headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public Edit(id: number, title: String, summary: String, description: String, place: String, start: DateTime, end: DateTime): Observable<{ text: String }>{
    return this.http.put<{ text: String }>("/api/event", {
      id: id,
      title: title,
      summary: summary,
      description: description,
      place: place,
      start: start,
      end: end
    }, {headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public Delete(id: number): Observable<{ text: String }>{
    return this.http.delete<{ text: String }>(`/api/event/${id}`,{headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
  public Restore(id: number): Observable<{ text: String }>{
    return this.http.delete<{ text: String }>(`/api/event/restore/${id}`,{headers:{
        "Authorization": `Bearer ${this.token}`
      }})
  }
}
