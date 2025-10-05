import { io, type Socket } from "socket.io-client"

const SOCKET_URL = "https://v0-know-me-better-y8fz.vercel.app"

interface RoundCompleteData {
  player1Answer: string
  player2Answer: string
  isMatch: boolean
  similarity: number
  explanation: string
  scores: { player1: number; player2: number }
}

interface GameOverData {
  scores: { player1: number; player2: number }
  totalRounds: number
  vibeAnalysis: string
  matchExplanations: string[]
  theme?: string
}

class SocketService {
  private socket: Socket | null = null

  connect() {
    console.log("[v0] Connecting to socket:", SOCKET_URL)
    if (this.socket?.connected) return this.socket;



    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    console.log("[v0] Socket :", this.socket)

    this.socket.on("connect", () => {
      console.log("[v0] Socket connected:", this.socket?.id)
    })

    this.socket.on("disconnect", () => {
      console.log("[v0] Socket disconnected")
    })

    this.socket.on("error", (error: any) => {
      console.error("[v0] Socket error:", error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket() {
    return this.socket
  }

  // Room management
  createRoom(playerName: string, userId?: string) {
    this.socket?.emit("create-room", { playerName, userId })
  }

  joinRoom(roomCode: string, playerName: string, userId?: string) {
    this.socket?.emit("join-room", { roomCode, playerName, userId })
  }

  startGame(roomCode: string, theme: string) {
    this.socket?.emit("start-game", { roomCode, theme })
  }

  // Game actions
  submitAnswer(roomCode: string, playerId: string, answer: string) {
    this.socket?.emit("submit-answer", { roomCode, playerId, answer })
  }

  nextRound(roomCode: string) {
    this.socket?.emit("next-round", roomCode)
  }

  selectTheme(roomCode: string, theme: string) {
    this.socket?.emit("theme-selected", { roomCode, theme })
  }

  // Event listeners with proper typing
  onRoomCreated(callback: (data: any) => void) {
    this.socket?.on("room-created", callback)
  }

  onPlayerJoined(callback: (data: any) => void) {
    this.socket?.on("player-joined", callback)
  }

  onGameStarted(callback: (data: any) => void) {
    this.socket?.on("game-started", callback)
  }

  onPlayerAnswered(callback: (data: any) => void) {
    this.socket?.on("player-answered", callback)
  }

  onRoundComplete(callback: (data: RoundCompleteData) => void) {
    this.socket?.on("round-complete", callback)
  }

  onNextRound(callback: (data: any) => void) {
    this.socket?.on("next-round", callback)
  }

  onGameOver(callback: (data: GameOverData) => void) {
    this.socket?.on("game-over", callback)
  }

  onPlayerLeft(callback: (data: any) => void) {
    this.socket?.on("player-left", callback)
  }

  onError(callback: (data: any) => void) {
    this.socket?.on("error", callback)
  }

  onThemeSelected(callback: (data: { theme: string }) => void) {
    this.socket?.on("theme-selected", callback)
  }

  // Remove listeners
  off(event: string) {
    this.socket?.off(event)
  }
}

export default new SocketService()
