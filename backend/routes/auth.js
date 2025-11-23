import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
}

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// Register
router.post('/register', async (req, res) => {

    const { firstname, lastname, username, email, password, role } = req.body  

    if (!firstname || !lastname || !username || !email || !password || !role) {
        return res.status(400).json({ message: "Please provide all required fields." })
    }

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (userExists.rows.length > 0) {
        return res.status(400).json({ message: "User already exists." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await pool.query(
        `INSERT INTO users (firstname, lastname, username, email, password, role)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, firstname, lastname, username, email, role, created_at`,
        [firstname, lastname, username, email, hashedPassword, role]
    )

    const token = generateToken(newUser.rows[0].id)

    res.cookie('token', token, cookieOptions)

    return res.status(201).json({ user: newUser.rows[0], token })
})

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' })
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials.' })
    }

    const userData = user.rows[0]

    const isMatch = await bcrypt.compare(password, userData.password)

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' })
    }

    const token = generateToken(userData.id)

    res.cookie('token', token, cookieOptions)

    res.json({
        user: {
            id: userData.id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            username: userData.username,
            email: userData.email,
            role: userData.role
        },
        token
    })
})

// auth check
router.get('/me', protect, async (req, res) => {
    // req.user from protect middleware
    res.json(req.user)
})

// Logout
router.post('/logout', (req, res) => {
    res.cookie('token', '', { ...cookieOptions, maxAge: 1 })
    res.json({ message: 'Logged out successfully' })
})

export default router
