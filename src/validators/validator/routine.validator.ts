import { GetAllRoutineRequestParamDTO, GetRoutineRequestParamDTO } from "@/dto/routine.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import { getAllRoutineSchema, getRoutineSchema } from "@/validators/schema/routine.schema";

export const getAllRoutineValidator: RequestDTOHandler<GetAllRoutineRequestParamDTO> = async (req, res, next) => {
  const { limit, id } = await getAllRoutineSchema.validateAsync(req.query);

  res.locals.requestDTO = new GetAllRoutineRequestParamDTO(id, limit);

  next();
};

export const getRoutineValidator: RequestDTOHandler<GetRoutineRequestParamDTO> = async (req, res, next) => {
  const { id } = await getRoutineSchema.validateAsync(req.query);

  res.locals.requestDTO = new GetRoutineRequestParamDTO(id);

  next();
};
