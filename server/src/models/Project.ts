import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [1, "Name must be at least 1 character"],
      maxlength: [80, "Name must be 80 characters or fewer"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [300, "Description must be 300 characters or fewer"],
    },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", projectSchema);
