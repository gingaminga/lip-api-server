import { AddToDoRequestParamDTO, GetToDoRequestParamDTO } from "@/dto/todo.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import { addToDoSchema, getToDoSchema } from "@/validators/schema/todo.schema";

export const getToDoValidator: RequestDTOHandler<GetToDoRequestParamDTO> = async (req, res, next) => {
  const { date } = await getToDoSchema.validateAsync(req.query);

  res.locals.requestDTO = new GetToDoRequestParamDTO(date);

  next();
};

export const addToDoValidator: RequestDTOHandler<AddToDoRequestParamDTO> = async (req, res, next) => {
  const { content, date } = await addToDoSchema.validateAsync(req.body);

  res.locals.requestDTO = new AddToDoRequestParamDTO(content, date);

  next();
};
