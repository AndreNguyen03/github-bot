import express from "express";
const router = express.Router();
import BotController from "../controller/BotController.js";
router.use(express.json());
router.post("/newconfig", BotController.pushConfigFileToGithub);

export default router;
