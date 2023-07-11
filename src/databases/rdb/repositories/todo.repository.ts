import { dataSource } from "@/databases/rdb/client";
import FcmToken from "@/databases/rdb/entities/fcm-token.entity";
import Todo from "@/databases/rdb/entities/todo.entity";
import User from "@/databases/rdb/entities/user.entity";
import { INotificationItem } from "@/types/notification";
import { Between, FindOptionsRelations } from "typeorm";

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
    todo.date = date;
    todo.user = user;

    const todoInfo = await this.save(todo);

    return todoInfo;
  },
  /**
   * @description 해당 날짜의 todo 정보 찾기
   * @param date 날짜
   * @param userID 유저 id
   * @param relations 관계형 옵션
   * @returns ToDo[]
   */
  async findToDosByDate(date: string, userID: number, relations?: FindOptionsRelations<Todo>) {
    const todos = await this.find({
      relations,
      where: {
        date,
        user: {
          id: userID,
        },
      },
    });

    return todos;
  },
  /**
   * @description 기간별 todo 정보 찾기
   * @param startDate 날짜
   * @param endDate 날짜
   * @param userID 유저 id
   * @param relations 관계형 옵션
   * @returns ToDo[]
   */
  async findToDosByMonth(startDate: string, endDate: string, userID: number, relations?: FindOptionsRelations<Todo>) {
    const todos = await this.find({
      relations,
      where: {
        date: Between(startDate, endDate),
        user: {
          id: userID,
        },
      },
    });

    return todos;
  },
  /**
   * @description content, token 정보 가져오기
   * @param date 날짜
   * @param alarmID 알람 id
   * @returns INotificationItem[]
   */
  async findContentAndDeviceToKen(date: string, alarmID: number) {
    const notifications = await this.createQueryBuilder(alias)
      .leftJoinAndSelect(FcmToken, "fcmToken", `${alias}.user = fcmToken.user_id`)
      .select([`${alias}.id as id`, `${alias}.content as content`, "fcmToken.device_token"])
      .where(`${alias}.date = :date`, {
        date,
      })
      .andWhere(`${alias}.alarm_id = :alarmID`, {
        alarmID,
      })
      .getRawMany<INotificationItem>();

    return notifications;
  },
  /**
   * @description 알람 설정하기
   * @param alarmID 알람 id
   * @param todoID 할 일 id
   * @param userID 유저 id
   * @returns true (수정) / false (수정 실패)
   */
  async modifyAlarm(alarmID: number, todoID: number, userID: number) {
    const result = await this.update(
      {
        id: todoID,
        user: {
          id: userID,
        },
      },
      {
        alarm: {
          id: alarmID,
        },
      },
    );

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
  /**
   * @description 할 일의 알람 초기화(null)하기
   * @param todoID 할 일 id
   * @param userID 유저 id
   * @returns true (삭제) / false (삭제 실패)
   */
  async modifyAlarmReset(todoID: number, userID: number) {
    const result = await this.update(
      {
        id: todoID,
        user: {
          id: userID,
        },
      },
      {
        alarm: null,
      },
    );

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
  /**
   * @description todo 완료 유무 선택하기
   * @param todoID 할 일 id
   * @param checked 할 일 완료 유무
   * @param userID 유저 id
   * @returns true (수정) / false (수정 실패)
   */
  async modifyCheckToDo(todoID: number, checked: boolean, userID: number) {
    const result = await this.update(
      {
        id: todoID,
        user: {
          id: userID,
        },
      },
      {
        checked,
      },
    );

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
    const result = await this.update(
      {
        id: todoID,
        user: {
          id: userID,
        },
      },
      {
        content,
      },
    );

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
    const result = await this.delete({
      id: todoID,
      user: {
        id: userID,
      },
    });

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
    const result = await this.delete({
      user: {
        id,
      },
    });

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
});
