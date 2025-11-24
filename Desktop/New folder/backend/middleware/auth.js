import jwt from 'jsonwebtoken'
import pool from '../db.js'

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ message: 'Not authorized.' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await pool.query('SELECT id, firstname, lastname, username, email, role FROM users WHERE id = $1', [decoded.id])

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Not authorized, user not found.' })
        }

        req.user = user.rows[0]
        next()

    } catch (error) {
        console.error(error)
        return res.status(401).json({ message: 'Not authorized.' })
    }
}