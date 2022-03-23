import express from 'express';

const router = express.Router();
import {loginController} from '../controller/login-controller.js';

router.get("/account/login", loginController.login);
router.get("/account/forgot", loginController.forgotPw)
router.get("/account/register", loginController.register)

export const loginRouter = router;