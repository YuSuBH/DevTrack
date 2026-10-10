import { Request, Response, NextFunction } from "express";
import { Project } from "../models/Project";
import { Issue } from "../models/Issue";
import { NotFoundError } from "../middleware/errorHandler";

// GET /api/projects
export async function getProjects(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ data: projects });
  } catch (err) {
    next(err);
  }
}

// GET /api/projects/:projectId
export async function getProjectById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const project = await Project.findById(req.params.projectId).lean();
    if (!project) throw new NotFoundError("Project not found");
    res.status(200).json({ data: project });
  } catch (err) {
    next(err);
  }
}

// POST /api/projects
export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ name, description });
    res.status(201).json({ data: project });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/projects/:projectId
export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, description } = req.body;

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!project) throw new NotFoundError("Project not found");
    res.status(200).json({ data: project });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/projects/:projectId
// Cascades: deletes all issues belonging to the project first.
export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const project = await Project.findByIdAndDelete(req.params.projectId).lean();
    if (!project) throw new NotFoundError("Project not found");

    await Issue.deleteMany({ project: req.params.projectId });

    res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
}
