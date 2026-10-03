import { STATUS_LABELS, Task } from "../types";

interface Props {
  task: Task;
  active: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, active, onEdit, onDelete }: Props) {
  const date = new Date(task.createdAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });

  return (
    <li className={`card ${task.status}${active ? " active" : ""}`}>
      <div className="card-head">
        <h3>{task.title}</h3>
        <span className={`badge ${task.status}`}>{STATUS_LABELS[task.status]}</span>
      </div>
      {task.description && <p className="desc">{task.description}</p>}
      <div className="card-foot">
        <span className="hint">Added {date}</span>
        <div className="actions">
          <button className="btn small" onClick={() => onEdit(task)}>Edit</button>
          <button className="btn small danger" onClick={() => onDelete(task)}>Delete</button>
        </div>
      </div>
    </li>
  );
}
