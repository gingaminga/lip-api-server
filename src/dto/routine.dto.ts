export class GetAllRoutineRequestParamDTO {
  limit: number;

  id: number;

  constructor(id: number, limit = 30) {
    this.limit = limit;
    this.id = id;
  }
}
