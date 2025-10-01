"use client"

import { View, Text, TouchableOpacity, StyleSheet, Share } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { getVibeForScore } from "../data/vibes"

export default function ResultsScreen() {
  const router = useRouter()
  const { score, total } = useLocalSearchParams()

  const finalScore = Number.parseInt(score as string)
  const totalQuestions = Number.parseInt(total as string)
  const percentage = Math.round((finalScore / totalQuestions) * 100)
  const vibe = getVibeForScore(finalScore)

  const handleShare = async () => {
    try {
      await Share.share({
        message: `We scored ${finalScore}/${totalQuestions} (${percentage}%) on Know Me Better! Our vibe: ${vibe.emoji} ${vibe.title}`,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handlePlayAgain = () => {
    router.replace("/")
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{vibe.emoji}</Text>
        <Text style={styles.title}>{vibe.title}</Text>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <Text style={styles.score}>
            {finalScore}/{totalQuestions}
          </Text>
          <Text style={styles.percentage}>{percentage}% Match</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleShare}>
            <Text style={styles.buttonText}>Share Results 📤</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handlePlayAgain}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Play Again 🔄</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginBottom: 40,
    textAlign: "center",
  },
  scoreCard: {
    backgroundColor: "#FFF",
    padding: 40,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 40,
    borderWidth: 3,
    borderColor: "#FFE5EC",
    width: "100%",
    maxWidth: 300,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#999",
    marginBottom: 10,
  },
  score: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginBottom: 5,
  },
  percentage: {
    fontSize: 20,
    color: "#666",
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
    gap: 15,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#FF6B9D",
  },
  secondaryButton: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#FF6B9D",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  secondaryButtonText: {
    color: "#FF6B9D",
  },
})
