import mongoose from 'mongoose'

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri || mongoUri.trim() === '') {
    throw new Error('MONGO_URI environment variable is required to connect to MongoDB.')
  }

  mongoose.set('strictQuery', false)

  console.info('Connecting to MongoDB...')

  const conn = await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  console.info(`✅ MongoDB Connected: ${conn.connection.host}`)
}

export default connectDB