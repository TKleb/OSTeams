import express from "express";
import teamsController from "../controller/teams-controller.js";
import groupController from "../controller/group-controller.js";

const router = express.Router();
router.get("/", teamsController.index);
router.get("/group", groupController.index);

export default router;
