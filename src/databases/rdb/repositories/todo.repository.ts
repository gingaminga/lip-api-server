import Todo from "@/databases/rdb/entities/todo.entity";
import User from "@/databases/rdb/entities/user.entity";
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
   * @description todo 추가하기
   * @param content 할 일 내용
   * @param date 날짜
   * @param user 유저 정보
   * @returns ToDo
   */
  async addToDo(content: string, date: string, user: User) {
    const todo = new Todo();
    todo.content = content;
    todo.checked = false; // 최초 생성 시에는 무조건 check 비활성화
    todo.user = user;
    todo.date = date;

    const todoInfo = await this.getRepository().save(todo);

    return todoInfo;
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

  /**
   * @description todo 삭제하기
   * @param todoID 할 일 id
   * @param userID 유저 id
   * @returns true (삭제) / false (삭제 실패)
   */
  async removeToDo(todoID: number, userID: number) {
    const result = await this.queryBuilder
      .delete()
      .where("todo.id = :todoID", {
        todoID,
      })
      .andWhere("todo.user_id = :userID", {
        userID,
      })
      .execute();

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  }
}
