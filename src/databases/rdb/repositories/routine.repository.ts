import Routine from "@/databases/rdb/entities/routine.entity";
import BaseRepository from "@/databases/rdb/repositories/base.repository";
import { Service } from "typedi";

@Service()
export default class RoutineRepository extends BaseRepository<Routine> {
  constructor() {
    super();
    this.setTarget(Routine);
  }

  get queryBuilder() {
    return this.getQueryBuilder("routine");
  }
}
