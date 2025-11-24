import { json, Router } from "express";
import pool from "../db.js";
import { protect } from "../middleware/auth.js";

const router = Router()

// Create Task
router.post('/', protect, async (req, res) => {
    try {
        const { description, completed } = req.body
        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }

        const newTask = await pool.query(
            "INSERT INTO task (description, completed, user_id) VALUES ($1, $2, $3) RETURNING *",
            [description, completed || false, req.user.id]
        );
        res.json(newTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Admin >> User
router.get('/', protect, async (req, res) => {
    try {
        let { page = 1, pageSize = 10, sort = "asc" } = req.query;

        page = parseInt(page);
        const limit = parseInt(pageSize);
        sort = sort.toLowerCase() === "desc" ? "DESC" : "ASC";

        const offset = (page - 1) * limit;

        // Admin the mighty
        const isAdmin = req.user.role === 'admin';
        let tasks, totalCount;

        if (isAdmin) {
            tasks = await pool.query(
                `SELECT * 
                 FROM task 
                 ORDER BY task_id ${sort}
                 LIMIT $1 OFFSET $2`,
                [limit, offset]
            );
            totalCount = await pool.query("SELECT COUNT(*) FROM task");
        } else {
            tasks = await pool.query(
                `SELECT * 
                 FROM task 
                 WHERE user_id = $1
                 ORDER BY task_id ${sort}
                 LIMIT $2 OFFSET $3`,
                [req.user.id, limit, offset]
            );
            totalCount = await pool.query("SELECT COUNT(*) FROM task WHERE user_id = $1", [req.user.id]);
        }

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
router.put('/:id', protect, async (req, res) => {
    try {
        const { id } = req.params
        const { description, completed } = req.body
        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }

        const isAdmin = req.user.role === 'admin';
        let updatedTask;

        if (isAdmin) {
            updatedTask = await pool.query(
                "UPDATE task SET description = $1, completed = $2 WHERE task_id = $3 RETURNING *",
                [description, completed || false, id]
            );
        } else {
            updatedTask = await pool.query(
                "UPDATE task SET description = $1, completed = $2 WHERE task_id = $3 AND user_id = $4 RETURNING *",
                [description, completed || false, id, req.user.id]
            );
        }

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
router.delete('/:id', protect, async (req, res) => {
    try {
        const { id } = req.params
        const isAdmin = req.user.role === 'admin';
        let deletedTask;

        if (isAdmin) {
            deletedTask = await pool.query(
                "DELETE FROM task WHERE task_id = $1 RETURNING *",
                [id]
            );
        } else {
            deletedTask = await pool.query(
                "DELETE FROM task WHERE task_id = $1 AND user_id = $2 RETURNING *",
                [id, req.user.id]
            );
        }

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
