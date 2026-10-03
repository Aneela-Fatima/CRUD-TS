import { Router } from "express";
import { isValidObjectId } from "mongoose";
import Task, { ITask, STATUSES, Status } from "../models/Task";

const router = Router();

type Validation = { error: string } | { data: ITask };

function validate(body: unknown): Validation {
  const b = (body ?? {}) as Record<string, unknown>;
  const title = typeof b.title === "string" ? b.title.trim() : "";
  const description = typeof b.description === "string" ? b.description.trim() : "";
  const status = b.status ?? "todo";

  if (!title) return { error: "Title is required." };
  if (title.length > 100) return { error: "Title must be 100 characters or fewer." };
  if (description.length > 500) return { error: "Description must be 500 characters or fewer." };
  if (!STATUSES.includes(status as Status)) return { error: "Status must be todo, in-progress or done." };

  return { data: { title, description, status: status as Status } };
}

router.get("/", async (_req, res) => {
  res.json(await Task.find().sort({ createdAt: -1 }));
});

router.post("/", async (req, res) => {
  const result = validate(req.body);
  if ("error" in result) return res.status(400).json({ message: result.error });
  res.status(201).json(await Task.create(result.data));
});

router.put("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid task id." });
  const result = validate(req.body);
  if ("error" in result) return res.status(400).json({ message: result.error });

  const task = await Task.findByIdAndUpdate(req.params.id, result.data, {
    new: true,
    runValidators: true,
  });
  if (!task) return res.status(404).json({ message: "Task not found." });
  res.json(task);
});

router.delete("/:id", async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid task id." });
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });
  res.status(204).send();
});

export default router;
