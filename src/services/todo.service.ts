import User from "@/databases/rdb/entities/user.entity";
import TodoRepository from "@/databases/rdb/repositories/todo.repository";
import { getFirstAndLastDay } from "@/utils/date";
import { Inject, Service } from "typedi";

@Service()
export default class ToDoService {
  constructor(@Inject() private todoRepository: TodoRepository) {
    /* empty */
  }

  /**
   * @description 투두 추가하기
   * @param content 할 일 내용
   * @param date 날짜
   * @param user 유저
   * @returns ToDo
   */
  async addToDo(content: string, date: string, user: User) {
    const todo = await this.todoRepository.addToDo(content, date, user);

    return todo;
  }

  /**
   * @description 투두 가져오기
   * @param date 날짜
   * @param userID 유저 id
   * @returns
   */
  async getToDos(date: string, userID: number) {
    if (date.length === 6) {
      // 월별
      const { final, first } = getFirstAndLastDay(date, "0");
      const startDate = `${date}${first}`;
      const endDate = `${date}${final}`;
      const todos = await this.todoRepository.findToDosByMonth(startDate, endDate, userID);

      return todos;
    }

    const todos = await this.todoRepository.findToDosByDate(date, userID);

    return todos;
  }

  /**
   * @description 투두 삭제하기
   * @param todoID todo id
   * @param todoID user id
   * @returns true (삭제) / false (삭제 실패)
   */
  async removeToDo(todoID: number, userID: number) {
    const isSuccess = await this.todoRepository.removeToDo(todoID, userID);

    return isSuccess;
  }
}
