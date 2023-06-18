import {
  AddToDoRequestParamDTO,
  GetToDoRequestParamDTO,
  ModifyCheckToDoRequestParamDTO,
  ModifyContentToDoRequestParamDTO,
  RemoveToDoRequestParamDTO,
} from "@/dto/todo.dto";
import { todoService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description 할 일 추가하기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const addTodoController: RequestDTOHandler<AddToDoRequestParamDTO> = async (req, res) => {
  const { content, date } = res.locals.requestDTO;
  const { userInfo } = res.locals;

  const result = await todoService.addToDo(content, date, userInfo);

  res.result(result);
};

/**
 * @description 할 일 가져오기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const getTodoController: RequestDTOHandler<GetToDoRequestParamDTO> = async (req, res) => {
  const { date } = res.locals.requestDTO;
  const { id } = res.locals.userInfo;

  const result = await todoService.getToDos(date, id);

  res.result(result);
};

/**
 * @description 할 일 완료 유무 컨트롤러
 * @param req Request
 * @param res Response
 */
export const modifyCheckTodoController: RequestDTOHandler<ModifyCheckToDoRequestParamDTO> = async (req, res) => {
  const { checked, id } = res.locals.requestDTO;
  const { id: userID } = res.locals.userInfo;

  const result = await todoService.modifyCheckToDo(id, checked, userID);

  res.result(result);
};

/**
 * @description 할 일 완료 유무 컨트롤러
 * @param req Request
 * @param res Response
 */
export const modifyContentTodoController: RequestDTOHandler<ModifyContentToDoRequestParamDTO> = async (req, res) => {
  const { content, id } = res.locals.requestDTO;
  const { id: userID } = res.locals.userInfo;

  const result = await todoService.modifyContentToDo(id, content, userID);

  res.result(result);
};

/**
 * @description 할 일 삭제하기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const removeTodoController: RequestDTOHandler<RemoveToDoRequestParamDTO> = async (req, res) => {
  const { id } = res.locals.requestDTO;
  const { id: userID } = res.locals.userInfo;

  const result = await todoService.removeToDo(id, userID);

  res.result(result);
};

/**
 * @description 할 일 전체 삭제하기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const removeAllTodoController: RequestDTOHandler<RemoveToDoRequestParamDTO> = async (req, res) => {
  const { id } = res.locals.userInfo;

  const result = await todoService.removeAllToDo(id);

  res.result(result);
};
