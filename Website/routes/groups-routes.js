import express from "express";
import groupsController from "../controller/groups-controller.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();
router.get("/", asyncHandler(groupsController.showGroupsOfUser));
router.get("/:id", asyncHandler(groupsController.showGroupInDetail));
router.get("/edit/:id", asyncHandler(groupsController.editGroupById));
router.post("/edit/:id", asyncHandler(groupsController.updateGroup));
router.post("/leave/:id", asyncHandler(groupsController.leaveGroup));
router.post("/delete/:id", asyncHandler(groupsController.deleteGroup));
router.post("/applyTo/:id", asyncHandler(groupsController.applyToGroup));
router.post("/kickOut/:userId/:groupId", asyncHandler(groupsController.kickOutMember));
router.post("/closeApplication/:applicationId/:groupId", asyncHandler(groupsController.closeApplication));
export default router;
