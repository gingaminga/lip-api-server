import joi from "joi";

interface IGetAllRoutineSchema {
  lastID: number;
  limit?: number;
}

export const getAllRoutineSchema = joi.object<IGetAllRoutineSchema>().keys({
  lastID: joi.number().required(),
  limit: joi.number().min(1).max(100),
});
