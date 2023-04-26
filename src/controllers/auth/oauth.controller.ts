import { GetOAuthURLRequestParamDTO, OAuthLoginRequestParamDTO } from "@/dto/oauth.dto";
import { oAuthService, userService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description OAuth URL을 가져오는 컨트롤러
 * @param req Request
 * @param res Response
 */
export const getOAuthURLController: RequestDTOHandler<GetOAuthURLRequestParamDTO> = (req, res) => {
  const { type } = res.locals.dto;

  const url = oAuthService.getURL(type);

  const result = {
    url,
  };

  res.result(result);
};

/**
 * @description OAuth 로그인 컨트롤러
 * @param req Request
 * @param res Response
 */
export const oAuthURLController: RequestDTOHandler<OAuthLoginRequestParamDTO> = async (req, res) => {
  const { code, type } = res.locals.dto;

  await oAuthService.setToken(type, code);
  const { id, nickname } = await oAuthService.getUserInfo(type);

  const result = await userService.login(id, type, nickname);

  res.result(result);
};
