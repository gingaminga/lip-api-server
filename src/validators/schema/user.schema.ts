import { TOAuthType } from "@/types/oauth";
import constants from "@/utils/constants";
import joi from "joi";

interface ILoginSchema {
  code: string;
  type: TOAuthType;
}

export const loginSchema = joi.object<ILoginSchema>().keys({
  code: joi.string().required(),
  type: joi.string().valid(constants.OAUTH.KAKAO.NAME).required(),
});
