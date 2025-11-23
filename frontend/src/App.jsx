import { useEffect, useState } from "react"
import axios from 'axios'
import { MdModeEditOutline, MdOutlineDone } from 'react-icons/md'
import { FaTrash } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'

function App() {

  const [description, setDescription] = useState("")
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [editedTask, setEditedTask] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get Tasks
  const getTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get("http://localhost:5000/tasks")
      setTasks(res.data)
      console.log(res.data)
    } catch (err) {
      console.error(err.message)
      setError("Failed to fetch tasks. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTasks()
  }, [])

  // Submit Form 
  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!description.trim()) return
    try {
      setError(null)
      const res = await axios.post("http://localhost:5000/tasks", {
        description,
        completed: false
      })
      setTasks([...tasks, res.data])
      setDescription("")
    } catch (err) {
      console.error(err.message)
      setError("Failed to add task. Please try again later.")
    }
  }

  const saveEdit = async (id) => {
    try {
      setError(null)
      await axios.put(`http://localhost:5000/tasks/${id}`, {
        description: editedTask
      })
      setEditingTask(null)
      setEditedTask("")
      setTasks(tasks.map((task) => task.task_id === id ? { ...task, description: editedTask } : task))
    } catch (err) {
      console.error(err.message)
      setError("Failed to update task. Please try again later")
    }
  }

  // Delete Task
  const deleteTask = async (id) => {
    try {
      setError(null)
      await axios.delete(`http://localhost:5000/tasks/${id}`)
      setTasks(tasks.filter((task) => task.task_id !== id))
    } catch (err) {
      console.error(err.message)
      setError("Failed to delete task. Please try again later")
    }
  }

  // Toggle Completed / !Completed
  const toggleCompleted = async (id) => {
    try {
      setError(null)
      const task = tasks.find((task) => task.task_id === id)
      await axios.put(`http://localhost:5000/tasks/${id}`, {
        description: task.description,
        completed: !task.completed
      })
      setTasks(tasks.map((task) => (task.task_id === id ? { ...task, completed: !task.completed } : task)))
    } catch (err) {
      console.error(err.message)
      setError("Failed to update task. Please try again later")
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Task App</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form
          onSubmit={onSubmitForm}
          className="flex items-center gap-2 shadow-sm border p-2 rounded-lg mb-6">
          <input
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter new task..."
            required />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer">Add Task</button>
        </form>
        <div>
          {loading ? (
            <div>
              <p className="text-gray-600">Loading tasks ...</p>
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-gray-600">No tasks available, but you can always add a new one ...</p>
          ) : (
            <div className="flex flex-col gap-y-4">
              {tasks.map((task) => (

                <div key={task.task_id} className="pb-4">
                  {editingTask === task.task_id ? (
                    <div className="flex items-center gap-x-3">
                      <input
                        className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner"
                        type="text" value={editedTask} onChange={(e) => setEditedTask(e.target.value)} />
                      <div>
                        <button
                          onClick={() => saveEdit(task.task_id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 mt-2 hover:bg-green-600 duration-200"
                        >
                          <MdOutlineDone />
                        </button>
                        <button
                          onClick={() => setEditingTask(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 mt-2 hover:bg-gray-600 duration-200"
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-x-4 overflow-hidden">
                        <button
                          onClick={() => toggleCompleted(task.task_id)}
                          className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center ${task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-blue-400"}`}
                        >
                          {task.completed && <MdOutlineDone size={16} />}
                        </button>
                        <span>{task.description}</span>

                      </div>
                      <div className="flex gap-x-2">
                        <button className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"
                          onClick={() => {
                            setEditingTask(task.task_id);
                            setEditedTask(task.description)
                          }} >
                          <MdModeEditOutline />
                        </button>
                        <button
                          onClick={() => deleteTask(task.task_id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
