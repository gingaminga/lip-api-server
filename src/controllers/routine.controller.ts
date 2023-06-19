import { GetAllRoutineRequestParamDTO } from "@/dto/routine.dto";
import { routineService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description 전체 루틴 가져오기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const getAllRoutineController: RequestDTOHandler<GetAllRoutineRequestParamDTO> = async (req, res) => {
  const { lastID, limit } = res.locals.requestDTO;
  const { id } = res.locals.userInfo;

  const result = await routineService.getAllRoutine(lastID, limit, id);

  res.result(result);
};
