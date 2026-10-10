import { Request, Response, NextFunction } from "express";
import { Issue, IssueStatus, IssuePriority } from "../models/Issue";
import { NotFoundError } from "../middleware/errorHandler";

// GET /api/issues/stats
export async function getStats(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [total, open, inProgress, closed] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: "Open" }),
      Issue.countDocuments({ status: "In Progress" }),
      Issue.countDocuments({ status: "Closed" }),
    ]);

    res.status(200).json({ data: { total, open, inProgress, closed } });
  } catch (err) {
    next(err);
  }
}

// GET /api/issues
export async function getIssues(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, status, priority } = req.query;

    // Build filter object
    const filter: Record<string, unknown> = {};

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

// GET /api/issues/:id
export async function getIssueById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const issue = await Issue.findById(req.params.id).lean();
    if (!issue) throw new NotFoundError("Issue not found");

    res.status(200).json({ data: issue });
  } catch (err) {
    next(err);
  }
}

// POST /api/issues
export async function createIssue(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, description, status, priority, labels } = req.body;

    const issue = await Issue.create({ title, description, status, priority, labels });

    res.status(201).json({ data: issue });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/issues/:id
export async function updateIssue(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title, description, status, priority, labels } = req.body;

    // Build only the fields that were supplied
    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (labels !== undefined) updates.labels = labels;

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!issue) throw new NotFoundError("Issue not found");

    res.status(200).json({ data: issue });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/issues/:id
export async function deleteIssue(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id).lean();
    if (!issue) throw new NotFoundError("Issue not found");

    res.status(200).json({ message: "Issue deleted" });
  } catch (err) {
    next(err);
  }
}
