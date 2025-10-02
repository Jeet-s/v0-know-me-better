"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { challengesAPI } from "../services/api"

export default function DailyChallengeScreen({ navigation, route }: any) {
  const { partnerId, partnerName } = route.params

  const [loading, setLoading] = useState(true)
  const [hasChallenge, setHasChallenge] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [userAnswered, setUserAnswered] = useState(false)
  const [partnerAnswered, setPartnerAnswered] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [expiresAt, setExpiresAt] = useState<Date | null>(null)

  useEffect(() => {
    checkActiveChallenge()
  }, [])

  const checkActiveChallenge = async () => {
    try {
      const response = await challengesAPI.getActiveChallenge(partnerId)

      if (response.hasChallenge) {
        setHasChallenge(true)
        setQuestion(response.question)
        setUserAnswered(response.userAnswered)
        setPartnerAnswered(response.partnerAnswered)
        setCompleted(response.completed)
        setExpiresAt(new Date(response.expiresAt))
      }
    } catch (error) {
      console.error("[v0] Check challenge error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendChallenge = async () => {
    try {
      setSubmitting(true)
      const response = await challengesAPI.sendChallenge(partnerId)
      setHasChallenge(true)
      setQuestion(response.question)
      Alert.alert("Challenge Sent!", `${partnerName} will receive your challenge.`)
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.error || "Failed to send challenge")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      Alert.alert("Oops!", "Please enter your answer")
      return
    }

    try {
      setSubmitting(true)
      const response = await challengesAPI.submitAnswer(partnerId, answer.trim())

      if (response.completed) {
        setCompleted(true)
        setResult(response)
        Alert.alert(
          response.isMatch ? "It's a Match! 🎉" : "Not Quite 💭",
          `${response.explanation}\n\nStreak: ${response.streak} 🔥`,
        )
      } else {
        setUserAnswered(true)
        Alert.alert("Answer Submitted!", `Waiting for ${partnerName} to answer...`)
      }
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.error || "Failed to submit answer")
    } finally {
      setSubmitting(false)
    }
  }

  const getTimeRemaining = () => {
    if (!expiresAt) return ""

    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m remaining`
  }

  if (loading) {
    return (
      <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.emoji}>💌</Text>
        <Text style={styles.title}>Daily Challenge</Text>
        <Text style={styles.subtitle}>with {partnerName}</Text>

        {!hasChallenge ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Send Today's Challenge</Text>
            <Text style={styles.cardDescription}>
              Send a fun question to {partnerName}. You both have 24 hours to answer and see if you match!
            </Text>

            <TouchableOpacity
              style={[styles.primaryButton, submitting && styles.buttonDisabled]}
              onPress={handleSendChallenge}
              disabled={submitting}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>{submitting ? "Sending..." : "Send Challenge 🚀"}</Text>
            </TouchableOpacity>
          </View>
        ) : completed ? (
          <View style={styles.card}>
            <View style={[styles.resultBadge, result?.isMatch && styles.resultBadgeMatch]}>
              <Text style={styles.resultBadgeText}>{result?.isMatch ? "✅ Matched!" : "❌ Not Matched"}</Text>
            </View>

            <Text style={styles.questionText}>{question}</Text>

            <View style={styles.answersContainer}>
              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>Your Answer</Text>
                <Text style={styles.answerText}>{result?.yourAnswer}</Text>
              </View>

              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>{partnerName}'s Answer</Text>
                <Text style={styles.answerText}>{result?.partnerAnswer}</Text>
              </View>
            </View>

            <View style={styles.explanationBox}>
              <Text style={styles.explanationText}>{result?.explanation}</Text>
            </View>

            <View style={styles.streakBox}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>Streak: {result?.streak} days</Text>
            </View>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>Back to Profile</Text>
            </TouchableOpacity>
          </View>
        ) : userAnswered ? (
          <View style={styles.card}>
            <Text style={styles.questionText}>{question}</Text>

            <View style={styles.waitingBox}>
              <Text style={styles.waitingEmoji}>⏳</Text>
              <Text style={styles.waitingTitle}>Waiting for {partnerName}</Text>
              <Text style={styles.waitingText}>You've submitted your answer. Check back when they respond!</Text>
            </View>

            <View style={styles.timerBox}>
              <Text style={styles.timerText}>{getTimeRemaining()}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.questionText}>{question}</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your Answer</Text>
              <TextInput
                style={styles.input}
                placeholder="Type your answer..."
                placeholderTextColor="rgba(168, 85, 247, 0.4)"
                value={answer}
                onChangeText={setAnswer}
                multiline
                numberOfLines={3}
                editable={!submitting}
              />
            </View>

            {partnerAnswered && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>✨ {partnerName} has already answered!</Text>
              </View>
            )}

            <View style={styles.timerBox}>
              <Text style={styles.timerText}>{getTimeRemaining()}</Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, submitting && styles.buttonDisabled]}
              onPress={handleSubmitAnswer}
              disabled={submitting}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>{submitting ? "Submitting..." : "Submit Answer 💫"}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>How Daily Challenges Work</Text>
          <Text style={styles.infoCardText}>• One challenge per partner per day</Text>
          <Text style={styles.infoCardText}>• Both players have 24 hours to answer</Text>
          <Text style={styles.infoCardText}>• Matching answers increase your streak</Text>
          <Text style={styles.infoCardText}>• Missing a challenge resets your streak</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 32,
    fontWeight: "500",
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#A855F7",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 2,
    borderColor: "#E9D5FF",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
    fontWeight: "600",
    minHeight: 100,
    textAlignVertical: "top",
  },
  primaryButton: {
    backgroundColor: "#A855F7",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "700",
  },
  waitingBox: {
    alignItems: "center",
    paddingVertical: 20,
  },
  waitingEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  waitingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  waitingText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  timerBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  timerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
  },
  infoBox: {
    backgroundColor: "#DBEAFE",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
    textAlign: "center",
  },
  resultBadge: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 20,
  },
  resultBadgeMatch: {
    backgroundColor: "#D1FAE5",
  },
  resultBadgeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  answersContainer: {
    gap: 12,
    marginBottom: 20,
  },
  answerBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#A855F7",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  answerText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },
  explanationBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  explanationText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  streakBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#92400E",
  },
  infoCard: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 20,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  infoCardText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
    lineHeight: 20,
  },
})
