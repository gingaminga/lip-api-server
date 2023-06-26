export class AddRoutineRequestParamDTO {
  alarm_hour: number;

  alarm_minute: number;

  color: string;

  content: string;

  days: string;

  constructor(content: string, days: string, hour: number, minute: number, color: string) {
    this.alarm_hour = hour;
    this.alarm_minute = minute;
    this.color = color;
    this.content = content;
    this.days = days;
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

export class ModifyRoutineRequestParamDTO {
  alarm_hour: number;

  alarm_minute: number;

  color: string;

  days: string;

  id: number;

  content: string;

  constructor(id: number, content: string, days: string, hour: number, minute: number, color: string) {
    this.alarm_hour = hour;
    this.alarm_minute = minute;
    this.color = color;
    this.content = content;
    this.days = days;
    this.id = id;
  }
}

export class RemoveRoutineRequestParamDTO {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
