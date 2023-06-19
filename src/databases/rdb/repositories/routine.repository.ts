import Routine from "@/databases/rdb/entities/routine.entity";
import BaseRepository from "@/databases/rdb/repositories/base.repository";
import { Service } from "typedi";

@Service()
export default class RoutineRepository extends BaseRepository<Routine> {
  constructor() {
    super();
    this.setTarget(Routine);
  }

  get queryBuilder() {
    return this.getQueryBuilder("routine");
  }

  /**
   * @description 마지막 루틴 가져하기
   * @param userID 유저 ID
   * @returns Routine | null
   */
  async findFinalRoutine(userID: number) {
    const routine = await this.queryBuilder
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
  }

  /**
   * @description 전체 루틴 가져오기
   * @param routineID 기준이 될 루틴 id
   * @param count 개수
   * @param userID 유저 id
   * @returns Routine[]
   */
  async findAllRoutine(routineID: number, count: number, userID: number) {
    const routines = await this.queryBuilder
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
  }
}
