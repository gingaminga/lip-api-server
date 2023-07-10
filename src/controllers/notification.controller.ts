import { SetFCMTokenRequestParamDTO } from "@/dto/notification.dto";
import { notificationService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description 토큰을 재발급하는 컨트롤러
 * @param req Request
 * @param res Response
 */
export const setFCMTokenController: RequestDTOHandler<SetFCMTokenRequestParamDTO> = async (req, res) => {
  const { token } = res.locals.requestDTO;
  const { userInfo } = res.locals;

  await notificationService.setFCMToken(token, userInfo);
  res.result(true);
};
