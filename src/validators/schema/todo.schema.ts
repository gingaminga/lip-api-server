import {
  AddToDoRequestParamDTO,
  GetToDoRequestParamDTO,
  ModifyCheckToDoRequestParamDTO,
  ModifyContentToDoRequestParamDTO,
  RemoveAlarmInToDoRequestParamDTO,
  RemoveToDoRequestParamDTO,
  SetAlarmInToDoRequestParamDTO,
} from "@/dto/todo.dto";
import CError, { ERROR_MESSAGE } from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import dayjs from "dayjs";
import joi from "joi";

export const addToDoSchema = joi.object<AddToDoRequestParamDTO>().keys({
  content: joi.string().required(),
  date: joi
    .string()
    .length(8)
    .regex(/^[0-9]+$/)
    .custom((origin: string) => dayjs(origin).format("YYYYMMDD")),
});

export const getToDoSchema = joi.object<GetToDoRequestParamDTO>().keys({
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
});

export const modifyCheckToDoSchema = joi.object<ModifyCheckToDoRequestParamDTO>().keys({
  checked: joi
    .number()
    .valid(0, 1)
    .required()
    .custom((origin) => origin === 1),
  id: joi.number().required(),
});

export const modifyContentToDoSchema = joi.object<ModifyContentToDoRequestParamDTO>().keys({
  content: joi.string().required(),
  id: joi.number().required(),
});

export const removeAlarmInToDoSchema = joi.object<RemoveAlarmInToDoRequestParamDTO>().keys({
  id: joi.number().required(),
});

export const removeToDoSchema = joi.object<RemoveToDoRequestParamDTO>().keys({
  id: joi.number().required(),
});

export const setAlarmInToDoSchema = joi.object<SetAlarmInToDoRequestParamDTO>().keys({
  alarmHour: joi.number().min(0).max(23).required(),
  alarmMinute: joi.number().min(0).max(59).required(),
  id: joi.number().required(),
});
