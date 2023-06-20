import { dataSource } from "@/databases/rdb/client";
import Todo from "@/databases/rdb/entities/todo.entity";
import User from "@/databases/rdb/entities/user.entity";

const alias = "todo";

export const TodoRepository = dataSource.getRepository(Todo).extend({
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

    const todoInfo = await this.save(todo);

    return todoInfo;
  },
  /**
   * @description 해당 날짜의 todo 정보 찾기
   * @param date 날짜
   * @param userID 유저 id
   * @returns ToDo[]
   */
  async findToDosByDate(date: string, userID: number) {
    const todos = await this.createQueryBuilder(alias)
      .where("todo.date = :date", {
        date,
      })
      .andWhere("todo.user_id = :userID", {
        userID,
      })
      .getMany();

    return todos;
  },
  /**
   * @description 기간별 todo 정보 찾기
   * @param startDate 날짜
   * @param endDate 날짜
   * @param userID 유저 id
   * @returns ToDo[]
   */
  async findToDosByMonth(startDate: string, endDate: string, userID: number) {
    const todos = await this.createQueryBuilder(alias)
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
  },
  /**
   * @description todo 완료 유무 선택하기
   * @param todoID 할 일 id
   * @param checked 할 일 완료 유무
   * @param userID 유저 id
   * @returns true (수정) / false (수정 실패)
   */
  async modifyCheckToDo(todoID: number, checked: boolean, userID: number) {
    const result = await this.createQueryBuilder(alias)
      .update()
      .set({
        checked,
      })
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
  },
  /**
   * @description todo 완료 유무 선택하기
   * @param todoID 할 일 id
   * @param checked 할 일 내용
   * @param userID 유저 id
   * @returns true (수정) / false (수정 실패)
   */
  async modifyContentToDo(todoID: number, content: string, userID: number) {
    const result = await this.createQueryBuilder(alias)
      .update()
      .set({
        content,
      })
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
  },
  /**
   * @description todo 삭제하기
   * @param todoID 할 일 id
   * @param userID 유저 id
   * @returns true (삭제) / false (삭제 실패)
   */
  async removeToDo(todoID: number, userID: number) {
    const result = await this.createQueryBuilder(alias)
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
  },
  /**
   * @description todo 전체 삭제하기
   * @param id 유저 id
   * @returns true (삭제) / false (삭제 실패)
   */
  async removeAllToDo(id: number) {
    const result = await this.createQueryBuilder(alias)
      .delete()
      .where("todo.user_id = :userID", {
        userID: id,
      })
      .execute();

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
});
