import express from "express";

const router = express.Router();
import {moduleController} from '../controller/module-controller.js';

router.get("/module", moduleController.default);
router.post("/module", moduleController.module);

export const moduleRouter = router;