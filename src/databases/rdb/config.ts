import Alarm from "@/databases/rdb/entities/alarm.entity";
import Routine from "@/databases/rdb/entities/routine.entity";
import RoutineToDo from "@/databases/rdb/entities/routine-todo.entity";
import Todo from "@/databases/rdb/entities/todo.entity";
import User from "@/databases/rdb/entities/user.entity";
import constants from "@/utils/constants";
import { DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const entities = [Alarm, Routine, RoutineToDo, Todo, User];

const options: DataSourceOptions = {
  database: constants.DATABASE.SCHEMA,
  dropSchema: constants.NODE_ENV === "test",
  entities,
  host: constants.DATABASE.HOST,
  logging: constants.NODE_ENV === "development",
  password: constants.DATABASE.PASSWORD,
  port: constants.DATABASE.PORT,
  synchronize: true,
  type: constants.DATABASE.TYPE,
  username: constants.DATABASE.USER_NAME,
  namingStrategy: new SnakeNamingStrategy(),
};

export default options;
