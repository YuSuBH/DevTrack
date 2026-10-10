import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Project } from "../models/Project";
import { NotFoundError } from "./errorHandler";

/**
 * Validates :projectId, fetches the project, and attaches it to req.
 * Mounted on the /api/projects/:projectId router so all nested routes
 * get the check for free.
 */
export async function resolveProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { projectId } = req.params;

  if (!mongoose.isValidObjectId(projectId)) {
    res.status(400).json({ error: "Invalid project ID" });
    return;
  }

  const project = await Project.findById(projectId).lean();
  if (!project) {
    next(new NotFoundError("Project not found"));
    return;
  }

  // Attach for use in downstream controllers
  (req as Request & { project: typeof project }).project = project;
  next();
}
