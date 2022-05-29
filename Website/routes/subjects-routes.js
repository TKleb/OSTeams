import express from "express";
import subjectsController from "../controller/subjects-controller.js";
import groupsController from "../controller/groups-controller.js";

const router = express.Router();

router.get("/", subjectsController.subjects);
router.post("/", subjectsController.subjects);
router.get("/:abbreviation", groupsController.showGroupsOfSubject);
router.post("/:abbreviation", groupsController.addGroup);
export default router;
