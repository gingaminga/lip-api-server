import {
  AddRoutineRequestParamDTO,
  GetAllRoutineRequestParamDTO,
  GetRoutineRequestParamDTO,
  ModifyRoutineRequestParamDTO,
  RemoveRoutineRequestParamDTO,
} from "@/dto/routine.dto";
import joi from "joi";

export const addRoutineSchema = joi.object<AddRoutineRequestParamDTO>().keys({
  alarmHour: joi.number().min(0).max(23).required(),
  alarmMinute: joi.number().min(0).max(59).required(),
  color: joi.string().required(),
  content: joi.string().required(),
  days: joi.string().max(7).required(),
});

export const getAllRoutineSchema = joi.object<GetAllRoutineRequestParamDTO>().keys({
  limit: joi.number().min(1).max(100),
  id: joi.number().required(),
});

export const getRoutineSchema = joi.object<GetRoutineRequestParamDTO>().keys({
  id: joi.number().required(),
});

export const modifyRoutineSchema = joi.object<ModifyRoutineRequestParamDTO>().keys({
  alarmHour: joi.number().min(0).max(23).required(),
  alarmMinute: joi.number().min(0).max(59).required(),
  color: joi.string().required(),
  content: joi.string().required(),
  days: joi.string().max(7).required(),
  id: joi.number().required(),
});

export const removeRoutineSchema = joi.object<RemoveRoutineRequestParamDTO>().keys({
  id: joi.number().required(),
});
