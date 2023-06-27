export class DateTime{
  year: number
  month: number
  day: number
  hour: number
  minute: number
  date: String = ""
  constructor(year: number, month: number, day: number, hour: number, minute: number) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
  }
  toString():string{
    return `${this.year}.${this.month}.${this.day} ${this.hour}:${this.minute} `
  }
}
