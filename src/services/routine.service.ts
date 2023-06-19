import Routine from "@/databases/rdb/entities/routine.entity";
import RoutineRepository from "@/databases/rdb/repositories/routine.repository";
import { Inject, Service } from "typedi";

@Service()
export default class RoutineService {
  constructor(@Inject() private routineRepository: RoutineRepository) {
    /* empty */
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
}
