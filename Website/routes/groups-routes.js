import express from "express";
import groupsController from "../controller/groups-controller.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();
router.get("/", asyncHandler(groupsController.showByUserId));
router.get("/:id", asyncHandler(groupsController.showGroupById));
router.post("/leave/:id", asyncHandler(groupsController.leaveGroup));
router.post("/delete/:id", asyncHandler(groupsController.deleteGroup));
router.post("/applyTo/:id", asyncHandler(groupsController.applyToGroup));
router.post("/closeApplication/:applicationId/:groupId", asyncHandler(groupsController.closeApplication));
export default router;
