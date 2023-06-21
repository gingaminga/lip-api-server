import { dataSource } from "@/databases/rdb/client";
import RoutineTodo from "@/databases/rdb/entities/routine-todo.entity";

export const routineToDoRepository = dataSource.getRepository(RoutineTodo);
