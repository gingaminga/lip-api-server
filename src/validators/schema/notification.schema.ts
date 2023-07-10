import { SetFCMTokenRequestParamDTO } from "@/dto/notification.dto";
import joi from "joi";

export const setFCMTokenSchema = joi.object<SetFCMTokenRequestParamDTO>().keys({
  token: joi.string().required(),
});
