import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import { Room } from "./models/Room.js"
import { getRandomQuestions } from "./services/questionService.js"
import { judgeAnswers } from "./services/llmService.js"

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/couples-vibe")
  .then(() => console.log("[v0] Connected to MongoDB"))
  .catch((err) => console.error("[v0] MongoDB connection error:", err))

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Generate unique 4-character room code
function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("[v0] Client connected:", socket.id)

  // Create a new room
  socket.on("createRoom", async ({ playerName }, callback) => {
    try {
      let roomCode = generateRoomCode()

      // Ensure unique room code
      let existingRoom = await Room.findOne({ roomCode, status: { $ne: "completed" } })
      while (existingRoom) {
        roomCode = generateRoomCode()
        existingRoom = await Room.findOne({ roomCode, status: { $ne: "completed" } })
      }

      const room = new Room({
        roomCode,
        players: [
          {
            socketId: socket.id,
            name: playerName,
            isHost: true,
          },
        ],
        status: "waiting",
      })

      await room.save()
      socket.join(roomCode)

      console.log("[v0] Room created:", roomCode, "by", playerName)

      callback({
        success: true,
        roomCode,
        message: "Room created successfully",
      })
    } catch (error) {
      console.error("[v0] Error creating room:", error)
      callback({
        success: false,
        message: "Failed to create room",
      })
    }
  })

  // Join an existing room
  socket.on("joinRoom", async ({ roomCode, playerName }, callback) => {
    try {
      const room = await Room.findOne({ roomCode, status: "waiting" })

      if (!room) {
        return callback({
          success: false,
          message: "Room not found or already started",
        })
      }

      if (room.players.length >= 2) {
        return callback({
          success: false,
          message: "Room is full",
        })
      }

      room.players.push({
        socketId: socket.id,
        name: playerName,
        isHost: false,
      })

      await room.save()
      socket.join(roomCode)

      console.log("[v0] Player joined:", playerName, "in room", roomCode)

      // Notify the host that player 2 has joined
      io.to(roomCode).emit("playerJoined", {
        players: room.players.map((p) => ({ name: p.name, isHost: p.isHost })),
      })

      callback({
        success: true,
        message: "Joined room successfully",
      })
    } catch (error) {
      console.error("[v0] Error joining room:", error)
      callback({
        success: false,
        message: "Failed to join room",
      })
    }
  })

  // Start the game
  socket.on("startGame", async ({ roomCode }) => {
    try {
      const room = await Room.findOne({ roomCode })

      if (!room || room.players.length !== 2) {
        return
      }

      // Get 5 random questions
      const questions = getRandomQuestions(5)

      room.questions = questions
      room.status = "playing"
      room.currentRound = 1

      await room.save()

      console.log("[v0] Game started in room:", roomCode)

      // Send first question to both players
      io.to(roomCode).emit("gameStarted", {
        currentRound: 1,
        totalRounds: 5,
        question: questions[0],
      })
    } catch (error) {
      console.error("[v0] Error starting game:", error)
    }
  })

  // Submit an answer
  socket.on("submitAnswer", async ({ roomCode, answer }, callback) => {
    try {
      const room = await Room.findOne({ roomCode })

      if (!room) {
        return callback({ success: false, message: "Room not found" })
      }

      const playerIndex = room.players.findIndex((p) => p.socketId === socket.id)
      if (playerIndex === -1) {
        return callback({ success: false, message: "Player not found" })
      }

      const currentRoundIndex = room.currentRound - 1

      // Store the answer
      if (!room.rounds[currentRoundIndex]) {
        room.rounds[currentRoundIndex] = {
          question: room.questions[currentRoundIndex],
          answers: [],
        }
      }

      room.rounds[currentRoundIndex].answers.push({
        playerName: room.players[playerIndex].name,
        answer: answer.trim(),
      })

      await room.save()

      console.log("[v0] Answer submitted by", room.players[playerIndex].name, "in room", roomCode)

      callback({ success: true })

      // Check if both players have answered
      if (room.rounds[currentRoundIndex].answers.length === 2) {
        // Judge the answers using LLM
        const question = room.questions[currentRoundIndex]
        const answer1 = room.rounds[currentRoundIndex].answers[0].answer
        const answer2 = room.rounds[currentRoundIndex].answers[1].answer

        const isMatch = await judgeAnswers(question, answer1, answer2)

        room.rounds[currentRoundIndex].isMatch = isMatch

        if (isMatch) {
          room.score += 1
        }

        await room.save()

        // Send round result to both players
        io.to(roomCode).emit("roundResult", {
          round: room.currentRound,
          question,
          answers: room.rounds[currentRoundIndex].answers,
          isMatch,
          currentScore: room.score,
        })

        // Wait 3 seconds, then move to next round or end game
        setTimeout(async () => {
          const updatedRoom = await Room.findOne({ roomCode })

          if (updatedRoom.currentRound < 5) {
            updatedRoom.currentRound += 1
            await updatedRoom.save()

            io.to(roomCode).emit("nextRound", {
              currentRound: updatedRoom.currentRound,
              totalRounds: 5,
              question: updatedRoom.questions[updatedRoom.currentRound - 1],
            })
          } else {
            // Game over
            updatedRoom.status = "completed"
            await updatedRoom.save()

            io.to(roomCode).emit("gameOver", {
              finalScore: updatedRoom.score,
              totalRounds: 5,
              rounds: updatedRoom.rounds,
            })
          }
        }, 3000)
      } else {
        // Notify that we're waiting for the other player
        io.to(roomCode).emit("waitingForPlayer", {
          waitingFor: room.players.find((p) => p.socketId !== socket.id)?.name,
        })
      }
    } catch (error) {
      console.error("[v0] Error submitting answer:", error)
      callback({ success: false, message: "Failed to submit answer" })
    }
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("[v0] Client disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`[v0] Server running on port ${PORT}`)
})
