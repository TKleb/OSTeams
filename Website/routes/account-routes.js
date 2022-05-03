import express from "express";
import accountController from "../controller/account-controller.js";
import registerController from "../controller/register-controller.js";
import loginController from "../controller/login-controller.js";
import forgotPwController from "../controller/forgotpw-controller.js";
import auth from "../middleware/auth.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();
router.get("/", auth, accountController.index);
router.get("/logout", accountController.logout);
router.get("/login", loginController.index);
router.get("/forgot", forgotPwController.index);
router.get("/register", registerController.index);
router.get("/verifyEmail", registerController.verifyMail);
router.get("/edit", accountController.edit);

router.post("/login", asyncHandler(loginController.login));
router.post("/forgot", forgotPwController.forgotPassword);
router.post("/register", asyncHandler(registerController.register));

export default router;
