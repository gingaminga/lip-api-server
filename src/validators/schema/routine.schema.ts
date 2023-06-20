import { GetAllRoutineRequestParamDTO } from "@/dto/routine.dto";
import joi from "joi";

export const getAllRoutineSchema = joi.object<GetAllRoutineRequestParamDTO>().keys({
  limit: joi.number().min(1).max(100),
  id: joi.number().required(),
});
