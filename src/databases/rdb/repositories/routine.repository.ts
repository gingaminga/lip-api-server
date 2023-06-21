import { dataSource } from "@/databases/rdb/client";
import Alarm from "@/databases/rdb/entities/alarm.entity";
import Routine from "@/databases/rdb/entities/routine.entity";
import User from "@/databases/rdb/entities/user.entity";
import { FindOptionsRelations, LessThan } from "typeorm";

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
    routine.alarm = alarm;
    routine.color = themeColor;
    routine.days = days;
    routine.title = title;
    routine.user = user;

    const routineInfo = await this.save(routine);

    return routineInfo;
  },
  /**
   * @description 특정 루틴 가져오기
   * @param id routine ID
   * @param userID 유저 ID
   * @param relations relation 허용 객체
   * @returns Routine | null
   */
  async findRoutine(id: number, userID: number, relations?: FindOptionsRelations<Routine>) {
    const routine = await this.findOne({
      relations,
      where: {
        id,
        user: {
          id: userID,
        },
      },
    });

    return routine;
  },
  /**
   * @description 마지막 루틴 가져오기
   * @param userID 유저 ID
   * @param relations relation 허용 객체
   * @returns Routine | null
   */
  async findFinalRoutine(userID: number, relations?: FindOptionsRelations<Routine>) {
    const routine = await this.findOne({
      order: {
        createdAt: "DESC",
        id: "DESC",
      },
      relations,
      where: {
        user: {
          id: userID,
        },
      },
    });

    return routine;
  },
  /**
   * @description 전체 루틴 가져오기
   * @param routineID 기준이 될 루틴 id
   * @param count 개수
   * @param userID 유저 id
   * @param relations relation 허용 객체
   * @returns Routine[]
   */
  async findAllRoutine(routineID: number, count: number, userID: number, relations?: FindOptionsRelations<Routine>) {
    const routines = await this.find({
      order: {
        createdAt: "DESC",
        id: "DESC",
      },
      relations,
      take: count,
      where: {
        id: LessThan(routineID),
        user: {
          id: userID,
        },
      },
    });

    return routines;
  },
  /**
   * @description 루틴 수정하기
   * @param id 루틴 ID
   * @param title 내용
   * @param days 요일
   * @param themeColor 테마 색상
   * @returns true (수정) / false (수정 실패)
   */
  async modifyRoutine(id: number, title: string, days: string, themeColor: string) {
    const result = await this.update(
      {
        id,
      },
      {
        color: themeColor,
        days,
        title,
      },
    );

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
  /**
   * @description 루틴 삭제하기
   * @param routineID 루틴 id
   * @param userID 유저 id
   * @returns true (삭제) / false (삭제 실패)
   */
  async removeRoutine(routineID: number, userID: number) {
    const result = await this.delete({
      id: routineID,
      user: {
        id: userID,
      },
    });

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
});
