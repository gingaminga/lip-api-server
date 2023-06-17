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

  /**
   * @description 해당 날짜의 todo 정보 찾기
   * @param date 날짜
   * @param userID 유저 id
   * @returns ToDo[]
   */
  async findToDosByDate(date: string, userID: number) {
    const todos = await this.queryBuilder
      .where("todo.date = :date", {
        date,
      })
      .andWhere("todo.user_id = :userID", {
        userID,
      })
      .getMany();

    return todos;
  }

  /**
   * @description 기간별 todo 정보 찾기
   * @param startDate 날짜
   * @param endDate 날짜
   * @param userID 유저 id
   * @returns ToDo[]
   */
  async findToDosByMonth(startDate: string, endDate: string, userID: number) {
    const todos = await this.queryBuilder
      .where("todo.user_id = :userID", {
        userID,
      })
      .andWhere("todo.date >= :startDate", {
        startDate,
      })
      .andWhere("todo.date <= :endDate", {
        endDate,
      })
      .getMany();

    return todos;
  }
}
