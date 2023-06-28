import {Data} from "./Data";
import {DateTime} from "./DateTime";
import {UserResponse} from "./UserResponse";

export class NotificationResponse{
  id: number
  eventId: number
  title: String
  description: String
  sent: Data
  start: DateTime
  end: DateTime
  user: UserResponse

  constructor(id: number, eventId: number, title: String, description: String, sent: Data, start: DateTime, end: DateTime, user: UserResponse) {
    this.id = id;
    this.eventId = eventId;
    this.title = title;
    this.description = description;
    this.sent = sent;
    this.start = start;
    this.end = end;
    this.user = user;
  }

}
