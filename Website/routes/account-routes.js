import express from "express";
import accountController from "../controller/account-controller.js";
import registerController from "../controller/register-controller.js";
import loginController from "../controller/login-controller.js";
import { isAuthenticated, isUnauthenticated } from "../middleware/auth.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();
router.get("/", isAuthenticated, accountController.index);
router.get("/edit", isAuthenticated, accountController.edit);
router.get("/logout", isAuthenticated, accountController.logout);
router.get("/login", isUnauthenticated, loginController.index);
router.get("/register", isUnauthenticated, registerController.index);
router.get("/verifyEmail", isUnauthenticated, asyncHandler(registerController.verifyMail));

router.post("/login", isUnauthenticated, asyncHandler(loginController.login));
router.post("/register", isUnauthenticated, asyncHandler(registerController.register));

export default router;
