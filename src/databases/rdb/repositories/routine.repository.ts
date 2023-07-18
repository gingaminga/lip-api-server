import { dataSource } from "@/databases/rdb/client";
import Alarm from "@/databases/rdb/entities/alarm.entity";
import FcmToken from "@/databases/rdb/entities/fcm-token.entity";
import Routine from "@/databases/rdb/entities/routine.entity";
import User from "@/databases/rdb/entities/user.entity";
import { getExistDay } from "@/utils/date";
import { FindOptionsRelations, LessThan } from "typeorm";
import { INotificationItem } from "@/types/notification";

const alias = "routine";

export const RoutineRepository = dataSource.getRepository(Routine).extend({
  /**
   * @description 루틴 등록하기
   * @param content 내용
   * @param days 요일
   * @param themeColor 테마 색상
   * @param user 유저 정보
   * @returns Routine
   */
  async addRoutine(content: string, days: string, themeColor: string, alarm: Alarm, user: User) {
    const { friday, monday, saturday, sunday, thursday, tuesday, wednesday } = getExistDay(days);

    const routine = new Routine();
    routine.alarm = alarm;
    routine.color = themeColor;
    routine.content = content;
    routine.friday = friday;
    routine.monday = monday;
    routine.saturday = saturday;
    routine.sunday = sunday;
    routine.thursday = thursday;
    routine.tuesday = tuesday;
    routine.user = user;
    routine.wednesday = wednesday;

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
   * @description 요일에 해당하는 루틴 가져오기
   * @param day 요일(텍스트)
   * @param userID 유저 id
   * @param relations relation 허용 객체
   * @returns Routine[]
   */
  async findRoutineByDay(day: string, userID: number, relations?: FindOptionsRelations<Routine>) {
    const routine = await this.find({
      relations,
      where: {
        user: {
          id: userID,
        },
        [day]: true,
      },
      withDeleted: true,
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
   * @description 유저의 모든 루틴 가져오기
   * @param userID 유저 ID
   * @param relations relation 허용 객체
   * @returns Routine[]
   */
  async findAllRoutineOfUser(userID: number, relations?: FindOptionsRelations<Routine>) {
    const routine = await this.find({
      relations,
      where: {
        user: {
          id: userID,
        },
      },
      withDeleted: true,
    });

    return routine;
  },
  /**
   * @description content, token 정보 가져오기
   * @param day 요일 text
   * @param alarmID 알람 id
   * @returns INotificationItem[]
   */
  async findContentAndDeviceToKen(day: string, alarmID: number) {
    const notifications = await this.createQueryBuilder(alias)
      .leftJoinAndSelect(FcmToken, "fcmToken", `${alias}.user = fcmToken.user_id`)
      .select([`${alias}.id as id`, `${alias}.content as content`, "fcmToken.device_token"])
      .where(`${alias}.${day} = true`)
      .andWhere(`${alias}.alarm_id = :alarmID`, {
        alarmID,
      })
      .getRawMany<INotificationItem>();

    return notifications;
  },
  /**
   * @description 루틴 수정하기
   * @param id 루틴 ID
   * @param content 내용
   * @param days 요일
   * @param themeColor 테마 색상
   * @param alarmID 알람 ID
   * @param userID 유저 id
   * @returns true (수정) / false (수정 실패)
   */
  async modifyRoutine(id: number, content: string, days: string, themeColor: string, alarmID: number, userID: number) {
    const { friday, monday, saturday, sunday, thursday, tuesday, wednesday } = getExistDay(days);

    const result = await this.update(
      {
        id,
        user: {
          id: userID,
        },
      },
      {
        alarm: {
          id: alarmID,
        },
        color: themeColor,
        content,
        friday,
        monday,
        saturday,
        sunday,
        thursday,
        tuesday,
        wednesday,
      },
    );

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
  /**
   * @description routine 전체 삭제하기
   * @param id 유저 id
   * @returns true (삭제) / false (삭제 실패)
   */
  async removeAllRoutine(id: number) {
    const result = await this.softDelete({
      user: {
        id,
      },
    });

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
    const result = await this.softDelete({
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
