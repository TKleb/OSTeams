import express from "express";
import { loginController } from "../controller/login-controller.js";

const router = express.Router();
router.get("/account/login", loginController.login);
router.get("/account/forgot", loginController.forgotPw);
router.get("/account/register", loginController.register);

export const loginRouter = router;
