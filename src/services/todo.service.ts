import TodoRepository from "@/databases/rdb/repositories/todo.repository";
import { getFirstAndLastDay } from "@/utils/date";
import { Inject, Service } from "typedi";

@Service()
export default class ToDoService {
  constructor(@Inject() private todoRepository: TodoRepository) {
    /* empty */
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
}
