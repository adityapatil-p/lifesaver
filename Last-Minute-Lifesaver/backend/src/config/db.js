import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Cause:", error.cause);
    console.error(error);
    process.exit(1);
  }
}
export default connectDB