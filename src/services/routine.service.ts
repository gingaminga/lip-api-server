import { dataSource } from "@/databases/rdb/client";
import Routine from "@/databases/rdb/entities/routine.entity";
import User from "@/databases/rdb/entities/user.entity";
import { AlarmRepository } from "@/databases/rdb/repositories/alarm.repository";
import { RoutineRepository } from "@/databases/rdb/repositories/routine.repository";
import { Service } from "typedi";

@Service()
export default class RoutineService {
  alarmRepository = AlarmRepository;

  routineRepository = RoutineRepository;

  /**
   * @description 루틴 등록하기
   * @param title 내용
   * @param days 요일
   * @param themeColor 테마 색상
   * @param alarmHour 알람 시
   * @param alarmMinute 알람 분
   * @param userID 유저 id
   * @returns Routine
   */
  async registerRoutine(
    title: string,
    days: string,
    themeColor: string,
    alarmHour: number,
    alarmMinute: number,
    user: User,
  ) {
    // transaction을 해야함
    return dataSource.transaction(async (manager) => {
      const alarmRepository = manager.withRepository(this.alarmRepository);
      const routineRepository = manager.withRepository(this.routineRepository);

      const alarm = await alarmRepository.addAlarm(alarmHour, alarmMinute);
      const routine = await routineRepository.addRoutine(title, days, themeColor, alarm, user);

      return routine;
    });
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

    const routines = await this.routineRepository.findAllRoutine(id, count, userID);

    return routines;
  }

  /**
   * @description 특정 루틴 가져오기
   * @param id 루틴 id
   * @param userID 유저 id
   * @returns Routine[]
   */
  async getRoutine(id: number, userID: number) {
    const routine = await this.routineRepository.findRoutine(id, userID);

    return routine;
  }
}
