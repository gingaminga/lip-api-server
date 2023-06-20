import { dataSource } from "@/databases/rdb/client";
import RoutineTodo from "@/databases/rdb/entities/routine-todo.entity";

const alias = "routineTodo";

export const routineToDoRepository = dataSource.getRepository(RoutineTodo);
