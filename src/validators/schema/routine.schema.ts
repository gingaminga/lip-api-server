import {
  AddRoutineRequestParamDTO,
  GetAllRoutineRequestParamDTO,
  GetRoutineRequestParamDTO,
  ModifyCheckRoutineToDoRequestParamDTO,
  ModifyRoutineRequestParamDTO,
  RemoveRoutineRequestParamDTO,
} from "@/dto/routine.dto";
import CError, { ERROR_MESSAGE } from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import dayjs from "dayjs";
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

export const modifyCheckRoutineToDoSchema = joi.object<ModifyCheckRoutineToDoRequestParamDTO>().keys({
  checked: joi
    .number()
    .valid(0, 1)
    .required()
    .custom((origin) => origin === 1),
  date: joi
    .string()
    .regex(/^[0-9]+$/)
    .custom((origin: string) => {
      if (origin.length === 6) {
        // 월
        return dayjs(origin).format("YYYYMM");
      }

      if (origin.length === 8) {
        // 일
        return dayjs(origin).format("YYYYMMDD");
      }

      throw new CError(ERROR_MESSAGE.INVALID_VALUE, HTTP_STATUS_CODE.INVALID_VALUE);
    }),
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
