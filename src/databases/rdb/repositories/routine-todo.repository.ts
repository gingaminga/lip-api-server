import { dataSource } from "@/databases/rdb/client";
import RoutineTodo from "@/databases/rdb/entities/routine-todo.entity";
import { FindOptionsRelations } from "typeorm";

export const RoutineToDoRepository = dataSource.getRepository(RoutineTodo).extend({
  /**
   * @description 날짜별 루틴 할 일 찾기
   * @param date 날짜
   * @param userID 유저 ID
   * @param relations relation 허용 객체
   * @returns RoutineTodo[]
   */
  async findRoutineToDoByDate(date: string, userID: number, relations?: FindOptionsRelations<RoutineTodo>) {
    const routine = await this.find({
      relations,
      where: {
        date,
        user: {
          id: userID,
        },
      },
    });

    return routine;
  },
});
