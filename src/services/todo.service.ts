import { dataSource } from "@/databases/rdb/client";
import Routine from "@/databases/rdb/entities/routine.entity";
import User from "@/databases/rdb/entities/user.entity";
import { AlarmRepository } from "@/databases/rdb/repositories/alarm.repository";
import { RoutineRepository } from "@/databases/rdb/repositories/routine.repository";
import { TodoRepository } from "@/databases/rdb/repositories/todo.repository";
import { getDayfromDate, getFirstAndLastDay } from "@/utils/date";
import { Service } from "typedi";

@Service()
export default class ToDoService {
  private alarmRepository = AlarmRepository;

  private todoRepository = TodoRepository;

  private routineRepository = RoutineRepository;

  /**
   * @description 투두 추가하기
   * @param content 할 일 내용
   * @param date 날짜
   * @param user 유저
   * @returns ToDo
   */
  async addToDo(content: string, date: string, user: User) {
    const { user: userInfo, ...rest } = await this.todoRepository.addToDo(content, date, user);

    return rest;
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
      const todos = await this.todoRepository.findToDosByMonth(startDate, endDate, userID, {
        alarm: true,
      });

      return [todos];
    }

    const todos = await this.todoRepository.findToDosByDate(date, userID, {
      alarm: true,
    });

    const day = String(getDayfromDate(date));
    const routines = await this.routineRepository.findRoutineToDoByDate(date, day, userID);
    const fakeRoutines = ToDoService.makeFakeRoutineToDo(routines, date);

    return [todos, fakeRoutines];
  }

  /**
   * @description 루틴은 있지만 todo가 비어있는 경우 임시 값 넣어주기
   * @param routines 루틴 + 저장되어있는 루틴 할 일
   * @param date 날짜
   * @returns 루틴 + 가짜 루틴 할 일
   */
  static makeFakeRoutineToDo(routines: Routine[], date: string) {
    let i = 0;

    const fakeRoutines = routines.map((routine) => {
      if (!routine.routineTodo) {
        i -= 1;
        return {
          ...routine,
          routineTodo: {
            checked: false,
            createdAt: routine.createdAt,
            date,
            id: i,
            updatedAt: routine.updatedAt,
          },
        };
      }

      return routine;
    });

    return fakeRoutines;
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
   * @description 할 일의 알람 삭제하기
   * @param todoID todo id
   * @param userID user id
   * @returns true (삭제) / false (삭제 실패)
   */
  async removeAlarm(todoID: number, userID: number) {
    const isSuccess = await this.todoRepository.modifyAlarmReset(todoID, userID);

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

  /**
   * @description 알람 설정하기
   * @param todoID 투두 id
   * @param checked 할 일 완료 유무
   * @param userID 유저 id
   * @returns true (수정) / false (수정 실패)
   */
  async setAlarm(todoID: number, alarmHour: number, alarmMinute: number, userID: number) {
    return dataSource.transaction(async (manager) => {
      const alarmRepository = manager.withRepository(this.alarmRepository);
      const todoRepository = manager.withRepository(this.todoRepository);

      let alarm = await alarmRepository.findAlarm(alarmHour, alarmMinute);

      if (!alarm) {
        // 알람 정보가 없는 경우 추가
        alarm = await alarmRepository.addAlarm(alarmHour, alarmMinute);
      }

      const isSuccessModifyAlarm = await todoRepository.modifyAlarm(alarm.id, todoID, userID);

      return isSuccessModifyAlarm;
    });
  }
}
