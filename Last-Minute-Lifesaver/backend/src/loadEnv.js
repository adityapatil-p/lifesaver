import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envFilePath = path.resolve(__dirname, '../.env')

if (process.env.NODE_ENV !== 'production') {
  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath })
    console.info(`Loaded local environment from ${envFilePath}`)
  } else {
    console.info('No local .env file found. Using environment variables.')
  }
}

const requiredEnv = ['MONGO_URI', 'JWT_SECRET']
const missingRequired = requiredEnv.filter((name) => !process.env[name] || process.env[name].trim() === '')

if (missingRequired.length > 0) {
  const message = `Missing required environment variables: ${missingRequired.join(', ')}`
  if (process.env.NODE_ENV === 'production') {
    throw new Error(message)
  }
  console.warn(message)
}

const optionalEnv = ['GEMINI_API_KEY']
const missingOptional = optionalEnv.filter((name) => !process.env[name] || process.env[name].trim() === '')

if (missingOptional.length > 0 && process.env.NODE_ENV !== 'production') {
  console.warn(`Optional environment variables not defined: ${missingOptional.join(', ')}. AI features will use fallback logic.`)
}
