import { GetToDoRequestParamDTO } from "@/dto/todo.dto";
import { todoService } from "@/loaders/service.loader";
import { RequestDTOHandler } from "@/types/express.custom";

/**
 * @description 할 일 가져오기 컨트롤러
 * @param req Request
 * @param res Response
 */
export const getTodoController: RequestDTOHandler<GetToDoRequestParamDTO> = async (req, res) => {
  const { date } = res.locals.requestDTO;
  const { id } = res.locals.userInfo; // 임시

  const result = await todoService.getToDos(date, id);

  res.result(result);
};
