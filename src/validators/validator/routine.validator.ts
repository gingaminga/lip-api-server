import { GetAllRoutineRequestParamDTO } from "@/dto/routine.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import { getAllRoutineSchema } from "@/validators/schema/routine.schema";

export const getAllRoutineValidator: RequestDTOHandler<GetAllRoutineRequestParamDTO> = async (req, res, next) => {
  const { limit, id } = await getAllRoutineSchema.validateAsync(req.query);

  res.locals.requestDTO = new GetAllRoutineRequestParamDTO(id, limit);

  next();
};
