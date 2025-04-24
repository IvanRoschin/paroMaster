import mongoose from "mongoose"

let isConnected = false // track connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true) // ensure strict query mode

  const mongodbUri: string | undefined = process.env.MONGODB_URI

  const options = {
    serverSelectionTimeoutMS: 20000, // Increase server selection timeout to 20 seconds
    connectTimeoutMS: 20000, // Increase connection timeout to 20 seconds
    dbName: "paromaster" // specify db name explicitly
  }

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not defined")
  }

  // Check if already connected
  if (isConnected) {
    console.log("MongoDB is already connected")
    return
  }

  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(mongodbUri, options)
    isConnected = true
    console.log("MongoDB connected")
  } catch (error) {
    console.error("MongoDB connection error:", error || "Can`t connect to MongoDB")
    throw error // Re-throw the error for further handling
  }
}

// Monitor connection state
mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established")
})

mongoose.connection.on("error", error => {
  console.error("MongoDB connection error:", error)
  isConnected = false // Reset connection flag on error
})

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB connection lost")
  isConnected = false // Reset connection flag on disconnect
})
