export class AddRoutineRequestParamDTO {
  alarm_hour: number;

  alarm_minute: number;

  color: string;

  days: string;

  title: string;

  constructor(title: string, days: string, hour: number, minute: number, color: string) {
    this.alarm_hour = hour;
    this.alarm_minute = minute;
    this.color = color;
    this.days = days;
    this.title = title;
  }
}

export class GetAllRoutineRequestParamDTO {
  limit: number;

  id: number;

  constructor(id: number, limit = 30) {
    this.limit = limit;
    this.id = id;
  }
}

export class GetRoutineRequestParamDTO {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
