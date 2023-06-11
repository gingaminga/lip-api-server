import { GetOAuthURLRequestParamDTO, ReissueTokenDTO } from "@/dto/auth.dto";
import { authService, userService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description OAuth URL을 가져오는 컨트롤러
 * @param req Request
 * @param res Response
 */
export const getOAuthURLController: RequestDTOHandler<GetOAuthURLRequestParamDTO> = (req, res) => {
  const { type } = res.locals.dto;

  const url = authService.getOAuthURL(type);

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
export const reissueTokenController: RequestDTOHandler<ReissueTokenDTO> = async (req, res) => {
  const { nickname, type } = res.locals.dto;

  const result = await userService.login(nickname, type);

  res.result(result);
};
