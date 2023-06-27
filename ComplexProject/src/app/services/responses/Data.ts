export class Data{
  year: number
  month: number
  day: number

  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
  }
  public toDate(): Date{
    return new Date(this.year, this.month - 1, this.day)
  }
}
