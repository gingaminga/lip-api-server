import Todo from "@/databases/rdb/entities/todo.entity";
import BaseRepository from "@/databases/rdb/repositories/base.repository";
import { Service } from "typedi";

@Service()
export default class TodoRepository extends BaseRepository<Todo> {
  constructor() {
    super();
    this.setTarget(Todo);
  }

  get queryBuilder() {
    return this.getQueryBuilder("todo");
  }
}
