import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { useAuth } from "../context/authContext";
import api from "../api/api";

export default function Tasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [sort, setSort] = useState("asc");
    const [total, setTotal] = useState(0);

    const getTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/api/tasks", { params: { page, pageSize, sort } });
            setTasks(res.data.data);
            setTotal(res.data.total);
        } catch (err) {
            setError("Failed to fetch tasks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) getTasks();
    }, [page, sort, user]);

    const addTask = async (description) => {
        try {
            await api.post("/api/tasks", { description, completed: false });
            getTasks();
        } catch {
            setError("Failed to add task.");
        }
    };

    const saveEdit = async (id) => {
        const task = tasks.find((t) => t.task_id === id);
        if (!task) return;
        const trimmed = editedTask.trim();
        if (task.description === trimmed) {
            setEditingTask(null);
            setEditedTask("");
            return;
        }
        try {
            await api.put(`/api/tasks/${id}`, { description: trimmed });
            setEditingTask(null);
            setEditedTask("");
            getTasks();
        } catch {
            setError("Failed to update task.");
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/api/tasks/${id}`);
            getTasks();
        } catch {
            setError("Failed to delete task.");
        }
    };

    const toggleCompleted = async (id) => {
        const task = tasks.find((t) => t.task_id === id);
        if (!task) return;
        try {
            await api.put(`/api/tasks/${id}`, {
                description: task.description,
                completed: !task.completed,
            });
            setTasks(tasks.map((t) => (t.task_id === id ? { ...t, completed: !t.completed } : t)));
        } catch {
            setError("Failed to update task.");
        }
    };

    if (!user) return <p className="text-center mt-10">Login to see your tasks</p>;

    return (
        <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4">
            <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg p-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Tasks</h1>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                {user.role !== "admin" && (
                    <TaskForm onAdd={addTask} />
                )}
                {loading ? (
                    <p className="text-gray-600">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p className="text-gray-600">No tasks available.</p>
                ) : (
                    <div className="flex flex-col gap-y-4">
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.task_id}
                                task={task}
                                editingTask={editingTask}
                                editedTask={editedTask}
                                setEditingTask={setEditingTask}
                                setEditedTask={setEditedTask}
                                onSaveEdit={saveEdit}
                                onDelete={deleteTask}
                                onToggleCompleted={toggleCompleted}
                            />
                        ))}
                        <div className="flex justify-between mt-6">
                            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-900 shadow-lg text-white rounded disabled:opacity-50">Previous</button>
                            <span className="text-gray-800 py-2">Page {page} of {Math.ceil(total / pageSize)}</span>
                            <button disabled={page * pageSize >= total} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-gray-900 shadow-lg text-white rounded disabled:opacity-50">Next</button>
                            <button onClick={() => setSort(sort === "asc" ? "desc" : "asc")} className="px-4 py-2 bg-gray-900 shadow-lg text-white rounded">Sort: {sort.toUpperCase()}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
