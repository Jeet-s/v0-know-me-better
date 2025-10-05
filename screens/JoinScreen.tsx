"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useAuth } from "../contexts/AuthContext"
import socketService from "../services/socket"

export default function JoinScreen({ navigation, route }: any) {
  const { mode } = route.params
  const isCreating = mode === "create"
  const { user } = useAuth()

  const [playerName, setPlayerName] = useState(user?.name || "")
  const [roomCode, setRoomCode] = useState("")
  const [loading, setLoading] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    console.log("[v0] Room code:", roomCode)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()

    socketService.onRoomCreated((data) => {
      console.log("[v0] Room created:", data)
      setLoading(false)
      navigation.navigate("Waiting", {
        roomCode: data.roomCode,
        playerName: data.player.name,
        playerId: data.player.id,
        isHost: true,
      })
    })

    socketService.onPlayerJoined((data) => {
      console.log("[v0] Player joined:", data)
      setLoading(false)
      const currentPlayer = data.player
      navigation.navigate("Waiting", {
        roomCode: roomCode.toUpperCase(),
        playerName: currentPlayer.name,
        playerId: currentPlayer.id,
        isHost: false,
      })
    })

    socketService.onError((error) => {
      console.error("[v0] Socket error:", error)
      setLoading(false)
      Alert.alert("Error", error.message || "Something went wrong")
    })

    return () => {
      socketService.off("room-created")
      socketService.off("player-joined")
      socketService.off("error")
    }
  }, [roomCode])

  const handleSubmit = () => {
    if (!playerName.trim()) {
      Alert.alert("Oops!", "Please enter your name")
      return
    }

    if (!isCreating && !roomCode.trim()) {
      Alert.alert("Oops!", "Please enter a room code")
      return
    }

    setLoading(true)

    if (isCreating) {
      socketService.createRoom(playerName.trim(), user?.id)
    } else {
      socketService.joinRoom(roomCode.toUpperCase().trim(), playerName.trim(), user?.id)
    }
  }

  return (
    <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.emoji}>{isCreating ? "🎮" : "🔗"}</Text>
        <Text style={styles.title}>{isCreating ? "Create Room" : "Join Room"}</Text>
        <Text style={styles.subtitle}>{isCreating ? "Start a new game session" : "Enter your room code"}</Text>

        <View style={styles.formCard}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="rgba(168, 85, 247, 0.4)"
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={20}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          {!isCreating && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Room Code</Text>
              <TextInput
                style={[styles.input, styles.codeInput]}
                placeholder="XXXX"
                placeholderTextColor="rgba(168, 85, 247, 0.4)"
                value={roomCode}
                onChangeText={(text) => setRoomCode(text.toUpperCase())}
                maxLength={4}
                autoCapitalize="characters"
                editable={!loading}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Connecting..." : isCreating ? "Create Room 🚀" : "Join Game 💫"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 72,
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
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 32,
    fontWeight: "500",
  },
  formCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
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
  },
  codeInput: {
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 4,
    fontWeight: "800",
  },
  submitButton: {
    backgroundColor: "#A855F7",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
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
})
