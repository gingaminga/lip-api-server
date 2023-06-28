import {
  AddToDoRequestParamDTO,
  GetToDoRequestParamDTO,
  ModifyCheckToDoRequestParamDTO,
  ModifyContentToDoRequestParamDTO,
  RemoveToDoRequestParamDTO,
  SetAlarmInToDoRequestParamDTO,
} from "@/dto/todo.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import {
  addToDoSchema,
  getToDoSchema,
  modifyCheckToDoSchema,
  modifyContentToDoSchema,
  removeToDoSchema,
  setAlarmInToDoSchema,
} from "@/validators/schema/todo.schema";

export const addToDoValidator: RequestDTOHandler<AddToDoRequestParamDTO> = async (req, res, next) => {
  const { content, date } = await addToDoSchema.validateAsync(req.body);

  res.locals.requestDTO = new AddToDoRequestParamDTO(content, date);

  next();
};

export const getToDoValidator: RequestDTOHandler<GetToDoRequestParamDTO> = async (req, res, next) => {
  const { date } = await getToDoSchema.validateAsync(req.query);

  res.locals.requestDTO = new GetToDoRequestParamDTO(date);

  next();
};

export const modifyCheckToDoValidator: RequestDTOHandler<ModifyCheckToDoRequestParamDTO> = async (req, res, next) => {
  const { checked, id } = await modifyCheckToDoSchema.validateAsync(req.body);

  res.locals.requestDTO = new ModifyCheckToDoRequestParamDTO(id, checked);

  next();
};

export const modifyContentToDoValidator: RequestDTOHandler<ModifyContentToDoRequestParamDTO> = async (
  req,
  res,
  next,
) => {
  const { content, id } = await modifyContentToDoSchema.validateAsync(req.body);

  res.locals.requestDTO = new ModifyContentToDoRequestParamDTO(id, content);

  next();
};

export const removeToDoValidator: RequestDTOHandler<RemoveToDoRequestParamDTO> = async (req, res, next) => {
  const { id } = await removeToDoSchema.validateAsync(req.body);

  res.locals.requestDTO = new RemoveToDoRequestParamDTO(id);

  next();
};

export const setAlarmInToDoValidator: RequestDTOHandler<SetAlarmInToDoRequestParamDTO> = async (req, res, next) => {
  const { alarmHour, alarmMinute, id } = await setAlarmInToDoSchema.validateAsync(req.body);

  res.locals.requestDTO = new SetAlarmInToDoRequestParamDTO(alarmHour, alarmMinute, id);

  next();
};
