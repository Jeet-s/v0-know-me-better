"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { socketService } from "@/services/socket"

export default function WaitingScreen() {
  const router = useRouter()
  const { roomCode, playerName, isHost } = useLocalSearchParams()
  const [players, setPlayers] = useState<Array<{ name: string; isHost: boolean }>>([
    { name: playerName as string, isHost: isHost === "true" },
  ])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Listen for player joined event
    socketService.on("playerJoined", (data) => {
      console.log("[v0] Player joined event:", data)
      setPlayers(data.players)
      setIsReady(true)
    })

    // Listen for game started event
    socketService.on("gameStarted", (data) => {
      console.log("[v0] Game started event:", data)
      router.push({
        pathname: "/game",
        params: {
          roomCode,
          playerName,
          currentRound: data.currentRound,
          totalRounds: data.totalRounds,
          question: data.question,
        },
      })
    })

    return () => {
      socketService.off("playerJoined")
      socketService.off("gameStarted")
    }
  }, [])

  const handleStartGame = () => {
    if (players.length !== 2) {
      Alert.alert("Wait", "Need 2 players to start the game")
      return
    }

    socketService.startGame(roomCode as string)
  }

  const handleCopyCode = () => {
    Alert.alert("Room Code", `Share this code: ${roomCode}`)
  }

  return (
    <LinearGradient colors={["#FFF5F7", "#FFE8EC", "#FFF0F5"]} style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
        <Text style={styles.emoji}>⏳</Text>
        <Text style={styles.title}>Waiting Room</Text>
        <Text style={styles.subtitle}>Get ready to play!</Text>
      </Animatable.View>

      <Animatable.View animation="fadeIn" delay={200} duration={800} style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Room Code</Text>
        <TouchableOpacity style={styles.codeBox} onPress={handleCopyCode}>
          <Text style={styles.codeText}>{roomCode}</Text>
        </TouchableOpacity>
        <Text style={styles.codeHint}>Tap to share</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={400} duration={800} style={styles.playersContainer}>
        <Text style={styles.playersTitle}>Players ({players.length}/2)</Text>

        <View style={styles.playersList}>
          {players.map((player, index) => (
            <View key={index} style={styles.playerCard}>
              <Text style={styles.playerEmoji}>{player.isHost ? "👑" : "🎮"}</Text>
              <Text style={styles.playerName}>{player.name}</Text>
              {player.isHost && <Text style={styles.hostBadge}>Host</Text>}
            </View>
          ))}

          {players.length < 2 && (
            <View style={styles.emptySlot}>
              <ActivityIndicator size="large" color="#FF6B9D" />
              <Text style={styles.emptySlotText}>Waiting for player 2...</Text>
            </View>
          )}
        </View>
      </Animatable.View>

      {isHost === "true" && (
        <Animatable.View animation="fadeInUp" delay={600} duration={800} style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.startButton, !isReady && styles.startButtonDisabled]}
            onPress={handleStartGame}
            disabled={!isReady}
          >
            <Text style={styles.startButtonText}>{isReady ? "Start Game" : "Waiting for Player 2..."}</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      {isHost !== "true" && (
        <Animatable.View animation="fadeIn" delay={600} duration={800} style={styles.waitingMessage}>
          <Text style={styles.waitingText}>Waiting for host to start the game...</Text>
        </Animatable.View>
      )}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#8B5A7C",
  },
  codeContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  codeLabel: {
    fontSize: 14,
    color: "#8B5A7C",
    marginBottom: 8,
  },
  codeBox: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFD4E5",
    marginBottom: 8,
  },
  codeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B9D",
    letterSpacing: 8,
  },
  codeHint: {
    fontSize: 12,
    color: "#C4A4B7",
    fontStyle: "italic",
  },
  playersContainer: {
    flex: 1,
  },
  playersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5A7C",
    marginBottom: 16,
  },
  playersList: {
    gap: 12,
  },
  playerCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "#FFD4E5",
  },
  playerEmoji: {
    fontSize: 24,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  hostBadge: {
    backgroundColor: "#FF6B9D",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  emptySlot: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "#FFD4E5",
    borderStyle: "dashed",
  },
  emptySlotText: {
    fontSize: 14,
    color: "#C4A4B7",
    fontStyle: "italic",
  },
  buttonContainer: {
    marginTop: 20,
  },
  startButton: {
    backgroundColor: "#FF6B9D",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  waitingMessage: {
    alignItems: "center",
    marginTop: 20,
  },
  waitingText: {
    fontSize: 16,
    color: "#8B5A7C",
    fontStyle: "italic",
  },
})
