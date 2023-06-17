import { GetToDoRequestParamDTO } from "@/dto/todo.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import { getToDoSchema } from "@/validators/schema/todo.schema";

export const getToDoValidator: RequestDTOHandler<GetToDoRequestParamDTO> = async (req, res, next) => {
  const { date } = await getToDoSchema.validateAsync(req.query);

  res.locals.requestDTO = new GetToDoRequestParamDTO(date);

  next();
};
