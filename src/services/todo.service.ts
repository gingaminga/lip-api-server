import { dataSource } from "@/databases/rdb/client";
import RoutineTodo from "@/databases/rdb/entities/routine-todo.entity";
import Routine from "@/databases/rdb/entities/routine.entity";
import User from "@/databases/rdb/entities/user.entity";
import { AlarmRepository } from "@/databases/rdb/repositories/alarm.repository";
import { RoutineRepository } from "@/databases/rdb/repositories/routine.repository";
import { RoutineToDoRepository } from "@/databases/rdb/repositories/routine-todo.repository";
import { TodoRepository } from "@/databases/rdb/repositories/todo.repository";
import { getDayInfo, getFirstAndLastDay } from "@/utils/date";
import { Service } from "typedi";

@Service()
export default class ToDoService {
  private alarmRepository = AlarmRepository;

  private todoRepository = TodoRepository;

  private routineRepository = RoutineRepository;

  private routineToDoRepository = RoutineToDoRepository;

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

      const routines = await this.routineRepository.findAllRoutineOfUser(userID, {
        alarm: true,
      });
      const routineToDos = await this.routineToDoRepository.findRoutineToDoByMonth(startDate, endDate, userID, {
        routine: true,
      });

      const fakeRoutines = ToDoService.makeFakeRoutineToDoByMonth(routines, routineToDos, startDate, endDate);

      return [todos, fakeRoutines];
    }

    const todos = await this.todoRepository.findToDosByDate(date, userID, {
      alarm: true,
    });

    const { textOfDay } = getDayInfo(date);
    const routines = await this.routineRepository.findRoutineByDay(textOfDay, userID, {
      alarm: true,
    });
    const routineToDos = await this.routineToDoRepository.findRoutineToDoByDate(date, userID, {
      routine: true,
    });
    const fakeRoutines = ToDoService.makeFakeRoutineToDo(routines, routineToDos, date);

    return [todos, fakeRoutines];
  }

  /**
   * @description 루틴 할 일 만들기
   * @param routines 루틴들
   * @param routineToDos 루틴 할 일들
   * @param date 날짜
   * @returns 루틴 할 일 + 가짜 루틴 할 일
   */
  static makeFakeRoutineToDo(routines: Routine[], routineToDos: RoutineTodo[], date: string) {
    let i = 0;

    const fakeRoutines = routines
      .map((routine) => {
        const [routineToDo] = routineToDos.filter((todo) => todo.routine.id === routine.id && todo.date === date);

        if (routineToDo) {
          return {
            id: routineToDo.id,
            routineID: routine.id,
            content: routine.content,
            checked: routineToDo.checked,
            date: routineToDo.date,
            createdAt: routineToDo.createdAt,
            updatedAt: routineToDo.updatedAt,
            deletedAt: undefined,
            alarm: routine.alarm,
          };
        }

        i -= 1;

        return {
          id: i,
          routineID: routine.id,
          content: routine.content,
          checked: false,
          date,
          createdAt: routine.createdAt,
          updatedAt: routine.updatedAt,
          deletedAt: routine.deletedAt,
          alarm: routine.alarm,
        };
      })
      .filter((fakeRoutineToDo) => !fakeRoutineToDo.deletedAt);

    return fakeRoutines;
  }

  /**
   * @description 정해진 기간의 루틴 할 일 만들기
   * @param routines 루틴들
   * @param routineToDos 루틴 할 일들
   * @param startDate 시작 날짜
   * @param endDate 끝 날짜
   * @returns 루틴 할 일 + 가짜 루틴 할 일
   */
  static makeFakeRoutineToDoByMonth(
    routines: Routine[],
    routineToDos: RoutineTodo[],
    startDate: string,
    endDate: string,
  ) {
    const fakeRoutineToDos = [];
    let date = startDate;

    const count = Number(endDate) - Number(startDate);

    for (let i = 0; i <= count; i++) {
      const { textOfDay } = getDayInfo(date);

      const routinesOfDay = routines.filter((routine) => routine[textOfDay]);
      fakeRoutineToDos.push(...ToDoService.makeFakeRoutineToDo(routinesOfDay, routineToDos, date));

      date = String(Number(date) + 1);
    }

    return fakeRoutineToDos;
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
