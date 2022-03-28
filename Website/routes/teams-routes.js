import express from 'express';

const router = express.Router();
import {teamsController} from '../controller/teams-controller.js';

router.get("/", teamsController.index);

export const teamsRouter = router;