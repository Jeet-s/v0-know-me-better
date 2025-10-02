"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated from "react-native-reanimated"
import socketService from "../services/socket"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  roundText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  question: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 32,
    color: "#1F2937",
    lineHeight: 32,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    minHeight: 120,
    borderColor: "#E9D5FF",
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
    fontWeight: "600",
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#A855F7",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  waitingContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 32,
  },
  waitingEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  waitingText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#6B7280",
  },
  themeTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 8,
  },
  themeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
})

export default function GameScreen({ navigation, route }: any) {
  const { roomCode, playerName, playerId, questions, currentRound: initialRound, theme } = route.params

  const [currentRound, setCurrentRound] = useState(initialRound || 0)
  const [currentScore, setCurrentScore] = useState(0)
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const question = questions[currentRound]

  useEffect(() => {
    setAnswer("")
    setSubmitted(false)
  }, [currentRound])

  useEffect(() => {
    const handleRoundComplete = (data: any) => {
      const { player1Answer, player2Answer, isMatch, similarity, explanation, scores } = data

      const newScore = playerId === "1" ? scores.player1 : scores.player2
      setCurrentScore(newScore)

      const matchMessage = isMatch
        ? `Match! 🎉\n\nSimilarity: ${similarity}%\n${explanation}`
        : `Different vibes\n\nSimilarity: ${similarity}%\n${explanation}`

      Alert.alert(
        matchMessage,
        `You: ${playerId === "1" ? player1Answer : player2Answer}\nPartner: ${playerId === "1" ? player2Answer : player1Answer}`,
        [
          {
            text: "Continue",
            onPress: () => {
              socketService.nextRound(roomCode)
            },
          },
        ],
      )
    }

    const handleGameOver = (data: any) => {
      const { scores, totalRounds, vibeAnalysis } = data

      const finalScore = playerId === "1" ? scores.player1 : scores.player2

      navigation.replace("Results", {
        roomCode,
        playerName,
        score: finalScore,
        total: totalRounds,
        vibeAnalysis,
        theme: data.theme,
      })
    }

    const handleNextRound = (data: any) => {
      const { currentRound: newRound } = data
      setCurrentRound(newRound)
    }

    socketService.onRoundComplete(handleRoundComplete)
    socketService.onGameOver(handleGameOver)
    socketService.onNextRound(handleNextRound)

    return () => {
      socketService.off("round-complete")
      socketService.off("game-over")
      socketService.off("next-round")
    }
  }, [currentRound, navigation, roomCode, playerName, playerId, questions])

  const handleSubmit = () => {
    if (!answer.trim()) {
      Alert.alert("Error", "Please enter an answer")
      return
    }

    setSubmitted(true)
    socketService.submitAnswer(roomCode, playerId, answer.trim())
  }

  return (
    <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.roundText}>
            Round {currentRound + 1}/{questions.length}
          </Text>
          <Text style={styles.scoreText}>Score: {currentScore} 🎯</Text>
        </View>
        {theme && (
          <View style={styles.themeTag}>
            <Text style={styles.themeText}>{theme}</Text>
          </View>
        )}
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progressFill, { width: `${((currentRound + 1) / questions.length) * 100}%` }]}
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.questionCard}>
          <Text style={styles.emoji}>💭</Text>
          <Text style={styles.question}>{question}</Text>

          {!submitted ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your answer..."
                placeholderTextColor="rgba(168, 85, 247, 0.4)"
                value={answer}
                onChangeText={setAnswer}
                multiline
                maxLength={200}
                autoFocus
              />
              <TouchableOpacity
                style={[styles.submitButton, !answer.trim() && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={!answer.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Submit Answer ✨</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.waitingContainer}>
              <Text style={styles.waitingEmoji}>⏳</Text>
              <Text style={styles.waitingText}>Checking answers...</Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  )
}
