import { Request, Response, NextFunction } from "express";
import { Issue, IssueStatus, IssuePriority } from "../models/Issue";
import { NotFoundError } from "../middleware/errorHandler";

// GET /api/projects/:projectId/issues/stats
export async function getStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { projectId } = req.params;

    const [total, open, inProgress, closed] = await Promise.all([
      Issue.countDocuments({ project: projectId }),
      Issue.countDocuments({ project: projectId, status: "Open" }),
      Issue.countDocuments({ project: projectId, status: "In Progress" }),
      Issue.countDocuments({ project: projectId, status: "Closed" }),
    ]);

    res.status(200).json({ data: { total, open, inProgress, closed } });
  } catch (err) {
    next(err);
  }
}

// GET /api/projects/:projectId/issues
export async function getIssues(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { projectId } = req.params;
    const { search, status, priority } = req.query;

    const filter: Record<string, unknown> = { project: projectId };

    if (typeof search === "string" && search.trim() !== "") {
      filter.title = { $regex: search.trim(), $options: "i" };
    }
    if (typeof status === "string" && status.trim() !== "") {
      filter.status = status.trim() as IssueStatus;
    }
    if (typeof priority === "string" && priority.trim() !== "") {
      filter.priority = priority.trim() as IssuePriority;
    }

    const issues = await Issue.find(filter).sort({ createdAt: -1 }).lean();
    res.status(200).json({ data: issues });
  } catch (err) {
    next(err);
  }
}

// GET /api/projects/:projectId/issues/:id
export async function getIssueById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const issue = await Issue.findOne({
      _id: req.params.id,
      project: req.params.projectId,
    }).lean();

    if (!issue) throw new NotFoundError("Issue not found");
    res.status(200).json({ data: issue });
  } catch (err) {
    next(err);
  }
}

// POST /api/projects/:projectId/issues
export async function createIssue(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, description, status, priority, labels } = req.body;

    const issue = await Issue.create({
      project: req.params.projectId,
      title,
      description,
      status,
      priority,
      labels,
    });

    res.status(201).json({ data: issue });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/projects/:projectId/issues/:id
export async function updateIssue(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, description, status, priority, labels } = req.body;

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (labels !== undefined) updates.labels = labels;

    const issue = await Issue.findOneAndUpdate(
      { _id: req.params.id, project: req.params.projectId },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!issue) throw new NotFoundError("Issue not found");
    res.status(200).json({ data: issue });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/projects/:projectId/issues/:id
export async function deleteIssue(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const issue = await Issue.findOneAndDelete({
      _id: req.params.id,
      project: req.params.projectId,
    }).lean();

    if (!issue) throw new NotFoundError("Issue not found");
    res.status(200).json({ message: "Issue deleted" });
  } catch (err) {
    next(err);
  }
}
