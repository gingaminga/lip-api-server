import { dataSource } from "@/databases/rdb/client";
import Alarm from "@/databases/rdb/entities/alarm.entity";

const alias = "alarm";

export const AlarmRepository = dataSource.getRepository(Alarm);
