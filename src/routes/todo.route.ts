import { addTodoController, getTodoController, removeTodoController } from "@/controllers/todo.controller";
import { checkExpireAccessToken } from "@/middlewares/check-expire-token";
import { addToDoValidator, getToDoValidator, removeToDoValidator } from "@/validators/validator/todo.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.get("/", checkExpireAccessToken, getToDoValidator, getTodoController);
router.post("/", checkExpireAccessToken, addToDoValidator, addTodoController);
router.delete("/", checkExpireAccessToken, removeToDoValidator, removeTodoController);

export default router;
