import {DateTime} from "./DateTime";
import {Privacy} from "./Privacy";
import {UserResponse} from "./UserResponse";

export class EventResponse{
  constructor(id: number, title: String, summary: String, description: String, place: String, start: DateTime, end: DateTime, privacy: Privacy, creator: UserResponse, isSelf: boolean) {
    this.id = id;
    this.title = title;
    this.summary = summary;
    this.description = description;
    this.place = place;
    this.start = start;
    this.end = end;
    this.privacy = privacy;
    this.creator = creator;
    this.isSelf = isSelf;
  }
  id: number
  title: String
  summary: String
  description: String
  place: String
  start: DateTime
  end: DateTime
  privacy: Privacy
  creator: UserResponse
  isSelf: boolean
}
