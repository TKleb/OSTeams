import express from "express";
import indexController from "../controller/index-controller.js";

const router = express.Router();
router.get("/", indexController.index);

export default router;
