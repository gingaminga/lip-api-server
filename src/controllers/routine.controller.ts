import { GetAllRoutineRequestParamDTO } from "@/dto/routine.dto";
import { routineService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description 전체 루틴 가져오기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const getAllRoutineController: RequestDTOHandler<GetAllRoutineRequestParamDTO> = async (req, res) => {
  const { limit, id } = res.locals.requestDTO;
  const { id: userID } = res.locals.userInfo;

  const result = await routineService.getAllRoutine(id, limit, userID);

  res.result(result);
};
