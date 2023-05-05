import oauthRoute from "@/routes/oauth.route";
import userRoute from "@/routes/user.route";
import { Router } from "express";

const router = Router();

router.use("/oauth", oauthRoute);
router.use("/user", userRoute);

export default router;
