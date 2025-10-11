"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { FadeIn, SlideInUp } from "react-native-reanimated"
import socketService from "../services/socket"

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: "center",
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
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  answererBadge: {
    backgroundColor: "#10B981",
  },
  guesserBadge: {
    backgroundColor: "#F59E0B",
  },
  roleText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  instructionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  modalGradient: {
    padding: 32,
    alignItems: "center",
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  similarityBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 24,
  },
  similarityText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  answersContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  answerBox: {
    marginBottom: 16,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  answerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 22,
  },
  divider: {
    alignItems: "center",
    marginVertical: 8,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.6)",
  },
  explanationBox: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  explanationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 20,
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
  },
})

export default function GameScreen({ navigation, route }: any) {
  const { roomCode, playerName, playerId, questions, currentRound: initialRound, theme, answerer } = route.params

  const [currentRound, setCurrentRound] = useState(initialRound || 0)
  const [currentScore, setCurrentScore] = useState(0)
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [answerReady, setAnswerReady] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [resultData, setResultData] = useState<any>(null)

  // Determine role once - this never changes during the game
  const isAnswerer = playerId === answerer

  const question = questions[currentRound]

  useEffect(() => {
    setAnswer("")
    setSubmitted(false)
    setAnswerReady(false)
  }, [currentRound])

  const handleAnswerReady = useCallback((data: any) => {
    if (!isAnswerer) {
      setAnswerReady(true)
    }
  }, [isAnswerer])

  const handleRoundComplete = useCallback((data: any) => {
    const { actualAnswer, guess, isMatch, similarity, explanation, scores, answerer: answererId, guesser } = data

    const newScore = playerId === "1" ? scores.player1 : scores.player2
    setCurrentScore(newScore)

    // Store result data and show modal
    setResultData({
      actualAnswer,
      guess,
      isMatch,
      similarity,
      explanation,
      scores,
      guesser,
    })
    setShowResultModal(true)
  }, [playerId])

  const handleGameOver = useCallback((data: any) => {
    const { guesserScore, totalRounds, vibeAnalysis } = data

    // Both players see the same score (how well the guesser did)
    navigation.replace("Results", {
      roomCode,
      playerName,
      score: guesserScore,
      total: totalRounds,
      vibeAnalysis,
      theme: data.theme,
      isAnswerer: isAnswerer,
    })
  }, [navigation, roomCode, playerName, isAnswerer])

  const handleNextRound = useCallback((data: any) => {
    const { currentRound: newRound } = data
    setCurrentRound(newRound)
  }, [])

  useEffect(() => {
    socketService.onAnswerReady(handleAnswerReady)
    socketService.onRoundComplete(handleRoundComplete)
    socketService.onGameOver(handleGameOver)
    socketService.onNextRound(handleNextRound)

    return () => {
      socketService.off("answer-ready")
      socketService.off("round-complete")
      socketService.off("game-over")
      socketService.off("next-round")
    }
  }, [handleAnswerReady, handleRoundComplete, handleGameOver, handleNextRound])

  const handleContinue = () => {
    setShowResultModal(false)
    setResultData(null)
    
    // Only the guesser advances the round to prevent race conditions
    if (resultData && playerId === resultData.guesser) {
      socketService.nextRound(roomCode)
    }
  }

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

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.questionCard}>
          <Text style={styles.emoji}>{isAnswerer ? "✍️" : "🎯"}</Text>
          
          {/* Role indicator */}
          <View style={[styles.roleBadge, isAnswerer ? styles.answererBadge : styles.guesserBadge]}>
            <Text style={styles.roleText}>
              {isAnswerer ? "You're the Answerer" : "You're the Guesser"}
            </Text>
          </View>

          <Text style={styles.question}>{question}</Text>

          {isAnswerer ? (
            // Answerer UI
            !submitted ? (
              <View style={styles.inputContainer}>
                <Text style={styles.instructionText}>
                  Answer this question honestly. Your partner will try to guess your answer!
                </Text>
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
                <Text style={styles.waitingText}>Waiting for your partner to guess...</Text>
              </View>
            )
          ) : (
            // Guesser UI
            !answerReady ? (
              <View style={styles.waitingContainer}>
                <Text style={styles.waitingEmoji}>⏳</Text>
                <Text style={styles.waitingText}>Waiting for your partner to answer...</Text>
              </View>
            ) : !submitted ? (
              <View style={styles.inputContainer}>
                <Text style={styles.instructionText}>
                  Your partner has answered! Try to guess what they said.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Guess your partner's answer..."
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
                  <Text style={styles.submitButtonText}>Submit Guess 🎯</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.waitingContainer}>
                <Text style={styles.waitingEmoji}>⏳</Text>
                <Text style={styles.waitingText}>Checking your guess...</Text>
              </View>
            )
          )}
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Result Modal */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleContinue}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={SlideInUp.duration(400)}
            style={styles.modalContent}
          >
            <LinearGradient
              colors={resultData?.isMatch ? ["#10B981", "#059669"] : ["#F59E0B", "#D97706"]}
              style={styles.modalGradient}
            >
              {/* Result Icon */}
              <Text style={styles.resultEmoji}>
                {resultData?.isMatch ? "🎉" : "💭"}
              </Text>

              {/* Match Status */}
              <Text style={styles.resultTitle}>
                {resultData?.isMatch ? "Great Guess!" : "Not Quite!"}
              </Text>

              {/* Similarity Score */}
              <View style={styles.similarityBadge}>
                <Text style={styles.similarityText}>
                  {resultData?.similarity}% Match
                </Text>
              </View>

              {/* Answers Comparison */}
              <View style={styles.answersContainer}>
                <View style={styles.answerBox}>
                  <Text style={styles.answerLabel}>
                    {isAnswerer ? "Your Answer" : "Partner's Answer"}
                  </Text>
                  <Text style={styles.answerText}>
                    {resultData?.actualAnswer}
                  </Text>
                </View>

                <View style={styles.divider}>
                  <Text style={styles.dividerText}>vs</Text>
                </View>

                <View style={styles.answerBox}>
                  <Text style={styles.answerLabel}>
                    {isAnswerer ? "Partner's Guess" : "Your Guess"}
                  </Text>
                  <Text style={styles.answerText}>
                    {resultData?.guess}
                  </Text>
                </View>
              </View>

              {/* AI Explanation */}
              <View style={styles.explanationBox}>
                <Text style={styles.explanationText}>
                  {resultData?.explanation}
                </Text>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>
                  Continue to Next Round →
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </LinearGradient>
  )
}
