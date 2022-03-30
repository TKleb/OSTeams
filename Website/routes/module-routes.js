import express from "express";
import { moduleController } from "../controller/module-controller.js";

const router = express.Router();

router.get("/", moduleController.index);
router.post("/", moduleController.module);

export const moduleRouter = router;
