import { Schema, model, Document } from "mongoose";

export type IssueStatus = "Open" | "In Progress" | "Closed";
export type IssuePriority = "Low" | "Medium" | "High" | "Critical";

export interface IIssue extends Document {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<IIssue>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title must be at least 1 character"],
      maxlength: [100, "Title must be 100 characters or fewer"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description must be 500 characters or fewer"],
    },
    status: {
      type: String,
      enum: {
        values: ["Open", "In Progress", "Closed"],
        message: "Status must be Open, In Progress, or Closed",
      },
      required: [true, "Status is required"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High", "Critical"],
        message: "Priority must be Low, Medium, High, or Critical",
      },
      required: [true, "Priority is required"],
      default: "Low",
    },
    labels: {
      type: [String],
      default: [],
      validate: {
        validator(arr: string[]) {
          return (
            arr.length <= 10 &&
            arr.every((l) => typeof l === "string" && l.trim().length > 0 && l.trim().length <= 30)
          );
        },
        message: "Labels must be 1–30 characters each, with a maximum of 10 labels",
      },
    },
  },
  { timestamps: true }
);

export const Issue = model<IIssue>("Issue", issueSchema);
