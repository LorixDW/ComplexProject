export class UserResponse{
  lName: String
  fName: String
  patronymic: String
  email: String
  phone: String
  role: String

  constructor(lName: String, fName: String, patronymic: String, email: String, phone: String, role: String) {
    this.lName = lName;
    this.fName = fName;
    this.patronymic = patronymic;
    this.email = email;
    this.phone = phone;
    this.role = role;
  }
}
