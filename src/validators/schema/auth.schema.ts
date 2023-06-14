import { TSocialType } from "@/types/social";
import constants from "@/utils/constants";
import joi from "joi";

interface IGetSocialURLSchema {
  type: TSocialType;
}

interface IReissueToken {
  refreshToken: string;
}

export const getSocialURLSchema = joi.object<IGetSocialURLSchema>().keys({
  type: joi.string().valid(constants.SOCIAL.KAKAO.NAME, constants.SOCIAL.NAVER.NAME).required(),
});

export const reissueTokenSchema = joi.object<IReissueToken>().keys({
  refreshToken: joi.string().required(),
});
