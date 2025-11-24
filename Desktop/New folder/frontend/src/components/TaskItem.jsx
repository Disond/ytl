import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../context/authContext";

export default function TaskItem({
    task,
    editingTask,
    editedTask,
    setEditingTask,
    setEditedTask,
    onSaveEdit,
    onDelete,
    onToggleCompleted,
}) {
    const { user } = useAuth();
    console.log("user", user)
    return (
        <div key={task.task_id} className="pb-4">
            {editingTask === task.task_id ? (
                <div className="flex items-center gap-x-3">
                    <input
                        type="text"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        className="flex-1 p-3 border rounded-lg outline-none text-gray-700"
                    />
                    <div>
                        <button
                            onClick={() => onSaveEdit(task.task_id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 hover:bg-green-600"
                        >
                            <MdOutlineDone />
                        </button>
                        <button
                            onClick={() => setEditingTask(null)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            <IoClose />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-4">
                        <button
                            onClick={() => onToggleCompleted(task.task_id)}
                            className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center ${task.completed
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "border-gray-300 hover:border-blue-400"
                                }`}
                        >
                            {task.completed && <MdOutlineDone size={16} />}
                        </button>
                        <span>{task.description}</span>
                    </div>
                    
                    <div className="flex gap-x-2">
                        <button
                            onClick={() => {
                                setEditingTask(task.task_id);
                                setEditedTask(task.description);
                            }}
                            className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50"
                        >
                            <MdModeEditOutline />
                        </button>
                        {user.role !== "admin" && (
                        <button
                            onClick={() => onDelete(task.task_id)}
                            className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                        >
                            <FaTrash />
                        </button>)}
                    </div>
                </div>
            )}
        </div>
    );
}
