import express from 'express';

const router = express.Router();
import {accountController} from '../controller/account-controller.js';

router.get("/account", accountController.account);

export const accountRouter = router;