import authRoute from "@/routes/auth.route";
import userRoute from "@/routes/user.route";
import { Router } from "express";

const router = Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);

export default router;
