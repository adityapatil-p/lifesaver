import './loadEnv.js'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connectDB from './config/db.js'

// Import routes
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'

console.log("Gemini:", process.env.GEMINI_API_KEY);
// Connect to Database

connectDB();

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Request logging in development mode
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'LifeSaver Backend is up and running' })
})

// Route Mounting
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/analytics', analyticsRoutes)

// Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  console.error('Unhandled Error:', err.message, err.stack)
  res.status(statusCode).json({
    success: false,
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})
app.get("/gemini-test", async (req, res) => {
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent("Say hello");

    res.json({
      success: true,
      text: result.response.text(),
    });
  } catch (e) {
  console.error("FULL ERROR:");
  console.error(e);
  console.error("CAUSE:");
  console.error(e.cause);

  res.status(500).json({
    success: false,
    error: e.message,
    cause: e.cause?.message,
    code: e.cause?.code,
  });
}
});