import { json, Router } from "express";
import pool from "../db.js";

const router = Router()

// Create new Task
router.post('/', async (req, res) => {
    try {
        const { description, completed } = req.body
        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }

        const newTask = await pool.query(
            "INSERT INTO  task (description, completed) VALUES ($1, $2) RETURNING *",
            [description, completed || false]
        )
        res.json(newTask.rows[0])
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")

    }
})

// Get all Tasks
router.get('/', async (req, res) => {
    try {
        const allTasks = await pool.query("SELECT * from task")
        res.json(allTasks.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// Update Task
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { description, completed } = req.body
        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }
        const updatedTask = await pool.query(
            "UPDATE task SET description = $1, completed = $2 where task_id = $3 RETURNING *",
            [description, completed || false, id]
        )
        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ error: "Task not found." })
        }
        res.json({
            message: "Task was updated.",
            todo: updatedTask.rows[0]
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

// Delete Task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deletedTask = await pool.query("DELETE FROM task WHERE task_id = $1 RETURNING *", [id])
        if (deletedTask.rows.length === 0) {
            return res.status(404).json({ error: "Task not found." })
        }
        res.json("Task was deleted.")
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

export default router