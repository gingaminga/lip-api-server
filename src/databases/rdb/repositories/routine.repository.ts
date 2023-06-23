import { dataSource } from "@/databases/rdb/client";
import Alarm from "@/databases/rdb/entities/alarm.entity";
import Routine from "@/databases/rdb/entities/routine.entity";
import User from "@/databases/rdb/entities/user.entity";
import { getExistDay } from "@/utils/date";
import { FindOptionsRelations, LessThan } from "typeorm";

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
    const { friday, monday, saturday, sunday, thursday, tuesday, wednesday } = getExistDay(days);

    const routine = new Routine();
    routine.alarm = alarm;
    routine.color = themeColor;
    routine.friday = friday;
    routine.monday = monday;
    routine.saturday = saturday;
    routine.sunday = sunday;
    routine.thursday = thursday;
    routine.title = title;
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
   * @description 날짜별 루틴과 루틴 할 일을 조합하여 가져오기
   * @param date 날짜
   * @param days 요일
   * @param userID 유저 id
   * @returns Routine[]
   */
  async findRoutineToDoByDate(date: string, days: string, userID: number) {
    const { friday, monday, saturday, sunday, thursday, tuesday, wednesday } = getExistDay(days);

    const routineToDoAlias = "routine_todo";

    const routineTodos = await this.createQueryBuilder(alias)
      .select([
        `${alias}.id`,
        `${alias}.title`,
        `${alias}.createdAt`,
        `${alias}.updatedAt`,
        `${routineToDoAlias}.id`,
        `routine_todo.id`,
      ])
      .leftJoinAndSelect(`${alias}.routineTodo`, routineToDoAlias)
      .where(`${alias}.user_id = :userID`, {
        userID,
      })
      .andWhere(`(${routineToDoAlias}.date = :date`, {
        date,
      })
      .orWhere(`${routineToDoAlias}.date IS NULL)`)
      .andWhere(`(${alias}.sunday = :sunday`, {
        sunday,
      })
      .orWhere(`${alias}.monday = :monday`, {
        monday,
      })
      .orWhere(`${alias}.tuesday = :tuesday`, {
        tuesday,
      })
      .orWhere(`${alias}.wednesday = :wednesday`, {
        wednesday,
      })
      .orWhere(`${alias}.thursday = :thursday`, {
        thursday,
      })
      .orWhere(`${alias}.friday = :friday`, {
        friday,
      })
      .orWhere(`${alias}.saturday = :saturday)`, {
        saturday,
      })
      .orderBy(`${alias}.created_at`, "DESC")
      .getMany();

    return routineTodos;
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
   * @param alarmID 알람 ID
   * @param userID 유저 id
   * @returns true (수정) / false (수정 실패)
   */
  async modifyRoutine(id: number, title: string, days: string, themeColor: string, alarmID: number, userID: number) {
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
        friday,
        monday,
        saturday,
        sunday,
        thursday,
        title,
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
