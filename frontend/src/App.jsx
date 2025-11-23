import { useState } from "react"
import axios from 'axios'

function App() {

  const [description, setDescription] = useState("")
  const [todos, setTodos] = useState([])
  const [editTodo, setEditTodo] = useState(null)
  const [editedTodo, setEditedTodo] = useState("")

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/tasks", {
        description,
        completed: false
      })
      setDescription("")
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center p-4 text-white">
      <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Task App</h1>
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
      </div>
    </div>
  )
}

export default App
