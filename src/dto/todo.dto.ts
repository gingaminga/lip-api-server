export class AddToDoRequestParamDTO {
  content: string;

  date: string;

  constructor(content: string, date: string) {
    this.content = content;
    this.date = date;
  }
}

export class GetToDoRequestParamDTO {
  date: string;

  constructor(date: string) {
    this.date = date;
  }
}

export class RemoveToDoRequestParamDTO {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
