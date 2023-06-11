import { TOAuthType } from "@/types/oauth";
import constants from "@/utils/constants";
import joi from "joi";

interface IGetOAuthURLSchema {
  type: TOAuthType;
}

interface IReissueToken {
  refreshToken: string;
}

export const getOAuthURLSchema = joi.object<IGetOAuthURLSchema>().keys({
  type: joi.string().valid(constants.OAUTH.KAKAO.NAME).required(),
});

export const reissueTokenSchema = joi.object<IReissueToken>().keys({
  refreshToken: joi.string().required(),
});
