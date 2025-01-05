import mongoose from "mongoose"

let isConnected = false // Track connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true)

  const mongodbUri = process.env.MONGODB_URI

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not defined in environment variables.")
  }

  if (isConnected) {
    console.log("MongoDB is already connected.")
    return
  }

  try {
    await mongoose.connect(mongodbUri, {
      dbName: "paromaster", // Database name
      serverSelectionTimeoutMS: 20000, // Server selection timeout (20 seconds)
      connectTimeoutMS: 20000 // Connection timeout (20 seconds)
    })
    isConnected = true
    console.log("Successfully connected to MongoDB.")
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message)
    throw new Error("Failed to connect to MongoDB.")
  }
}
