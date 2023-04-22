import { GetOAuthURLRequestParamDTO } from "@/dto/oauth.dto";
import OAuthService from "@/services/oauth.service";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description OAuth URL을 가져오는 컨트롤러
 * @param req Request
 * @param res Response
 */
export const getOAuthURLController: RequestDTOHandler<GetOAuthURLRequestParamDTO> = (req, res) => {
  const { type } = res.locals.dto;

  const url = OAuthService.getURL(type);

  const result = {
    url,
  };

  res.result(result);
};
