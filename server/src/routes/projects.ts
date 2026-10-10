import { Router } from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import { resolveProject } from "../middleware/resolveProject";
import issueRoutes from "./issues";

const router = Router();

// Project CRUD
router.get("/", getProjects);
router.post("/", createProject);
router.get("/:projectId", getProjectById);
router.patch("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);

// Nested issue routes — mergeParams lets issue router see :projectId
router.use("/:projectId/issues", resolveProject, issueRoutes);

export default router;
