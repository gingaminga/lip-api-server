import { GetSocialURLRequestParamDTO, ReissueTokenDTO } from "@/dto/auth.dto";
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
export const reissueTokenController: RequestDTOHandler<ReissueTokenDTO> = async (req, res) => {
  const { nickname, type } = res.locals.requestDTO;

  const result = await authService.login(nickname, type);

  res.result(result);
};
