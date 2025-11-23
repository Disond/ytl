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
            "INSERT INTO task (description, completed) VALUES ($1, $2) RETURNING *",
            [description, completed || false]
        );
        res.json(newTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// UPDATED GET ALL TASKS — Pagination + Sorting
router.get('/', async (req, res) => {
    try {
        // Read query params
        // let { page = 1, limit = params.pageSize, sort = "asc" } = req.query;

        let { page = 1, pageSize = 10, sort = "asc" } = req.query;

        page = parseInt(page);
        const limit = parseInt(pageSize);
        sort = sort.toLowerCase() === "desc" ? "DESC" : "ASC";

        // page = parseInt(page);
        // limit = parseInt(limit);
        // sort = sort.toLowerCase() === "desc" ? "DESC" : "ASC";  // validate user input

        const offset = (page - 1) * limit;

        // Get paginated tasks with sorting
        const tasks = await pool.query(
            `SELECT * 
             FROM task 
             ORDER BY task_id ${sort}
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        // Get total for pagination UI
        const totalCount = await pool.query("SELECT COUNT(*) FROM task");

        res.json({
            data: tasks.rows,
            total: parseInt(totalCount.rows[0].count),
            page,
            limit,
            totalPages: Math.ceil(totalCount.rows[0].count / limit),
            sort: sort.toLowerCase(),
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Update Task
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { description, completed } = req.body
        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }
        const updatedTask = await pool.query(
            "UPDATE task SET description = $1, completed = $2 WHERE task_id = $3 RETURNING *",
            [description, completed || false, id]
        );
        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ error: "Task not found." });
        }
        res.json({
            message: "Task was updated.",
            todo: updatedTask.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Delete Task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deletedTask = await pool.query(
            "DELETE FROM task WHERE task_id = $1 RETURNING *",
            [id]
        );
        if (deletedTask.rows.length === 0) {
            return res.status(404).json({ error: "Task not found." });
        }
        res.json("Task was deleted.");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

export default router;
