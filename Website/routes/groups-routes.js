import express from "express";
import groupsController from "../controller/groups-controller.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();
router.get("/", groupsController.showByUserId);
router.get("/:id", groupsController.showGroupById);
router.post("/leave/:id", asyncHandler(groupsController.leaveGroup));
router.post("/applyTo/:id", asyncHandler(groupsController.applyToGroup));
router.post("/closeApplication/:applicationId/:groupId", asyncHandler(groupsController.closeApplication));
export default router;
