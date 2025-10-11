import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import { analyzeAnswerMatch, generateVibeAnalysis } from "./ai-matcher"
import { connectDatabase } from "./config/database"
import authRoutes from "./routes/auth"
import partnersRoutes from "./routes/partners"
import challengesRoutes from "./routes/challenges"
import questionsRoutes from "./routes/questions"
import User from "./models/User"
import PartnerRelation from "./models/PartnerRelation"
import Question from "./models/Question"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

connectDatabase()

app.use("/api/auth", authRoutes)
app.use("/api/partners", partnersRoutes)
app.use("/api/challenges", challengesRoutes)
app.use("/api/questions", questionsRoutes)

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

// Game state management
interface Player {
  id: string
  name: string
  socketId: string
  isHost: boolean
  userId?: string
}

interface GameRoom {
  code: string
  players: Player[]
  questions: string[]
  currentRound: number
  answers: Map<string, { player1?: string; player2?: string }>
  scores: { player1: number; player2: number }
  gameStarted: boolean
  matchExplanations: string[]
  disconnectedPlayers: Map<string, { player: Player; disconnectTime: number }>
  theme?: string
}

const rooms = new Map<string, GameRoom>()

const REJOIN_TIMEOUT_MS = 5 * 60 * 1000

// Helper functions
function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return rooms.has(code) ? generateRoomCode() : code
}

function getRandomQuestions(count = 5): string[] {
  const questions = [
    "What's your favorite comfort food?",
    "What's your go-to coffee or tea order?",
    "What's one food you could eat every day?",
    "What's your favorite restaurant or cuisine?",
    "Sweet or savory snacks?",
    "What's your ideal breakfast?",
    "What's a food you absolutely can't stand?",
    "What's your favorite dessert?",
    "Do you prefer cooking at home or eating out?",
    "What's your favorite pizza topping?",
    "What's your favorite movie of all time?",
    "What's your favorite TV show?",
    "What's your favorite music genre?",
    "Who's your favorite artist or band?",
    "What's the last song you had stuck in your head?",
    "What's your favorite book or book genre?",
    "What's your favorite way to spend a lazy Sunday?",
    "Are you a morning person or a night owl?",
    "What's your ideal way to relax after a long day?",
    "What's your favorite season?",
    "Beach vacation or mountain getaway?",
    "What's your love language?",
    "What's your ideal date night?",
    "What's the most romantic gesture someone could do for you?",
    "What's your dream vacation destination?",
  ]
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

async function saveGameToDatabase(room: GameRoom) {
  const userId1 = room.players[0].userId!
  const userId2 = room.players[1].userId!

  // Find or create partner relation
  let relation = await PartnerRelation.findOne({
    $or: [
      { userA: userId1, userB: userId2 },
      { userA: userId2, userB: userId1 },
    ],
  })

  if (!relation) {
    relation = await PartnerRelation.create({
      userA: userId1,
      userB: userId2,
      gamesPlayed: 0,
      streak: 0,
      history: [],
    })

    // Add to each user's partners list
    await User.findByIdAndUpdate(userId1, { $addToSet: { partners: userId2 } })
    await User.findByIdAndUpdate(userId2, { $addToSet: { partners: userId1 } })
  }

  // Update relation
  relation.gamesPlayed++
  relation.lastPlayed = new Date()

  // Check if played on consecutive days for streak
  const lastPlayedDate = new Date(relation.lastPlayed)
  const today = new Date()
  lastPlayedDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const daysDiff = Math.floor((today.getTime() - lastPlayedDate.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff === 1) {
    relation.streak++
  } else if (daysDiff > 1) {
    relation.streak = 1
  }

  // Add game history with theme
  for (let i = 0; i < room.questions.length; i++) {
    const roundKey = `round-${i}`
    const answers = room.answers.get(roundKey)

    if (answers?.player1 && answers?.player2) {
      relation.history.push({
        question: room.questions[i],
        answerA: answers.player1,
        answerB: answers.player2,
        verdict: room.matchExplanations[i]?.includes("match") ? "Matched" : "Not Matched",
        resultText: room.matchExplanations[i] || "",
        date: new Date(),
        theme: room.theme,
      })
    }
  }

  await relation.save()
  console.log("[v0] Game saved to database")
}

async function sendPushNotification(userId: string, title: string, body: string) {
  try {
    const user = await User.findById(userId)
    if (!user?.pushToken) {
      console.log("[v0] No push token for user:", userId)
      return
    }

    // In production, you would use Expo's push notification service
    // For now, we'll just log it
    console.log("[v0] Would send push notification:", { userId, title, body, token: user.pushToken })

    // Example implementation with Expo push service:
    // const message = {
    //   to: user.pushToken,
    //   sound: 'default',
    //   title,
    //   body,
    //   data: { type: 'daily_challenge' },
    // }
    // await fetch('https://exp.host/--/api/v2/push/send', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(message),
    // })
  } catch (error) {
    console.error("[v0] Error sending push notification:", error)
  }
}

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log("[v0] User connected:", socket.id)

  // Create a new game room
  socket.on("create-room", (data: { playerName: string; userId?: string; theme?: string }) => {
    console.log("[v0] Creating room:", data)
    const roomCode = generateRoomCode()
    const player: Player = {
      id: "1",
      name: data.playerName,
      socketId: socket.id,
      isHost: true,
      userId: data.userId,
    }

    const room: GameRoom = {
      code: roomCode,
      players: [player],
      questions: getRandomQuestions(5),
      currentRound: 0,
      answers: new Map(),
      scores: { player1: 0, player2: 0 },
      gameStarted: false,
      matchExplanations: [],
      disconnectedPlayers: new Map(),
      theme: data.theme,
    }

    rooms.set(roomCode, room)
    socket.join(roomCode)

    console.log("[v0] Room created:", roomCode, "with theme:", data.theme)
    socket.emit("room-created", { roomCode, player })
  })

  // Join an existing room
  socket.on("join-room", (data: { roomCode: string; playerName: string; userId?: string }) => {
    console.log("[v0] Joining room:", data)
    const room = rooms.get(data.roomCode.toUpperCase())

    if (!room) {
      socket.emit("error", { message: "Room not found" })
      return
    }

    if (room.players.length >= 2) {
      socket.emit("error", { message: "Room is full" })
      return
    }

    const player: Player = {
      id: "2",
      name: data.playerName,
      socketId: socket.id,
      isHost: false,
      userId: data.userId,
    }

    room.players.push(player)
    socket.join(data.roomCode)

    console.log("[v0] Player joined room:", data.roomCode)

    // Notify both players
    io.to(data.roomCode).emit("player-joined", {
      players: room.players,
      player,
    })
  })

  socket.on("rejoin-room", (data: { roomCode: string; userId: string }) => {
    const room = rooms.get(data.roomCode.toUpperCase())

    if (!room) {
      socket.emit("error", { message: "Room not found" })
      return
    }

    // Check if player was disconnected
    const disconnectedPlayer = room.disconnectedPlayers.get(data.userId)

    if (disconnectedPlayer) {
      const timeSinceDisconnect = Date.now() - disconnectedPlayer.disconnectTime

      if (timeSinceDisconnect <= REJOIN_TIMEOUT_MS) {
        // Allow rejoin
        disconnectedPlayer.player.socketId = socket.id
        room.disconnectedPlayers.delete(data.userId)

        // Find and update player in room
        const playerIndex = room.players.findIndex((p) => p.userId === data.userId)
        if (playerIndex !== -1) {
          room.players[playerIndex].socketId = socket.id
        }

        socket.join(data.roomCode)

        console.log("[v0] Player rejoined room:", data.roomCode)

        // Send current game state
        socket.emit("rejoined", {
          room: {
            code: room.code,
            players: room.players,
            currentRound: room.currentRound,
            question: room.questions[room.currentRound],
            scores: room.scores,
            gameStarted: room.gameStarted,
            theme: room.theme,
          },
        })

        // Notify other players
        socket.to(data.roomCode).emit("player-rejoined", {
          player: disconnectedPlayer.player,
        })
      } else {
        socket.emit("error", { message: "Rejoin timeout expired" })
      }
    } else {
      socket.emit("error", { message: "No disconnection record found" })
    }
  })

  // Start the game
  socket.on("start-game", async (data: { roomCode: string; theme: string }) => {
    const room = rooms.get(data.roomCode)
    if (!room) return

    room.theme = data.theme
    room.gameStarted = true

    // Fetch questions from database based on theme
    try {
      const questions = await Question.aggregate([{ $match: { theme: data.theme } }, { $sample: { size: 5 } }])

      if (questions.length > 0) {
        room.questions = questions.map((q) => q.text)
      } else {
        // Fallback to default questions if theme has no questions
        console.log("[v0] No questions found for theme, using defaults")
        room.questions = getRandomQuestions(5)
      }
    } catch (error) {
      console.error("[v0] Error fetching questions:", error)
      room.questions = getRandomQuestions(5)
    }

    console.log("[v0] Game started in room:", data.roomCode, "with theme:", data.theme)

    io.to(data.roomCode).emit("game-started", {
      questions: room.questions,
      currentRound: room.currentRound,
      theme: room.theme,
    })
  })

  // Submit an answer
  socket.on(
    "submit-answer",
    async ({ roomCode, playerId, answer }: { roomCode: string; playerId: string; answer: string }) => {
      const room = rooms.get(roomCode)
      if (!room) return

      const roundKey = `round-${room.currentRound}`
      if (!room.answers.has(roundKey)) {
        room.answers.set(roundKey, {})
      }

      const roundAnswers = room.answers.get(roundKey)!
      if (playerId === "1") {
        roundAnswers.player1 = answer
      } else {
        roundAnswers.player2 = answer
      }

      console.log("[v0] Answer submitted:", { roomCode, playerId, answer })

      // Notify the other player that this player has answered
      socket.to(roomCode).emit("player-answered", { playerId })

      // Check if both players have answered
      if (roundAnswers.player1 && roundAnswers.player2) {
        const currentQuestion = room.questions[room.currentRound]
        const player1Name = room.players[0].name
        const player2Name = room.players[1].name

        const matchResult = await analyzeAnswerMatch(
          currentQuestion,
          roundAnswers.player1,
          roundAnswers.player2,
          player1Name,
          player2Name,
        )

        if (matchResult.isMatch) {
          room.scores.player1++
          room.scores.player2++
        }

        room.matchExplanations.push(matchResult.explanation)

        console.log("[v0] AI match result:", matchResult)

        // Send results to both players
        io.to(roomCode).emit("round-complete", {
          player1Answer: roundAnswers.player1,
          player2Answer: roundAnswers.player2,
          isMatch: matchResult.isMatch,
          similarity: matchResult.similarity,
          explanation: matchResult.explanation,
          scores: room.scores,
        })
      }
    },
  )

  // Move to next round
  socket.on("next-round", async (roomCode: string) => {
    const room = rooms.get(roomCode)
    if (!room) return

    room.currentRound++

    if (room.currentRound >= room.questions.length) {
      const player1Name = room.players[0].name
      const player2Name = room.players[1].name

      const vibeAnalysis = await generateVibeAnalysis(room.scores, room.questions.length, player1Name, player2Name)

      if (room.players[0].userId && room.players[1].userId) {
        try {
          await saveGameToDatabase(room)
        } catch (error) {
          console.error("[v0] Error saving game:", error)
        }
      }

      console.log("[v0] Game over in room:", roomCode)
      io.to(roomCode).emit("game-over", {
        scores: room.scores,
        totalRounds: room.questions.length,
        vibeAnalysis,
        matchExplanations: room.matchExplanations,
        theme: room.theme,
      })
    } else {
      // Next round
      console.log("[v0] Next round in room:", roomCode, room.currentRound)
      io.to(roomCode).emit("next-round", {
        currentRound: room.currentRound,
        question: room.questions[room.currentRound],
      })
    }
  })

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("[v0] User disconnected:", socket.id)

    // Find and handle disconnection
    rooms.forEach((room, code) => {
      const playerIndex = room.players.findIndex((p) => p.socketId === socket.id)
      if (playerIndex !== -1) {
        const player = room.players[playerIndex]

        if (room.gameStarted && player.userId) {
          room.disconnectedPlayers.set(player.userId, {
            player,
            disconnectTime: Date.now(),
          })

          console.log("[v0] Player disconnected, rejoin window active:", player.userId)

          // Notify other players
          socket.to(code).emit("player-disconnected", {
            player,
            canRejoin: true,
            rejoinTimeoutMs: REJOIN_TIMEOUT_MS,
          })

          // Set timeout to clean up if player doesn't rejoin
          setTimeout(() => {
            if (room.disconnectedPlayers.has(player.userId!)) {
              room.disconnectedPlayers.delete(player.userId!)
              room.players.splice(playerIndex, 1)

              if (room.players.length === 0) {
                rooms.delete(code)
                console.log("[v0] Room deleted after timeout:", code)
              } else {
                io.to(code).emit("player-left", { players: room.players })
              }
            }
          }, REJOIN_TIMEOUT_MS)
        } else {
          // Immediate cleanup for non-active games
          room.players.splice(playerIndex, 1)

          if (room.players.length === 0) {
            rooms.delete(code)
            console.log("[v0] Room deleted:", code)
          } else {
            io.to(code).emit("player-left", { players: room.players })
          }
        }
      }
    })
  })

  // Select a theme
  socket.on("theme-selected", (data: { roomCode: string; theme: string }) => {
    const room = rooms.get(data.roomCode)
    if (!room) return

    room.theme = data.theme
    console.log("[v0] Theme selected:", data.theme)

    // Notify all players in the room
    io.to(data.roomCode).emit("theme-selected", { theme: data.theme })
  })

  // Request current room state
  socket.on("get-room-state", (data: { roomCode: string }) => {
    const room = rooms.get(data.roomCode)
    if (!room) {
      socket.emit("error", { message: "Room not found" })
      return
    }

    console.log("[v0] Sending room state for:", data.roomCode)
    socket.emit("room-state", {
      players: room.players,
      theme: room.theme,
      gameStarted: room.gameStarted,
    })
  })
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", rooms: rooms.size })
})

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`[v0] Server running on port ${PORT}`)
})
