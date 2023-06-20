export class ParticipantResponse{
  id: number
  type: String
  eventId: number
  lName: String
  fName: String
  patronymic: String
  email: String
  phone: String

  constructor(id: number, type: String, eventId: number, lName: String, fName: String, patronymic: String, email: String, phone: String) {
    this.id = id;
    this.type = type;
    this.eventId = eventId;
    this.lName = lName;
    this.fName = fName;
    this.patronymic = patronymic;
    this.email = email;
    this.phone = phone;
  }
}
