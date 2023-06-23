import { DuplicateNicknameRequestParamDTO, LoginRequestParamDTO } from "@/dto/user.dto";
import { authService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description 닉네임 중복 확인 컨트롤러
 * @param req Request
 * @param res Response
 */
export const duplicateNicknameController: RequestDTOHandler<DuplicateNicknameRequestParamDTO> = async (req, res) => {
  const { nickname } = res.locals.requestDTO;

  const result = await authService.checkDuplicateNickname(nickname);

  res.result(result);
};

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

/**
 * @description 로그아웃 컨트롤러
 * @param req Request
 * @param res Response
 */
export const logoutController: RequestDTOHandler = async (req, res) => {
  const { nickname } = res.locals.userInfo;

  const result = await authService.logout(nickname);

  res.result(result);
};
