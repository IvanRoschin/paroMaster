import { connectToDB } from "./dbConnect"

export const startServer = async () => {
  try {
    await connectToDB()
    console.log("Server is running...")
  } catch (error: any) {
    console.error("Failed to start the server:", error.message)
    process.exit(1) // Завершить процесс при ошибке
  }
}
