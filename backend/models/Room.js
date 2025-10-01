import mongoose from "mongoose"

const playerSchema = new mongoose.Schema({
  socketId: { type: String, required: true },
  name: { type: String, required: true },
  isHost: { type: Boolean, default: false },
})

const answerSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  answer: { type: String, required: true },
})

const roundSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answers: [answerSchema],
  isMatch: { type: Boolean, default: false },
})

const roomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    players: [playerSchema],
    status: {
      type: String,
      enum: ["waiting", "playing", "completed"],
      default: "waiting",
    },
    questions: [String],
    currentRound: {
      type: Number,
      default: 0,
    },
    rounds: [roundSchema],
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Auto-delete completed rooms after 24 hours
roomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 })

export const Room = mongoose.model("Room", roomSchema)
