import { GetSocialURLRequestParamDTO, ReissueTokenRequestParamDTO } from "@/dto/auth.dto";
import { authService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description 소셜 URL을 가져오는 컨트롤러
 * @param req Request
 * @param res Response
 */
export const getSocialURLController: RequestDTOHandler<GetSocialURLRequestParamDTO> = (req, res) => {
  const { type } = res.locals.requestDTO;

  const url = authService.getSocialURL(type);

  const result = {
    url,
  };

  res.result(result);
};

/**
 * @description 토큰을 재발급하는 컨트롤러
 * @param req Request
 * @param res Response
 */
export const reissueTokenController: RequestDTOHandler<ReissueTokenRequestParamDTO> = async (req, res) => {
  const { nickname, socialKey, socialType } = res.locals.userInfo;

  const result = await authService.login(nickname, socialType, socialKey);

  res.result(result);
};
