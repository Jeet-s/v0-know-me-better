"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { checkAnswersMatch } from "../utils/gameLogic"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  roundText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  progressBar: {
    width: "80%",
    height: 20,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
  content: {
    width: "80%",
    alignItems: "center",
  },
  emoji: {
    fontSize: 50,
    marginBottom: 20,
  },
  question: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  waitingContainer: {
    width: "100%",
    alignItems: "center",
  },
  waitingEmoji: {
    fontSize: 50,
    marginBottom: 20,
  },
  waitingText: {
    fontSize: 24,
    textAlign: "center",
  },
})

export default function GameScreen({ navigation, route }: any) {
  const { roomCode, playerName, questions, round, score } = route.params

  const currentRound = round
  const currentScore = score
  const question = questions[currentRound - 1]

  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setAnswer("")
    setSubmitted(false)
  }, [currentRound])

  const handleSubmit = () => {
    if (!answer.trim()) {
      Alert.alert("Error", "Please enter an answer")
      return
    }

    setSubmitted(true)

    // Simulate partner answering (mock data)
    setTimeout(() => {
      const partnerAnswer = generateMockAnswer(question)
      const isMatch = checkAnswersMatch(answer.trim(), partnerAnswer)
      const newScore = isMatch ? currentScore + 1 : currentScore

      if (currentRound < 5) {
        console.log(isMatch ? "Match! 🎉" : "Different answers", `You: ${answer.trim()}\nPartner: ${partnerAnswer}`)
        // Show quick feedback
        setTimeout(() => {

navigation.push("Game", {
                roomCode,
                playerName,
                questions,
                round: currentRound + 1,
                score: newScore,
              })
        }, 5000);
        
      } else {
        console.log(isMatch ? "Match! 🎉" : "Different answers", `You: ${answer.trim()}\nPartner: ${partnerAnswer}`)
        // Show quick feedback
        setTimeout(() => {
navigation.replace("Results", {
                roomCode,
                playerName,
                score: newScore,
                total: 5,
              })
          
        }, 5000);
        
      }
    }, 1500)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <Text style={styles.roundText}>
          Round {currentRound}/5 • Score: {currentScore}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentRound / 5) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.emoji}>💭</Text>
        <Text style={styles.question}>{question}</Text>

        {!submitted ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your answer..."
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
            >
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingEmoji}>⏳</Text>
            <Text style={styles.waitingText}>Checking answers...</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

function generateMockAnswer(question: string): string {
  const mockAnswers: Record<string, string[]> = {
    food: ["Pizza", "Sushi", "Tacos", "Pasta", "Burgers"],
    comfort: ["Mac and cheese", "Ice cream", "Chocolate", "Pizza", "Soup"],
    coffee: ["Latte", "Cappuccino", "Black coffee", "Iced coffee", "Espresso"],
    movie: ["The Shawshank Redemption", "Inception", "The Dark Knight", "Pulp Fiction", "Forrest Gump"],
    music: ["Pop", "Rock", "Hip hop", "Jazz", "Electronic"],
    season: ["Summer", "Fall", "Winter", "Spring"],
    vacation: ["Beach", "Mountains", "City", "Countryside"],
    color: ["Blue", "Green", "Red", "Purple", "Black"],
  }

  const lowerQuestion = question.toLowerCase()

  if (lowerQuestion.includes("food") || lowerQuestion.includes("eat")) {
    return mockAnswers.food[Math.floor(Math.random() * mockAnswers.food.length)]
  }
  if (lowerQuestion.includes("comfort")) {
    return mockAnswers.comfort[Math.floor(Math.random() * mockAnswers.comfort.length)]
  }
  if (lowerQuestion.includes("coffee") || lowerQuestion.includes("tea")) {
    return mockAnswers.coffee[Math.floor(Math.random() * mockAnswers.coffee.length)]
  }
  if (lowerQuestion.includes("movie")) {
    return mockAnswers.movie[Math.floor(Math.random() * mockAnswers.movie.length)]
  }
  if (lowerQuestion.includes("music")) {
    return mockAnswers.music[Math.floor(Math.random() * mockAnswers.music.length)]
  }
  if (lowerQuestion.includes("season")) {
    return mockAnswers.season[Math.floor(Math.random() * mockAnswers.season.length)]
  }
  if (lowerQuestion.includes("vacation") || lowerQuestion.includes("beach") || lowerQuestion.includes("mountain")) {
    return mockAnswers.vacation[Math.floor(Math.random() * mockAnswers.vacation.length)]
  }
  if (lowerQuestion.includes("color")) {
    return mockAnswers.color[Math.floor(Math.random() * mockAnswers.color.length)]
  }

  return "Something interesting"
}
