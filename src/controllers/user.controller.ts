import { LoginRequestParamDTO } from "@/dto/user.dto";
import { oAuthService, userService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description 로그인 컨트롤러
 * @param req Request
 * @param res Response
 */
export const loginController: RequestDTOHandler<LoginRequestParamDTO> = async (req, res) => {
  const { code, type } = res.locals.dto;

  const { id, nickname } = await oAuthService.getUserInfo(type, code);

  const result = await userService.login(id, type, nickname);

  res.result(result);
};
