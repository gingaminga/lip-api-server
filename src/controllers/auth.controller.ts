import { ReissueTokenDTO } from "@/dto/auth.dto";
import { userService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

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
