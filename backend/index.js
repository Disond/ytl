import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import taskRoutes from './routes/tasks.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}))
app.use(cors())
app.use(express.json())

app.use('/tasks', taskRoutes)

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})