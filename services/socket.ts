import { io, type Socket } from "socket.io-client"

const SOCKET_URL = "http://localhost:3001" // Change this to your backend URL

class SocketService {
  private socket: Socket | null = null

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      this.socket.on("connect", () => {
        console.log("[v0] Socket connected:", this.socket?.id)
        resolve()
      })

      this.socket.on("connect_error", (error) => {
        console.error("[v0] Socket connection error:", error)
        reject(error)
      })
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  createRoom(playerName: string, callback: (response: any) => void): void {
    this.socket?.emit("createRoom", { playerName }, callback)
  }

  joinRoom(roomCode: string, playerName: string, callback: (response: any) => void): void {
    this.socket?.emit("joinRoom", { roomCode, playerName }, callback)
  }

  startGame(roomCode: string): void {
    this.socket?.emit("startGame", { roomCode })
  }

  submitAnswer(roomCode: string, answer: string, callback: (response: any) => void): void {
    this.socket?.emit("submitAnswer", { roomCode, answer }, callback)
  }

  on(event: string, callback: (...args: any[]) => void): void {
    this.socket?.on(event, callback)
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    this.socket?.off(event, callback)
  }

  getSocket(): Socket | null {
    return this.socket
  }
}

export const socketService = new SocketService()
