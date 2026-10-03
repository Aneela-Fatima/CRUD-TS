import { FormEvent, useState } from "react";
import { STATUS_LABELS, Status, Task, TaskInput } from "../types";

interface Props {
  editing: Task | null;
  onSubmit: (input: TaskInput) => Promise<void>;
  onCancel: () => void;
}

export default function TaskForm({ editing, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [status, setStatus] = useState<Status>(editing?.status ?? "todo");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give the task a title.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSubmit({ title, description, status });
      if (!editing) {
        setTitle("");
        setDescription("");
        setStatus("todo");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="panel form" onSubmit={handleSubmit} noValidate>
      <h2>{editing ? "Edit task" : "New task"}</h2>

      <label>
        Title
        <input
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Finish image processing lab"
          autoFocus
        />
      </label>

      <label>
        Notes
        <textarea
          value={description}
          maxLength={500}
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Anything you want to remember"
        />
        <span className="hint">{description.length}/500</span>
      </label>

      <label>
        Status
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="error" role="alert">{error}</p>}

      <div className="actions">
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? "Saving…" : editing ? "Save changes" : "Add task"}
        </button>
        {editing && (
          <button type="button" className="btn" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
