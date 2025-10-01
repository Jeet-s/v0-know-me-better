"use client"

import { useEffect, useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { socketService } from "@/services/socket"

export default function GameScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()

  const [roomCode, setRoomCode] = useState(params.roomCode as string)
  const [playerName, setPlayerName] = useState(params.playerName as string)
  const [currentRound, setCurrentRound] = useState(Number(params.currentRound) || 1)
  const [totalRounds, setTotalRounds] = useState(Number(params.totalRounds) || 5)
  const [question, setQuestion] = useState(params.question as string)
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [waitingForOther, setWaitingForOther] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [roundResult, setRoundResult] = useState<any>(null)

  useEffect(() => {
    // Listen for waiting for player
    socketService.on("waitingForPlayer", (data) => {
      console.log("[v0] Waiting for player:", data)
      setWaitingForOther(true)
    })

    // Listen for round result
    socketService.on("roundResult", (data) => {
      console.log("[v0] Round result:", data)
      setRoundResult(data)
      setShowResult(true)
      setWaitingForOther(false)
    })

    // Listen for next round
    socketService.on("nextRound", (data) => {
      console.log("[v0] Next round:", data)
      setCurrentRound(data.currentRound)
      setQuestion(data.question)
      setAnswer("")
      setSubmitted(false)
      setShowResult(false)
      setRoundResult(null)
    })

    // Listen for game over
    socketService.on("gameOver", (data) => {
      console.log("[v0] Game over:", data)
      router.push({
        pathname: "/results",
        params: {
          roomCode,
          playerName,
          finalScore: data.finalScore,
          totalRounds: data.totalRounds,
          rounds: JSON.stringify(data.rounds),
        },
      })
    })

    return () => {
      socketService.off("waitingForPlayer")
      socketService.off("roundResult")
      socketService.off("nextRound")
      socketService.off("gameOver")
    }
  }, [])

  const handleSubmit = () => {
    if (!answer.trim()) {
      Alert.alert("Error", "Please enter an answer")
      return
    }

    socketService.submitAnswer(roomCode, answer, (response) => {
      if (response.success) {
        setSubmitted(true)
      } else {
        Alert.alert("Error", response.message || "Failed to submit answer")
      }
    })
  }

  if (showResult && roundResult) {
    return (
      <LinearGradient colors={["#FFF5F7", "#FFE8EC", "#FFF0F5"]} style={styles.container}>
        <Animatable.View animation="bounceIn" duration={800} style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>{roundResult.isMatch ? "✅" : "❌"}</Text>
          <Text style={styles.resultTitle}>{roundResult.isMatch ? "It's a Match!" : "Not Quite..."}</Text>

          <View style={styles.answersContainer}>
            <Text style={styles.questionText}>{roundResult.question}</Text>

            {roundResult.answers.map((ans: any, index: number) => (
              <View key={index} style={styles.answerCard}>
                <Text style={styles.answerPlayer}>{ans.playerName}</Text>
                <Text style={styles.answerText}>{ans.answer}</Text>
              </View>
            ))}
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Current Score</Text>
            <Text style={styles.scoreValue}>
              {roundResult.currentScore} / {currentRound}
            </Text>
          </View>

          <Text style={styles.nextRoundText}>
            {currentRound < totalRounds ? "Next round starting..." : "Calculating final results..."}
          </Text>
        </Animatable.View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={["#FFF5F7", "#FFE8EC", "#FFF0F5"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
          <View style={styles.roundIndicator}>
            <Text style={styles.roundText}>
              Round {currentRound} of {totalRounds}
            </Text>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeIn" delay={200} duration={800} style={styles.questionContainer}>
          <Text style={styles.questionEmoji}>❓</Text>
          <Text style={styles.questionText}>{question}</Text>
        </Animatable.View>

        {!submitted ? (
          <Animatable.View animation="fadeInUp" delay={400} duration={800} style={styles.answerContainer}>
            <Text style={styles.answerLabel}>Your Answer</Text>
            <TextInput
              style={styles.answerInput}
              placeholder="Type your answer here..."
              placeholderTextColor="#C4A4B7"
              value={answer}
              onChangeText={setAnswer}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          </Animatable.View>
        ) : (
          <Animatable.View animation="fadeIn" duration={800} style={styles.waitingContainer}>
            <Text style={styles.waitingEmoji}>⏳</Text>
            <Text style={styles.waitingTitle}>Answer Submitted!</Text>
            <Text style={styles.waitingText}>
              {waitingForOther ? "Waiting for your partner..." : "Processing answers..."}
            </Text>
          </Animatable.View>
        )}
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    gap: 24,
  },
  header: {
    alignItems: "center",
  },
  roundIndicator: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFD4E5",
  },
  roundText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B9D",
  },
  questionContainer: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD4E5",
  },
  questionEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    lineHeight: 28,
  },
  answerContainer: {
    gap: 12,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5A7C",
    marginLeft: 4,
  },
  answerInput: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    color: "#333",
    borderWidth: 2,
    borderColor: "#FFD4E5",
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: "#FF6B9D",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  waitingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  waitingEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  waitingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginBottom: 8,
  },
  waitingText: {
    fontSize: 16,
    color: "#8B5A7C",
    textAlign: "center",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 24,
  },
  resultEmoji: {
    fontSize: 80,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B9D",
    textAlign: "center",
  },
  answersContainer: {
    width: "100%",
    gap: 16,
  },
  answerCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFD4E5",
  },
  answerPlayer: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginBottom: 8,
  },
  answerText: {
    fontSize: 16,
    color: "#333",
  },
  scoreContainer: {
    alignItems: "center",
    gap: 8,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#8B5A7C",
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF6B9D",
  },
  nextRoundText: {
    fontSize: 14,
    color: "#8B5A7C",
    fontStyle: "italic",
  },
})
