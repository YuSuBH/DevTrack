import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";

interface FieldErrors {
  [field: string]: string;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Mongoose validation error → 400 with per-field messages
  if (err instanceof MongooseError.ValidationError) {
    const details: FieldErrors = {};
    for (const field of Object.keys(err.errors)) {
      details[field] = err.errors[field].message;
    }
    res.status(400).json({ error: "Validation failed", details });
    return;
  }

  // Mongoose CastError (e.g. invalid ObjectId) → 400
  if (err instanceof MongooseError.CastError) {
    res.status(400).json({ error: "Invalid issue ID" });
    return;
  }

  // Explicit "not found" sentinel thrown in controllers
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }

  // Unknown errors → 500, no stack trace in response
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "An unexpected error occurred" });
}

// Lightweight sentinel for 404 cases
export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.name = "NotFoundError";
  }
}
