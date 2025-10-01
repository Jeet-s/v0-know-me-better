"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { getRandomQuestions } from "../data/questions"

export default function WaitingScreen() {
  const router = useRouter()
  const { roomCode, playerName, isHost } = useLocalSearchParams()
  const [countdown, setCountdown] = useState(3)
  const [showCountdown, setShowCountdown] = useState(false)

  const players = [playerName as string, "Partner"]

  const handleStartGame = () => {
    setShowCountdown(true)
  }

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (showCountdown && countdown === 0) {
      const questions = getRandomQuestions(5)
      router.replace({
        pathname: "/game",
        params: {
          roomCode,
          playerName,
          questions: JSON.stringify(questions),
          round: "1",
          score: "0",
        },
      })
    }
  }, [showCountdown, countdown])

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showCountdown ? (
          <>
            <Text style={styles.countdownEmoji}>🎮</Text>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.countdownLabel}>Get Ready!</Text>
          </>
        ) : (
          <>
            <Text style={styles.emoji}>⏳</Text>
            <Text style={styles.title}>Waiting Room</Text>

            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Room Code</Text>
              <Text style={styles.code}>{roomCode}</Text>
            </View>

            <View style={styles.playersContainer}>
              <Text style={styles.playersTitle}>Players ({players.length}/2)</Text>
              {players.map((player, index) => (
                <View key={index} style={styles.playerCard}>
                  <Text style={styles.playerEmoji}>{index === 0 ? "👤" : "👥"}</Text>
                  <Text style={styles.playerName}>{player}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
              <Text style={styles.startButtonText}>Start Game 🎮</Text>
            </TouchableOpacity>

            <Text style={styles.note}>Note: This is a demo with mock data</Text>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginBottom: 30,
  },
  codeContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "#FFE5EC",
  },
  codeLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
  code: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF6B9D",
    letterSpacing: 4,
  },
  playersContainer: {
    width: "100%",
    maxWidth: 400,
    gap: 10,
    marginBottom: 30,
  },
  playersTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
  playerCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "#FFE5EC",
  },
  playerEmoji: {
    fontSize: 24,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  startButton: {
    backgroundColor: "#FF6B9D",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  note: {
    fontSize: 12,
    color: "#999",
    marginTop: 20,
    fontStyle: "italic",
  },
  countdownEmoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: "bold",
    color: "#FF6B9D",
  },
  countdownLabel: {
    fontSize: 24,
    color: "#666",
    marginTop: 20,
  },
})
