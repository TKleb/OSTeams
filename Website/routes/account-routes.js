import express from "express";
import { accountController } from "../controller/account-controller.js";

const router = express.Router();
router.get("/", accountController.index);

export const accountRouter = router;
