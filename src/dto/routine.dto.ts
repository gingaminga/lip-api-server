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
