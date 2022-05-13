import express from "express";
import subjectsController from "../controller/subjects-controller.js";
import groupsController from "../controller/groups-controller.js";

const router = express.Router();

router.get("/", subjectsController.subjects);
router.post("/", subjectsController.subjects);
router.post("/add", subjectsController.insert);
router.get("/:abbreviation", groupsController.showBySubjectAbbr);
router.post("/:abbreviation", groupsController.insert);
export default router;
