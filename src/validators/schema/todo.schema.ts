import CError, { ERROR_MESSAGE } from "@/utils/error";
import HTTP_STATUS_CODE from "@/utils/http-status-code";
import dayjs from "dayjs";
import joi from "joi";

interface IAddToDoSchema {
  content: string;
  date: string;
}

interface IModifyCheckToDoSchema {
  checked: number;
  id: number;
}

interface IModifyContentToDoSchema {
  content: string;
  id: number;
}

interface IGetToDoSchema {
  date: string;
}

interface IRemoveToDoSchema {
  id: number;
}

export const addToDoSchema = joi.object<IAddToDoSchema>().keys({
  content: joi.string().required(),
  date: joi
    .string()
    .length(8)
    .regex(/^[0-9]+$/)
    .custom((origin: string) => dayjs(origin).format("YYYYMMDD")),
});

export const getToDoSchema = joi.object<IGetToDoSchema>().keys({
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

export const modifyCheckToDoSchema = joi.object<IModifyCheckToDoSchema>().keys({
  checked: joi.number().valid(0, 1).required(),
  id: joi.number().required(),
});

export const modifyContentToDoSchema = joi.object<IModifyContentToDoSchema>().keys({
  content: joi.string().required(),
  id: joi.number().required(),
});

export const removeToDoSchema = joi.object<IRemoveToDoSchema>().keys({
  id: joi.number().required(),
});
