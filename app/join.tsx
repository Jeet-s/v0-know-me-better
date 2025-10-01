"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { socketService } from "@/services/socket"

export default function JoinScreen() {
  const router = useRouter()
  const { mode } = useLocalSearchParams()
  const isCreateMode = mode === "create"

  const [playerName, setPlayerName] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!playerName.trim()) {
      Alert.alert("Error", "Please enter your name")
      return
    }

    if (!isCreateMode && !roomCode.trim()) {
      Alert.alert("Error", "Please enter a room code")
      return
    }

    setLoading(true)

    try {
      await socketService.connect()

      if (isCreateMode) {
        socketService.createRoom(playerName, (response) => {
          if (response.success) {
            router.push({
              pathname: "/waiting",
              params: {
                roomCode: response.roomCode,
                playerName,
                isHost: "true",
              },
            })
          } else {
            Alert.alert("Error", response.message || "Failed to create room")
            setLoading(false)
          }
        })
      } else {
        socketService.joinRoom(roomCode.toUpperCase(), playerName, (response) => {
          if (response.success) {
            router.push({
              pathname: "/waiting",
              params: {
                roomCode: roomCode.toUpperCase(),
                playerName,
                isHost: "false",
              },
            })
          } else {
            Alert.alert("Error", response.message || "Failed to join room")
            setLoading(false)
          }
        })
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to server")
      setLoading(false)
    }
  }

  return (
    <LinearGradient colors={["#FFF5F7", "#FFE8EC", "#FFF0F5"]} style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
        <Text style={styles.emoji}>{isCreateMode ? "🎮" : "🤝"}</Text>
        <Text style={styles.title}>{isCreateMode ? "Create a Room" : "Join a Room"}</Text>
        <Text style={styles.subtitle}>
          {isCreateMode ? "Start a new game and share the code" : "Enter the room code to join"}
        </Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={200} duration={800} style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#C4A4B7"
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
          />
        </View>

        {!isCreateMode && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Room Code</Text>
            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="XXXX"
              placeholderTextColor="#C4A4B7"
              value={roomCode}
              onChangeText={(text) => setRoomCode(text.toUpperCase())}
              maxLength={4}
              autoCapitalize="characters"
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Connecting..." : isCreateMode ? "Create Room" : "Join Room"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  emoji: {
    fontSize: 60,
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
    fontSize: 14,
    color: "#8B5A7C",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  form: {
    width: "100%",
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5A7C",
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    fontSize: 16,
    color: "#333",
    borderWidth: 2,
    borderColor: "#FFD4E5",
  },
  codeInput: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 4,
  },
  button: {
    backgroundColor: "#FF6B9D",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#8B5A7C",
    fontSize: 16,
    fontWeight: "600",
  },
})
