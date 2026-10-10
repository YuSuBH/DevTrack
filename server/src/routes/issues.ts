import { Router } from "express";
import {
  getStats,
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} from "../controllers/issueController";

// mergeParams: true so :projectId from the parent router is accessible here
const router = Router({ mergeParams: true });

// Stats must be registered before /:id so it isn't swallowed as an id lookup
router.get("/stats", getStats);

router.get("/", getIssues);
router.get("/:id", getIssueById);
router.post("/", createIssue);
router.patch("/:id", updateIssue);
router.delete("/:id", deleteIssue);

export default router;
