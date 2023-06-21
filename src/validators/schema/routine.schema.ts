import {
  AddRoutineRequestParamDTO,
  GetAllRoutineRequestParamDTO,
  GetRoutineRequestParamDTO,
  ModifyRoutineRequestParamDTO,
  RemoveRoutineRequestParamDTO,
} from "@/dto/routine.dto";
import joi from "joi";

export const addRoutineSchema = joi.object<AddRoutineRequestParamDTO>().keys({
  alarm_hour: joi.number().min(0).max(23).required(),
  alarm_minute: joi.number().min(0).max(59).required(),
  color: joi.string().required(),
  days: joi.string().max(7).required(),
  title: joi.string().required(),
});

export const getAllRoutineSchema = joi.object<GetAllRoutineRequestParamDTO>().keys({
  limit: joi.number().min(1).max(100),
  id: joi.number().required(),
});

export const getRoutineSchema = joi.object<GetRoutineRequestParamDTO>().keys({
  id: joi.number().required(),
});

export const modifyRoutineSchema = joi.object<ModifyRoutineRequestParamDTO>().keys({
  alarm_hour: joi.number().min(0).max(23).required(),
  alarm_minute: joi.number().min(0).max(59).required(),
  color: joi.string().required(),
  days: joi.string().max(7).required(),
  id: joi.number().required(),
  title: joi.string().required(),
});

export const removeRoutineSchema = joi.object<RemoveRoutineRequestParamDTO>().keys({
  id: joi.number().required(),
});
