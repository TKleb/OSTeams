import express from "express";
import groupsController from "../controller/groups-controller.js";

const router = express.Router();
router.get("/", groupsController.showByUserId);
router.get("/:id", groupsController.showGroupById);
export default router;
