import {
  addTodoController,
  getTodoController,
  modifyCheckTodoController,
  modifyContentTodoController,
  removeAlarmInTodoController,
  removeAllTodoController,
  removeTodoController,
  setAlarmInTodoController,
} from "@/controllers/todo.controller";
import { checkExpireAccessToken } from "@/middlewares/check-expire-token";
import {
  addToDoValidator,
  getToDoValidator,
  modifyCheckToDoValidator,
  modifyContentToDoValidator,
  removeAlarmInToDoValidator,
  removeToDoValidator,
  setAlarmInToDoValidator,
} from "@/validators/validator/todo.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.get("/", checkExpireAccessToken, getToDoValidator, getTodoController);
router.post("/", checkExpireAccessToken, addToDoValidator, addTodoController);
router.delete("/", checkExpireAccessToken, removeToDoValidator, removeTodoController);
router.delete("/all", checkExpireAccessToken, removeAllTodoController);
router.patch("/", checkExpireAccessToken, modifyContentToDoValidator, modifyContentTodoController);
router.patch("/yn", checkExpireAccessToken, modifyCheckToDoValidator, modifyCheckTodoController);
router.patch("/alarm", checkExpireAccessToken, setAlarmInToDoValidator, setAlarmInTodoController);
router.delete("/alarm", checkExpireAccessToken, removeAlarmInToDoValidator, removeAlarmInTodoController);

export default router;
