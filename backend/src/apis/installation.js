import express from "express";
const router = express.Router();
import installationController from "../controller/InstallationController.js";
router.use(express.json());
router.get(
  "/repositories",
  installationController.getRepositoriesManagedByInstallation
);

export default router;
