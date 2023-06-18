import RoutineTodo from "@/databases/rdb/entities/routine-todo.entity";
import BaseRepository from "@/databases/rdb/repositories/base.repository";
import { Service } from "typedi";

@Service()
export default class RoutineTodoRepository extends BaseRepository<RoutineTodo> {
  constructor() {
    super();
    this.setTarget(RoutineTodo);
  }

  get queryBuilder() {
    return this.getQueryBuilder("routineTodo");
  }
}
