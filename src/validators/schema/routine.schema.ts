import joi from "joi";

interface IGetAllRoutineSchema {
  limit?: number;
  id: number;
}

export const getAllRoutineSchema = joi.object<IGetAllRoutineSchema>().keys({
  limit: joi.number().min(1).max(100),
  id: joi.number().required(),
});
