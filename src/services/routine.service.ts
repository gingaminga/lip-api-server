import { dataSource } from "@/databases/rdb/client";
import Routine from "@/databases/rdb/entities/routine.entity";
import User from "@/databases/rdb/entities/user.entity";
import { AlarmRepository } from "@/databases/rdb/repositories/alarm.repository";
import { RoutineToDoRepository } from "@/databases/rdb/repositories/routine-todo.repository";
import { RoutineRepository } from "@/databases/rdb/repositories/routine.repository";
import CError from "@/utils/error";
import { Service } from "typedi";

@Service()
export default class RoutineService {
  alarmRepository = AlarmRepository;

  routineRepository = RoutineRepository;

  routineToDoRepository = RoutineToDoRepository;

  /**
   * @description 루틴 등록하기
   * @param content 내용
   * @param days 요일
   * @param themeColor 테마 색상
   * @param alarmHour 알람 시
   * @param alarmMinute 알람 분
   * @param userID 유저 id
   * @returns Routine
   */
  async registerRoutine(
    content: string,
    days: string,
    themeColor: string,
    alarmHour: number,
    alarmMinute: number,
    user: User,
  ) {
    return dataSource.transaction(async (manager) => {
      const alarmRepository = manager.withRepository(this.alarmRepository);
      const routineRepository = manager.withRepository(this.routineRepository);

      let alarm = await alarmRepository.findAlarm(alarmHour, alarmMinute);

      if (!alarm) {
        // 알람 정보가 없는 경우 추가
        alarm = await alarmRepository.addAlarm(alarmHour, alarmMinute);
      }

      const { user: userInfo, ...rest } = await routineRepository.addRoutine(content, days, themeColor, alarm, user);

      return rest;
    });
  }

  /**
   * @description 루틴 할 일 완료 유무 선택하기
   * @param routineID 루틴 id
   * @param date 날짜
   * @param checked 할 일 완료 유무
   * @param user 유저
   * @returns true (수정) / false (수정 실패)
   */
  async modifyCheckRoutineToDo(routineID: number, date: string, checked: boolean, user: User) {
    const routineToDo = await this.routineToDoRepository.findRoutineToDoByRoutineIDAndDate(routineID, date, user.id);

    if (!routineToDo) {
      // 없으면 추가
      const routine = await this.routineRepository.findRoutine(routineID, user.id);

      if (!routine) {
        throw new CError("Not exist routine.. :(");
      }

      await this.routineToDoRepository.addRoutineToDo(checked, date, routine, user);

      return true;
    }

    const isSuccess = await this.routineToDoRepository.modifyCheckRoutineToDo(routineToDo.id, checked, user.id);

    return isSuccess;
  }

  /**
   * @description 루틴 수정하기
   * @param routineID 루틴 id
   * @param content 내용
   * @param days 요일
   * @param themeColor 테마 색상
   * @param alarmHour 알람 시
   * @param alarmMinute 알람 분
   * @param userID 유저 id
   * @returns Routine
   */
  async modifyRoutine(
    routineID: number,
    content: string,
    days: string,
    themeColor: string,
    alarmHour: number,
    alarmMinute: number,
    userID: number,
  ) {
    return dataSource.transaction(async (manager) => {
      const alarmRepository = manager.withRepository(this.alarmRepository);
      const routineRepository = manager.withRepository(this.routineRepository);

      let alarm = await alarmRepository.findAlarm(alarmHour, alarmMinute);

      if (!alarm) {
        // 알람 정보가 없는 경우 추가
        alarm = await alarmRepository.addAlarm(alarmHour, alarmMinute);
      }

      const isSuccessModifyRoutine = await routineRepository.modifyRoutine(
        routineID,
        content,
        days,
        themeColor,
        alarm.id,
        userID,
      );

      return isSuccessModifyRoutine;
    });
  }

  /**
   * @description 전체 루틴 삭제하기
   * @param userID 유저 id
   * @returns Routine
   */
  async removeAllRoutine(userID: number) {
    const isSuccess = await this.routineRepository.removeAllRoutine(userID);

    return isSuccess;
  }

  /**
   * @description 루틴 삭제하기
   * @param routineID 루틴 id내용
   * @param userID 유저 id
   * @returns Routine
   */
  async removeRoutine(routineID: number, userID: number) {
    const isSuccess = await this.routineRepository.removeRoutine(routineID, userID);

    return isSuccess;
  }

  /**
   * @description 전체 루틴 가져오기
   * @param lastRoutineID 마지막 ID
   * @param count 개수
   * @param userID 유저 id
   * @returns Routine[]
   */
  async getAllRoutine(lastRoutineID: number, count: number, userID: number) {
    let id = lastRoutineID;
    if (lastRoutineID < 0) {
      // 최초 조회 시 0보다 작은 값
      const finalRoutine = await this.routineRepository.findFinalRoutine(userID);

      if (!finalRoutine) {
        return [] as Routine[];
      }

      id = finalRoutine.id + 1; // 마지막 데이터도 조회되도록 하기 위함
    }

    const routines = await this.routineRepository.findAllRoutine(id, count, userID, {
      alarm: true,
    });

    return routines;
  }

  /**
   * @description 특정 루틴 가져오기
   * @param id 루틴 id
   * @param userID 유저 id
   * @returns Routine[]
   */
  async getRoutine(id: number, userID: number) {
    const routine = await this.routineRepository.findRoutine(id, userID, {
      alarm: true,
    });

    return routine;
  }
}
