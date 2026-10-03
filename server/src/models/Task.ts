import { Schema, model } from "mongoose";

export const STATUSES = ["todo", "in-progress", "done"] as const;
export type Status = (typeof STATUSES)[number];

export interface ITask {
  title: string;
  description: string;
  status: Status;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    status: { type: String, enum: STATUSES, default: "todo" },
  },
  { timestamps: true }
);

export default model<ITask>("Task", taskSchema);
