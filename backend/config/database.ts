import mongoose from "mongoose"

export const connectDatabase = async () => {
  if (process.env.SKIP_DB === "1" || process.env.SKIP_DB === "true") {
    console.log("[v0] SKIP_DB is set; skipping MongoDB connection")
    return
  }
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/couples-vibe"

    await mongoose.connect(mongoUri)

    console.log("[v0] MongoDB connected successfully")
  } catch (error) {
    console.error("[v0] MongoDB connection error:", error)
    process.exit(1)
  }
}

mongoose.connection.on("disconnected", () => {
  console.log("[v0] MongoDB disconnected")
})

mongoose.connection.on("error", (err) => {
  console.error("[v0] MongoDB error:", err)
})
