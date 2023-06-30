import {
  AddRoutineRequestParamDTO,
  GetAllRoutineRequestParamDTO,
  GetRoutineRequestParamDTO,
  ModifyCheckRoutineToDoRequestParamDTO,
  ModifyRoutineRequestParamDTO,
  RemoveRoutineRequestParamDTO,
} from "@/dto/routine.dto";
import { routineService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description 루틴 추가하기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const addRoutineController: RequestDTOHandler<AddRoutineRequestParamDTO> = async (req, res) => {
  const { alarmHour, alarmMinute, color, content, days } = res.locals.requestDTO;
  const { userInfo } = res.locals;

  const result = await routineService.registerRoutine(content, days, color, alarmHour, alarmMinute, userInfo);

  res.result(result);
};

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

/**
 * @description 루틴 가져오기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const getRoutineController: RequestDTOHandler<GetRoutineRequestParamDTO> = async (req, res) => {
  const { id } = res.locals.requestDTO;
  const { id: userID } = res.locals.userInfo;

  const result = await routineService.getRoutine(id, userID);

  res.result(result);
};

/**
 * @description 루틴 할 일 수정하기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const modifyCheckRoutineToDoController: RequestDTOHandler<ModifyCheckRoutineToDoRequestParamDTO> = async (
  req,
  res,
) => {
  const { checked, date, id: routineID } = res.locals.requestDTO;
  const { userInfo } = res.locals;

  const result = await routineService.modifyCheckRoutineToDo(routineID, date, checked, userInfo);

  res.result(result);
};

/**
 * @description 루틴 수정하기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const modifyRoutineController: RequestDTOHandler<ModifyRoutineRequestParamDTO> = async (req, res) => {
  const { alarmHour, alarmMinute, color, content, days, id } = res.locals.requestDTO;
  const { id: userID } = res.locals.userInfo;

  const result = await routineService.modifyRoutine(id, content, days, color, alarmHour, alarmMinute, userID);

  res.result(result);
};

/**
 * @description 전체 루틴 삭제하기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const removeAllRoutineController: RequestDTOHandler = async (req, res) => {
  const { id } = res.locals.userInfo;

  const result = await routineService.removeAllRoutine(id);

  res.result(result);
};

/**
 * @description 루틴 가져오기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const removeRoutineController: RequestDTOHandler<RemoveRoutineRequestParamDTO> = async (req, res) => {
  const { id } = res.locals.requestDTO;
  const { id: userID } = res.locals.userInfo;

  const result = await routineService.removeRoutine(id, userID);

  res.result(result);
};
