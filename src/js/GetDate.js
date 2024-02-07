export default class GetDate {
  static getFormatDate() {
    const date = new Date();

    const dd = GetDate.getDay(date);
    const mm = GetDate.getMonth(date);
    const yy = GetDate.getYear(date);
    const fullDate = `${dd}.${mm}.${yy}`;

    const time = date.toTimeString().slice(0, 5);

    const result = `${fullDate} ${time}`;

    return result;
  }

  static getDay(date) {
    let dd = date.getDate();
    if (dd.length === 1) dd = `0${dd}`;
    return dd;
  }

  static getMonth(date) {
    let mm = date.getMonth() + 1;
    if (mm.length === 1) mm = `0${mm}`;
    return mm;
  }

  static getYear(date) {
    const result = `${date.getUTCFullYear()}`.slice(2, 4);

    return result;
  }
}
