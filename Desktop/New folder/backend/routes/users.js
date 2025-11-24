import express from 'express'
import bcrypt from 'bcryptjs'
import pool from '../db.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' })
    }
    next()
}

router.get('/me', protect, async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT id, firstname, lastname, username, email, role, created_at FROM users WHERE id = $1',
            [req.user.id]
        )
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' })
        }
        res.json(user.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error.' })
    }
})

router.put('/me', protect, async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body

        if (!firstname || !lastname || !username || !email) {
            return res.status(400).json({ message: 'Please provide all required fields.' })
        }

        const emailExists = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND id != $2',
            [email, req.user.id]
        )
        if (emailExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists.' })
        }

        const usernameExists = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND id != $2',
            [username, req.user.id]
        )
        if (usernameExists.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists.' })
        }

        let updateQuery
        let updateValues

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            updateQuery = `
                UPDATE users 
                SET firstname = $1, lastname = $2, username = $3, email = $4, password = $5
                WHERE id = $6
                RETURNING id, firstname, lastname, username, email, role, created_at
            `
            updateValues = [firstname, lastname, username, email, hashedPassword, req.user.id]
        } else {
            updateQuery = `
                UPDATE users 
                SET firstname = $1, lastname = $2, username = $3, email = $4
                WHERE id = $5
                RETURNING id, firstname, lastname, username, email, role, created_at
            `
            updateValues = [firstname, lastname, username, email, req.user.id]
        }

        const updatedUser = await pool.query(updateQuery, updateValues)

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' })
        }

        res.json(updatedUser.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error.' })
    }
})

router.get('/', protect, isAdmin, async (req, res) => {
    try {
        const users = await pool.query(
            'SELECT id, firstname, lastname, username, email, role, created_at FROM users ORDER BY created_at DESC'
        )
        res.json(users.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error.' })
    }
})

router.put('/:id', protect, isAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const { firstname, lastname, username, email, password, role } = req.body

        if (!firstname || !lastname || !username || !email || !role) {
            return res.status(400).json({ message: 'Please provide all required fields.' })
        }

        const emailExists = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND id != $2',
            [email, id]
        )
        if (emailExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists.' })
        }

        const usernameExists = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND id != $2',
            [username, id]
        )
        if (usernameExists.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists.' })
        }

        let updateQuery
        let updateValues

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            updateQuery = `
                UPDATE users 
                SET firstname = $1, lastname = $2, username = $3, email = $4, password = $5, role = $6
                WHERE id = $7
                RETURNING id, firstname, lastname, username, email, role, created_at
            `
            updateValues = [firstname, lastname, username, email, hashedPassword, role, id]
        } else {
            updateQuery = `
                UPDATE users 
                SET firstname = $1, lastname = $2, username = $3, email = $4, role = $5
                WHERE id = $6
                RETURNING id, firstname, lastname, username, email, role, created_at
            `
            updateValues = [firstname, lastname, username, email, role, id]
        }

        const updatedUser = await pool.query(updateQuery, updateValues)

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' })
        }

        res.json(updatedUser.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error.' })
    }
})

export default router

