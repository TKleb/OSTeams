import express from "express";
import { subjectsController } from "../controller/subjects-controller.js";
import { groupController } from "../controller/group-controller.js";

const router = express.Router();

router.get("/", subjectsController.subjects);
router.post("/", subjectsController.subjects);
router.post("/add", subjectsController.insert);
router.get("/:abbreviation", groupController.index);

export const subjectsRouter = router;
