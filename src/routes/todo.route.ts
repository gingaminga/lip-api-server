import {
  addTodoController,
  getTodoController,
  modifyCheckTodoController,
  removeTodoController,
} from "@/controllers/todo.controller";
import { checkExpireAccessToken } from "@/middlewares/check-expire-token";
import {
  addToDoValidator,
  getToDoValidator,
  modifyCheckToDoValidator,
  removeToDoValidator,
} from "@/validators/validator/todo.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.get("/", checkExpireAccessToken, getToDoValidator, getTodoController);
router.post("/", checkExpireAccessToken, addToDoValidator, addTodoController);
router.delete("/", checkExpireAccessToken, removeToDoValidator, removeTodoController);
router.patch("/yn", checkExpireAccessToken, modifyCheckToDoValidator, modifyCheckTodoController);

export default router;
