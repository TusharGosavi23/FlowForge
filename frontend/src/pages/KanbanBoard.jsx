
import { useEffect, useState } from "react";
import { taskService } from "../services/taskService";
import { projectService } from "../services/projectService";
import {
  CircleDot,
  Clock,
  CheckCircle2,
  ListTodo,
  RefreshCw,
} from "lucide-react";

const columns = [
  { id: "TODO", title: "To Do", icon: ListTodo },
  { id: "IN_PROGRESS", title: "In Progress", icon: Clock },
  { id: "IN_REVIEW", title: "In Review", icon: CircleDot },
  { id: "COMPLETED", title: "Completed", icon: CheckCircle2 },
];

const priorityStyles = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-red-100 text-red-700",
};

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const projectData = await projectService.getAll();
      setProjects(projectData);

      const taskData = await Promise.all(
        projectData.map((project) =>
          taskService.getByProject(project.id)
        )
      );

      setTasks(taskData.flat());
    } catch (err) {
      setError(err.message || "Failed to load board.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTasks =
    selectedProject === "ALL"
      ? tasks
      : tasks.filter(
          (task) => String(task.projectId) === String(selectedProject)
        );

  const moveTask = async (task, newStatus) => {
    if (task.status === newStatus || updating) return;

    setUpdating(true);
    setError("");

    try {
      await taskService.update(task.id, {
        title: task.title,
        description: task.description || "",
        status: newStatus,
        priority: task.priority,
        assignedToEmail: task.assignedToEmail || "",
        dueDate: task.dueDate || null,
      });

      setTasks((prev) =>
        prev.map((item) =>
          item.id === task.id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update task.");
    } finally {
      setUpdating(false);
      setDraggedTask(null);
    }
  };

  const getProjectName = (projectId) =>
    projects.find((project) => String(project.id) === String(projectId))
      ?.name || "Unknown Project";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading Kanban Board...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Kanban Board
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Drag and drop tasks to update their workflow status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <button
            onClick={loadData}
            className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
            title="Refresh board"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter(
            (task) => task.status === column.id
          );
          const Icon = column.icon;

          return (
            <div
              key={column.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedTask) moveTask(draggedTask, column.id);
              }}
              className="min-h-[450px] rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-slate-500" />
                  <h2 className="font-semibold text-slate-800">
                    {column.title}
                  </h2>
                </div>

                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable={!updating}
                    onDragStart={() => setDraggedTask(task)}
                    onDragEnd={() => setDraggedTask(null)}
                    className={`cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md active:cursor-grabbing ${
                      draggedTask?.id === task.id
                        ? "opacity-40"
                        : ""
                    }`}
                  >
                    <h3 className="font-medium text-slate-900">
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          priorityStyles[task.priority] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {task.priority || "MEDIUM"}
                      </span>
                    </div>

                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <p className="text-xs text-slate-500">
                        {getProjectName(task.projectId)}
                      </p>

                      {task.assignedToEmail && (
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {task.assignedToEmail}
                        </p>
                      )}

                      {task.dueDate && (
                        <p className="mt-1 text-xs text-slate-500">
                          Due: {task.dueDate}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {updating && (
        <p className="text-center text-sm text-slate-500">
          Updating task status...
        </p>
      )}
    </div>
  );
}

export default KanbanBoard;
