"use client"

import { View, Text, TouchableOpacity, StyleSheet, Share, Animated, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { getVibeForScore } from "../data/vibes"
import { useEffect, useRef } from "react"
import socketService from "../services/socket"

export default function ResultsScreen({ navigation, route }: any) {
  const { score, total, vibeAnalysis, theme } = route.params

  const finalScore = score
  const totalQuestions = total
  const percentage = Math.round((finalScore / totalQuestions) * 100)
  const vibe = getVibeForScore(finalScore)

  const scaleAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleShare = async () => {
    try {
      await Share.share({
        message: `We scored ${finalScore}/${totalQuestions} (${percentage}%) on Know Me Better${theme ? ` - ${theme}` : ""}! ${vibeAnalysis || vibe.title}`,
      })
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handlePlayAgain = () => {
    socketService.disconnect()
    navigation.navigate("Home")
  }

  return (
    <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.emoji}>{vibe.emoji}</Text>
          <Text style={styles.title}>{vibe.title}</Text>

          {theme && (
            <View style={styles.themeTag}>
              <Text style={styles.themeText}>{theme}</Text>
            </View>
          )}

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            <Text style={styles.score}>
              {finalScore}/{totalQuestions}
            </Text>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentage}>{percentage}%</Text>
              <Text style={styles.percentageLabel}>Match</Text>
            </View>
          </View>

          {vibeAnalysis && (
            <View style={styles.vibeCard}>
              <Text style={styles.vibeTitle}>Your Vibe ✨</Text>
              <Text style={styles.vibeText}>{vibeAnalysis}</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handlePlayAgain} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Play Again 🔄</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleShare} activeOpacity={0.8}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Share Results 📤</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  content: {
    width: "90%",
    alignItems: "center",
  },
  emoji: {
    fontSize: 96,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 32,
    textAlign: "center",
    letterSpacing: -1,
  },
  scoreCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 40,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  score: {
    fontSize: 56,
    fontWeight: "900",
    color: "#A855F7",
    marginBottom: 16,
  },
  percentageContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  percentage: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FF6B9D",
  },
  percentageLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B7280",
  },
  vibeCard: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  vibeTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#A855F7",
    marginBottom: 12,
    textAlign: "center",
  },
  vibeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#A855F7",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
  },
  themeTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  themeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
})
