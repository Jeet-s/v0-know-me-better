import { View, Text, TouchableOpacity, StyleSheet, Share } from "react-native"
import { getVibeForScore } from "../data/vibes"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
  content: {
    width: "80%",
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
  scoreCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
  },
  percentage: {
    fontSize: 18,
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "45%",
  },
  primaryButton: {
    backgroundColor: "#007bff",
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  secondaryButtonText: {
    color: "#000",
  },
})

export default function ResultsScreen({ navigation, route }: any) {
  const { score, total } = route.params

  const finalScore = score
  const totalQuestions = total
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
    navigation.navigate("Home")
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
