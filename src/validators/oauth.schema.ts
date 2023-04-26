import { TOAuthType } from "@/types/oauth";
import constants from "@/utils/constants";
import joi from "joi";

interface IGetOAuthURLSchema {
  type: TOAuthType;
}

interface IOAuthLoginSchema extends IGetOAuthURLSchema {
  code: string;
}

export const getOAuthURLSchema = joi.object<IGetOAuthURLSchema>().keys({
  type: joi.string().valid(constants.OAUTH.KAKAO.NAME).required(),
});

export const oAuthLoginSchema = joi.object<IOAuthLoginSchema>().keys({
  type: joi.string().valid(constants.OAUTH.KAKAO.NAME).required(),
  code: joi.string().required(),
});
