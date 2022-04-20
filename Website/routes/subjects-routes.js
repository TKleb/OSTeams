import express from "express";
import subjectsController from "../controller/subjects-controller.js";

const router = express.Router();

router.get("/", subjectsController.index);
router.post("/", subjectsController.subjects);
router.post("/add", subjectsController.insert);

export default router;
