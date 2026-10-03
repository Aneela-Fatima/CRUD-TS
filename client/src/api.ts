import type { Task, TaskInput } from "./types";

const BASE: string = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new Error("Can't reach the server. Check that it is running.");
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `Request failed (${res.status}).`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  list: () => request<Task[]>("/tasks"),
  create: (data: TaskInput) =>
    request<Task>("/tasks", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: TaskInput) =>
    request<Task>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/tasks/${id}`, { method: "DELETE" }),
};
