export class GetAllRoutineRequestParamDTO {
  lastID: number;

  limit: number;

  constructor(lastID: number, limit = 30) {
    this.lastID = lastID;
    this.limit = limit;
  }
}
