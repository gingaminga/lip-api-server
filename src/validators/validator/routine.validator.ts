import {
  AddRoutineRequestParamDTO,
  GetAllRoutineRequestParamDTO,
  GetRoutineRequestParamDTO,
  ModifyRoutineRequestParamDTO,
  RemoveRoutineRequestParamDTO,
} from "@/dto/routine.dto";
import { RequestDTOHandler } from "@/types/express.custom";
import {
  addRoutineSchema,
  getAllRoutineSchema,
  getRoutineSchema,
  modifyRoutineSchema,
  removeRoutineSchema,
} from "@/validators/schema/routine.schema";

export const addRoutineValidator: RequestDTOHandler<AddRoutineRequestParamDTO> = async (req, res, next) => {
  const {
    alarm_hour: alarmHour,
    alarm_minute: alarmMinute,
    color,
    content,
    days,
  } = await addRoutineSchema.validateAsync(req.body);

  res.locals.requestDTO = new AddRoutineRequestParamDTO(content, days, alarmHour, alarmMinute, color);

  next();
};

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

export const modifyRoutineValidator: RequestDTOHandler<ModifyRoutineRequestParamDTO> = async (req, res, next) => {
  const {
    alarm_hour: alarmHour,
    alarm_minute: alarmMinute,
    color,
    content,
    days,
    id,
  } = await modifyRoutineSchema.validateAsync(req.body);

  res.locals.requestDTO = new ModifyRoutineRequestParamDTO(id, content, days, alarmHour, alarmMinute, color);

  next();
};

export const removeRoutineValidator: RequestDTOHandler<RemoveRoutineRequestParamDTO> = async (req, res, next) => {
  const { id } = await removeRoutineSchema.validateAsync(req.body);

  res.locals.requestDTO = new RemoveRoutineRequestParamDTO(id);

  next();
};
