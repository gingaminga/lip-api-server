import { dataSource } from "@/databases/rdb/client";
import Routine from "@/databases/rdb/entities/routine.entity";
import RoutineTodo from "@/databases/rdb/entities/routine-todo.entity";
import User from "@/databases/rdb/entities/user.entity";
import { Between, FindOptionsRelations } from "typeorm";

export const RoutineToDoRepository = dataSource.getRepository(RoutineTodo).extend({
  /**
   * @description 루틴 할 일 등록하기
   * @param checked 할 일 완료 유무
   * @param date 날짜
   * @param routine 루틴 정보
   * @param user 유저 정보
   * @returns RoutineToDo | null
   */
  async addRoutineToDo(checked: boolean, date: string, routine: Routine, user: User) {
    const routineToDo = new RoutineTodo();
    routineToDo.checked = checked;
    routineToDo.date = date;
    routineToDo.routine = routine;
    routineToDo.user = user;

    const routineToDoInfo = await this.save(routineToDo);

    return routineToDoInfo;
  },
  /**
   * @description 루틴 id와 날짜로 루틴 할 일 찾기
   * @param routineID 루틴 id
   * @param date 날짜
   * @param userID 유저 id
   * @param relations relation 허용 객체
   * @returns RoutineTodo | null
   */
  async findRoutineToDoByRoutineIDAndDate(
    routineID: number,
    date: string,
    userID: number,
    relations?: FindOptionsRelations<RoutineTodo>,
  ) {
    const routineToDo = await this.findOne({
      relations,
      where: {
        date,
        routine: {
          id: routineID,
        },
        user: {
          id: userID,
        },
      },
    });

    return routineToDo;
  },
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
  /**
   * @description 기간별 루틴 할 일 찾기
   * @param startDate 시작 날짜
   * @param endDate 끝 날짜
   * @param userID 유저 id
   * @param relations 관계형 옵션
   * @returns RoutineToDo[]
   */
  async findRoutineToDoByMonth(
    startDate: string,
    endDate: string,
    userID: number,
    relations?: FindOptionsRelations<RoutineTodo>,
  ) {
    const routine = await this.find({
      relations,
      where: {
        date: Between(startDate, endDate),
        user: {
          id: userID,
        },
      },
    });

    return routine;
  },
  /**
   * @description 루틴 할 일 체크 수정하기
   * @param routineToDoID 루틴 할 일 id
   * @param checked 할 일 체크 여부
   * @param userID 유저 id
   * @returns true/false
   */
  async modifyCheckRoutineToDo(routineToDoID: number, checked: boolean, userID: number) {
    const result = await this.update(
      {
        id: routineToDoID,
        user: {
          id: userID,
        },
      },
      {
        checked,
      },
    );

    if (result.affected && result.affected > 0) {
      return true;
    }

    return false;
  },
});
