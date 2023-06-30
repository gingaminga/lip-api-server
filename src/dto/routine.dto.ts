export class AddRoutineRequestParamDTO {
  alarmHour: number;

  alarmMinute: number;

  color: string;

  content: string;

  days: string;

  constructor(content: string, days: string, hour: number, minute: number, color: string) {
    this.alarmHour = hour;
    this.alarmMinute = minute;
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

export class ModifyCheckRoutineToDoRequestParamDTO {
  checked: boolean;

  date: string;

  id: number;

  constructor(id: number, date: string, checked: boolean) {
    this.checked = checked;
    this.date = date;
    this.id = id;
  }
}

export class ModifyRoutineRequestParamDTO {
  alarmHour: number;

  alarmMinute: number;

  color: string;

  days: string;

  id: number;

  content: string;

  constructor(id: number, content: string, days: string, hour: number, minute: number, color: string) {
    this.alarmHour = hour;
    this.alarmMinute = minute;
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
