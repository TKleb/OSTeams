import express from "express";
import { teamsController } from "../controller/teams-controller.js";

const router = express.Router();
router.get("/", teamsController.index);

export const teamsRouter = router;
