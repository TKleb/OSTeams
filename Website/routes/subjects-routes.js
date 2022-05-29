import express from "express";
import subjectsController from "../controller/subjects-controller.js";
import groupsController from "../controller/groups-controller.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(subjectsController.index));
router.get("/:abbreviation", asyncHandler(groupsController.showGroupsOfSubject));
router.post("/:abbreviation", asyncHandler(groupsController.addGroup));
export default router;
