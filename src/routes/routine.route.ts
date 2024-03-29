import {
  addRoutineController,
  getAllRoutineController,
  getRoutineController,
  modifyCheckRoutineToDoController,
  modifyRoutineController,
  removeAllRoutineController,
  removeRoutineController,
} from "@/controllers/routine.controller";
import { checkExpireAccessToken } from "@/middlewares/check-expire-token";
import {
  addRoutineValidator,
  getAllRoutineValidator,
  getRoutineValidator,
  modifyCheckRoutineToDoValidator,
  modifyRoutineValidator,
  removeRoutineValidator,
} from "@/validators/validator/routine.validator";
import { Router } from "express";
import asyncify from "express-asyncify";

const router = asyncify(Router());

router.get("/all", checkExpireAccessToken, getAllRoutineValidator, getAllRoutineController);
router.get("/", checkExpireAccessToken, getRoutineValidator, getRoutineController);
router.post("/", checkExpireAccessToken, addRoutineValidator, addRoutineController);
router.put("/", checkExpireAccessToken, modifyRoutineValidator, modifyRoutineController);
router.delete("/", checkExpireAccessToken, removeRoutineValidator, removeRoutineController);
router.delete("/all", checkExpireAccessToken, removeAllRoutineController);
router.put("/yn", checkExpireAccessToken, modifyCheckRoutineToDoValidator, modifyCheckRoutineToDoController);

export default router;
