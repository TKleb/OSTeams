import express from "express";
import { accountController } from "../controller/account-controller.js";

const router = express.Router();
router.get("/", accountController.index);
router.get("/login", accountController.login);
router.get("/forgot", accountController.forgotPw);
router.get("/register", accountController.register);

export const accountRouter = router;