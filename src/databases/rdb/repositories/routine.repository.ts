import { dataSource } from "@/databases/rdb/client";
import Alarm from "@/databases/rdb/entities/alarm.entity";
import Routine from "@/databases/rdb/entities/routine.entity";
import User from "@/databases/rdb/entities/user.entity";

const alias = "routine";

export const RoutineRepository = dataSource.getRepository(Routine).extend({
  /**
   * @description 루틴 등록하기
   * @param title 내용
   * @param days 요일
   * @param themeColor 테마 색상
   * @param user 유저 정보
   * @returns Routine
   */
  async addRoutine(title: string, days: string, themeColor: string, alarm: Alarm, user: User) {
    const routine = new Routine();
    routine.title = title;
    routine.days = days;
    routine.color = themeColor;
    routine.alarm = alarm;
    routine.user = user;

    const routineInfo = await this.save(routine);

    return routineInfo;
  },
  /**
   * @description 특정 루틴 가져하기
   * @param id routine ID
   * @param userID 유저 ID
   * @returns Routine | null
   */
  async findRoutine(id: number, userID: number) {
    const routine = await this.createQueryBuilder(alias)
      .select()
      .where("routine.id = :id", {
        id,
      })
      .andWhere("routine.user_id = :userID", {
        userID,
      })
      .getOne();

    return routine;
  },
  /**
   * @description 마지막 루틴 가져하기
   * @param userID 유저 ID
   * @returns Routine | null
   */
  async findFinalRoutine(userID: number) {
    const routine = await this.createQueryBuilder(alias)
      .select()
      .where("routine.user_id = :userID", {
        userID,
      })
      .orderBy({
        "routine.created_at": "DESC",
        "routine.id": "DESC",
      })
      .limit(1)
      .getOne();

    return routine;
  },
  /**
   * @description 전체 루틴 가져오기
   * @param routineID 기준이 될 루틴 id
   * @param count 개수
   * @param userID 유저 id
   * @returns Routine[]
   */
  async findAllRoutine(routineID: number, count: number, userID: number) {
    const routines = await this.createQueryBuilder(alias)
      .select()
      .where("routine.id < :routineID", {
        routineID,
      })
      .andWhere("routine.user_id = :userID", {
        userID,
      })
      .orderBy({
        "routine.created_at": "DESC",
        "routine.id": "DESC",
      })
      .limit(count)
      .getMany();

    return routines;
  },
});
