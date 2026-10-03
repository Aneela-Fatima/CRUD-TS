export type Status = "todo" | "in-progress" | "done";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export type TaskInput = Pick<Task, "title" | "description" | "status">;

export const STATUS_LABELS: Record<Status, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};
