import {UserResponse} from "./UserResponse";
import {ApplicationType} from "./ApplicationType";

export class ApplicationResponse {
  id: number
  eventId: number
  title: String
  user: UserResponse
  message: String
  type: ApplicationType

  constructor(id: number, eventId: number, title: String, user: UserResponse, message: String, type: ApplicationType) {
    this.id = id;
    this.eventId = eventId;
    this.title = title;
    this.user = user;
    this.message = message;
    this.type = type;
  }
}
