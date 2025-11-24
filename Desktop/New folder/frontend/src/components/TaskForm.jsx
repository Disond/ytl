import { useState } from "react";

export default function TaskForm({ onAdd }) {
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description.trim()) return;
        onAdd(description);
        setDescription("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 shadow-sm border p-2 rounded-lg mb-6"
        >
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter new task..."
                className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
                required
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium">
                Add Task
            </button>
        </form>
    );
}
