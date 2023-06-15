import { LoginRequestParamDTO } from "@/dto/user.dto";
import { authService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description 로그인 컨트롤러
 * @param req Request
 * @param res Response
 */
export const loginController: RequestDTOHandler<LoginRequestParamDTO> = async (req, res) => {
  const { code, type } = res.locals.requestDTO;

  const result = await authService.loginWithSocial(code, type);

  res.result(result);
};
