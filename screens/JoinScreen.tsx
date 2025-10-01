"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { generateRoomCode } from "../utils/gameLogic"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
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
  form: {
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default function JoinScreen({ navigation, route }: any) {
  const { mode } = route.params
  const isCreating = mode === "create"

  const [playerName, setPlayerName] = useState("")
  const [roomCode, setRoomCode] = useState("")

  const handleSubmit = () => {
    if (!playerName.trim()) {
      Alert.alert("Error", "Please enter your name")
      return
    }

    if (!isCreating && !roomCode.trim()) {
      Alert.alert("Error", "Please enter a room code")
      return
    }

    const finalRoomCode = isCreating ? generateRoomCode() : roomCode.toUpperCase()

    navigation.navigate("Waiting", {
      roomCode: finalRoomCode,
      playerName: playerName.trim(),
      isHost: isCreating,
    })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.emoji}>{isCreating ? "🎮" : "🔗"}</Text>
        <Text style={styles.title}>{isCreating ? "Create Room" : "Join Room"}</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
            autoCapitalize="words"
          />

          {!isCreating && (
            <TextInput
              style={styles.input}
              placeholder="Room Code"
              value={roomCode}
              onChangeText={(text) => setRoomCode(text.toUpperCase())}
              maxLength={6}
              autoCapitalize="characters"
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{isCreating ? "Create" : "Join"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
