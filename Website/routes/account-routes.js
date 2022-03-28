import express from 'express';

const router = express.Router();
import {accountController} from '../controller/account-controller.js';

router.get("/", accountController.index);

export const accountRouter = router;