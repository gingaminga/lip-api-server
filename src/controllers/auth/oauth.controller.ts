import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description OAuth URL을 가져오는 컨트롤러
 * @param req Request
 * @param res Response
 */
export const getOAuthURLController: RequestDTOHandler<null> = (req, res) => {
  res.result(true);
};
