import express from "express";

const router = express.Router();
import {teamsController} from '../controller/teams-controller.js';

router.get("/yourteams", teamsController.teams);

export const teamsRouter = router;