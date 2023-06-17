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

export class ModifyCheckToDoRequestParamDTO {
  checked: boolean;

  id: number;

  constructor(id: number, checked: number) {
    this.checked = checked === 1;
    this.id = id;
  }
}

export class ModifyContentToDoRequestParamDTO {
  content: string;

  id: number;

  constructor(id: number, content: string) {
    this.content = content;
    this.id = id;
  }
}

export class RemoveToDoRequestParamDTO {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
