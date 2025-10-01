"use client"

import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Share } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"

const VIBE_TITLES = [
  { min: 0, max: 1, title: "Strangers in Love", emoji: "🤷" },
  { min: 2, max: 2, title: "Getting to Know You", emoji: "👋" },
  { min: 3, max: 3, title: "On the Same Wavelength", emoji: "📡" },
  { min: 4, max: 4, title: "Mind Readers", emoji: "🔮" },
  { min: 5, max: 5, title: "Soulmates", emoji: "💕" },
]

function getVibeTitle(score: number) {
  return VIBE_TITLES.find((vibe) => score >= vibe.min && score <= vibe.max) || VIBE_TITLES[0]
}

export default function ResultsScreen() {
  const router = useRouter()
  const { roomCode, playerName, finalScore, totalRounds, rounds } = useLocalSearchParams()

  const score = Number(finalScore)
  const total = Number(totalRounds)
  const vibe = getVibeTitle(score)
  const percentage = Math.round((score / total) * 100)

  const parsedRounds = rounds ? JSON.parse(rounds as string) : []

  const handleShare = async () => {
    try {
      await Share.share({
        message: `We scored ${score}/${total} on Know Me Better! We're "${vibe.title}" ${vibe.emoji}\n\nPlay with your partner: [App Link]`,
      })
    } catch (error) {
      console.error("[v0] Error sharing:", error)
    }
  }

  const handlePlayAgain = () => {
    router.push("/")
  }

  return (
    <LinearGradient colors={["#FFF5F7", "#FFE8EC", "#FFF0F5"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="bounceIn" duration={1000} style={styles.header}>
          <Text style={styles.emoji}>{vibe.emoji}</Text>
          <Text style={styles.title}>{vibe.title}</Text>
          <Text style={styles.subtitle}>Your Couple Vibe</Text>
        </Animatable.View>

        <Animatable.View animation="fadeIn" delay={300} duration={800} style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Final Score</Text>
          <Text style={styles.scoreValue}>
            {score} / {total}
          </Text>
          <Text style={styles.percentageText}>{percentage}% Match</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={500} duration={800} style={styles.roundsContainer}>
          <Text style={styles.roundsTitle}>Round Breakdown</Text>

          {parsedRounds.map((round: any, index: number) => (
            <View key={index} style={styles.roundCard}>
              <View style={styles.roundHeader}>
                <Text style={styles.roundNumber}>Round {index + 1}</Text>
                <Text style={styles.roundResult}>{round.isMatch ? "✅ Match" : "❌ No Match"}</Text>
              </View>

              <Text style={styles.roundQuestion}>{round.question}</Text>

              <View style={styles.roundAnswers}>
                {round.answers.map((ans: any, ansIndex: number) => (
                  <View key={ansIndex} style={styles.roundAnswer}>
                    <Text style={styles.roundAnswerPlayer}>{ans.playerName}:</Text>
                    <Text style={styles.roundAnswerText}>{ans.answer}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={700} duration={800} style={styles.buttonContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Share Results</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
        </Animatable.View>
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
    marginTop: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#8B5A7C",
  },
  scoreCard: {
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD4E5",
    gap: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#8B5A7C",
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FF6B9D",
  },
  percentageText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#8B5A7C",
  },
  roundsContainer: {
    gap: 12,
  },
  roundsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B5A7C",
    marginBottom: 8,
  },
  roundCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFD4E5",
    gap: 12,
  },
  roundHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roundNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8B5A7C",
  },
  roundResult: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B9D",
  },
  roundQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  roundAnswers: {
    gap: 8,
  },
  roundAnswer: {
    flexDirection: "row",
    gap: 8,
  },
  roundAnswerPlayer: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B9D",
  },
  roundAnswerText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  shareButton: {
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
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  playAgainButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF6B9D",
  },
  playAgainButtonText: {
    color: "#FF6B9D",
    fontSize: 18,
    fontWeight: "bold",
  },
})
