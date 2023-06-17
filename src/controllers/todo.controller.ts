import { AddToDoRequestParamDTO, GetToDoRequestParamDTO } from "@/dto/todo.dto";
import { todoService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

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
