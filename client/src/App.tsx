import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import TaskCard from "./components/TaskCard";
import TaskForm from "./components/TaskForm";
import { STATUS_LABELS, Status, Task, TaskInput } from "./types";

type Filter = "all" | Status;

const errorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : "Something went wrong.";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Task | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks(await api.list());
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(input: TaskInput) {
    if (editing) {
      const updated = await api.update(editing._id, input);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setEditing(null);
    } else {
      const created = await api.create(input);
      setTasks((prev) => [created, ...prev]);
    }
  }

  async function remove(task: Task) {
    if (!window.confirm(`Delete "${task.title}"? This can't be undone.`)) return;
    try {
      await api.remove(task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      if (editing?._id === task._id) setEditing(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: tasks.length, todo: 0, "in-progress": 0, done: 0 };
    tasks.forEach((t) => c[t.status]++);
    return c;
  }, [tasks]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        (filter === "all" || t.status === filter) &&
        (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    );
  }, [tasks, filter, query]);

  const filters: Filter[] = ["all", "todo", "in-progress", "done"];

  return (
    <div className="shell">
      <header>
        <h1>Task board</h1>
        <p>{counts.done} of {counts.all} done</p>
      </header>

      <main>
        <aside>
          <TaskForm
            key={editing?._id ?? "new"}
            editing={editing}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        </aside>

        <section>
          <div className="toolbar">
            <div className="segmented" role="tablist" aria-label="Filter by status">
              {filters.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  className={filter === f ? "on" : ""}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : STATUS_LABELS[f]} <b>{counts[f]}</b>
                </button>
              ))}
            </div>
            <input
              type="search"
              className="search"
              placeholder="Search tasks"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search tasks"
            />
          </div>

          {error && (
            <div className="banner" role="alert">
              <span>{error}</span>
              <button className="btn small" onClick={() => void load()}>Try again</button>
            </div>
          )}

          {loading ? (
            <p className="empty">Loading tasks…</p>
          ) : visible.length === 0 ? (
            <p className="empty">
              {tasks.length === 0
                ? "No tasks yet. Add your first one from the form."
                : "No tasks match this filter."}
            </p>
          ) : (
            <ul className="list">
              {visible.map((t) => (
                <TaskCard
                  key={t._id}
                  task={t}
                  active={editing?._id === t._id}
                  onEdit={setEditing}
                  onDelete={(task) => void remove(task)}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
