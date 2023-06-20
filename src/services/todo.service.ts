import User from "@/databases/rdb/entities/user.entity";
import { TodoRepository } from "@/databases/rdb/repositories/todo.repository";
import { getFirstAndLastDay } from "@/utils/date";
import { Service } from "typedi";

@Service()
export default class ToDoService {
  private todoRepository = TodoRepository;

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
   * @description 투두 완료 유무 선택하기
   * @param todoID 투두 id
   * @param checked 할 일 완료 유무
   * @param userID 유저 id
   * @returns true (수정) / false (수정 실패)
   */
  async modifyCheckToDo(todoID: number, checked: boolean, userID: number) {
    const isSuccess = await this.todoRepository.modifyCheckToDo(todoID, checked, userID);

    return isSuccess;
  }

  /**
   * @description 투두 완료 유무 선택하기
   * @param todoID 투두 id
   * @param content 할 일 내용
   * @param userID 유저 id
   * @returns true (수정) / false (수정 실패)
   */
  async modifyContentToDo(todoID: number, content: string, userID: number) {
    const isSuccess = await this.todoRepository.modifyContentToDo(todoID, content, userID);

    return isSuccess;
  }

  /**
   * @description 투두 삭제하기
   * @param todoID todo id
   * @param userID user id
   * @returns true (삭제) / false (삭제 실패)
   */
  async removeToDo(todoID: number, userID: number) {
    const isSuccess = await this.todoRepository.removeToDo(todoID, userID);

    return isSuccess;
  }

  /**
   * @description 투두 전체 삭제하기
   * @param id user id
   * @returns true (삭제) / false (삭제 실패)
   */
  async removeAllToDo(id: number) {
    const isSuccess = await this.todoRepository.removeAllToDo(id);

    return isSuccess;
  }
}
