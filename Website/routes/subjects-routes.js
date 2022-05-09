import express from "express";
import subjectsController from "../controller/subjects-controller.js";
import groupListController from "../controller/grouplist-controller.js";

const router = express.Router();

router.get("/", subjectsController.subjects);
router.post("/", subjectsController.subjects);
router.post("/add", subjectsController.insert);
router.get("/:abbreviation", groupListController.index);

export default router;
