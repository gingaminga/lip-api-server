import { TOAuthType } from "@/types/oauth";
import constants from "@/utils/constants";
import joi from "joi";

interface IGetOAuthURLSchema {
  type: TOAuthType;
}

export const getOAuthURLSchema = joi.object<IGetOAuthURLSchema>().keys({
  type: joi.string().valid(constants.OAUTH.KAKAO.NAME).required(),
});
