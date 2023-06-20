import { dataSource } from "@/databases/rdb/client";
import Routine from "@/databases/rdb/entities/routine.entity";

const alias = "routine";

export const routineRepository = dataSource.getRepository(Routine);
