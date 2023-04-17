import Alarm from "@/databases/rdb/entities/alarm.entity";
import BaseRepository from "@/databases/rdb/repositories/base.repository";
import { Service } from "typedi";

@Service()
export default class AlarmRepository extends BaseRepository<Alarm> {
  constructor() {
    super();
    this.setTarget(Alarm);
  }

  get queryBuilder() {
    return this.getQueryBuilder("alarm");
  }
}
