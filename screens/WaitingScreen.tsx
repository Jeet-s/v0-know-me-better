"use client"

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { getRandomQuestions } from "../data/questions"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  content: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  codeContainer: {
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  code: {
    fontSize: 24,
    fontWeight: "bold",
  },
  playersContainer: {
    width: "80%",
    marginBottom: 20,
  },
  playersTitle: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "left",
    width: "100%",
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  playerEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  playerName: {
    fontSize: 18,
  },
  startButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  note: {
    fontSize: 14,
    color: "#888",
  },
  countdownEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  countdownLabel: {
    fontSize: 24,
    fontWeight: "bold",
  },
})

export default function WaitingScreen({ navigation, route }: any) {
  const { roomCode, playerName, isHost } = route.params
  const [countdown, setCountdown] = useState(3)
  const [showCountdown, setShowCountdown] = useState(false)

  const players = [playerName, "Partner"]

  const handleStartGame = () => {
    setShowCountdown(true)
  }

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (showCountdown && countdown === 0) {
      const questions = getRandomQuestions(5)
      navigation.replace("Game", {
        roomCode,
        playerName,
        questions,
        round: 1,
        score: 0,
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
