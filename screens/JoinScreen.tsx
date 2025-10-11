"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useAuth } from "../contexts/AuthContext"
import socketService from "../services/socket"

interface Theme {
  id: string
  name: string
  emoji: string
  colors: string[]
  description: string
}

const themes: Theme[] = [
  {
    id: "Classic",
    name: "Classic",
    emoji: "🎯",
    colors: ["#A855F7", "#EC4899"],
    description: "Mixed random questions",
  },
  {
    id: "Foodie Feels 🍕",
    name: "Foodie Feels",
    emoji: "🍕",
    colors: ["#F59E0B", "#FBBF24"],
    description: "All about food & flavors",
  },
  {
    id: "Love & Affection ❤️",
    name: "Love & Affection",
    emoji: "❤️",
    colors: ["#EC4899", "#F43F5E"],
    description: "Romance & connection",
  },
  {
    id: "Travel Goals ✈️",
    name: "Travel Goals",
    emoji: "✈️",
    colors: ["#06B6D4", "#0EA5E9"],
    description: "Adventures & destinations",
  },
  {
    id: "Daily Habits ☕",
    name: "Daily Habits",
    emoji: "☕",
    colors: ["#D4A574", "#C4B5A0"],
    description: "Everyday routines",
  },
  {
    id: "Childhood Memories 🧸",
    name: "Childhood Memories",
    emoji: "🧸",
    colors: ["#C084FC", "#E9D5FF"],
    description: "Nostalgic moments",
  },
  {
    id: "Flirty Fun 😏🔥",
    name: "Flirty Fun",
    emoji: "😏",
    colors: ["#DC2626", "#F87171"],
    description: "Playful & spicy",
  },
]

export default function JoinScreen({ navigation, route }: any) {
  const { mode } = route.params
  const isCreating = mode === "create"
  const { user } = useAuth()

  const [playerName, setPlayerName] = useState(user?.name || "")
  const [roomCode, setRoomCode] = useState("")
  const [selectedTheme, setSelectedTheme] = useState<string | null>("Classic")
  const [selectedRole, setSelectedRole] = useState<"answerer" | "guesser">("answerer")
  const [loading, setLoading] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    console.log("[v0] Room code:", roomCode)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()

    // Only listen for room-created if we're creating a room
    if (isCreating) {
      socketService.onRoomCreated((data) => {
        console.log("[v0] Room created:", data)
        setLoading(false)
        navigation.navigate("Waiting", {
          roomCode: data.roomCode,
          playerName: data.player.name,
          playerId: data.player.id,
          isHost: true,
          selectedTheme: selectedTheme,
        })
      })
    } else {
      // Only listen for player-joined if we're joining a room
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
    }

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
  }, [roomCode, isCreating])

  const handleSubmit = () => {
    if (!playerName.trim()) {
      Alert.alert("Oops!", "Please enter your name")
      return
    }

    if (!isCreating && !roomCode.trim()) {
      Alert.alert("Oops!", "Please enter a room code")
      return
    }

    if (isCreating && !selectedTheme) {
      Alert.alert("Select Theme", "Please choose a theme for your game")
      return
    }

    setLoading(true)

    if (isCreating) {
      socketService.createRoom(playerName.trim(), user?.id, selectedTheme!, selectedRole)
    } else {
      socketService.joinRoom(roomCode.toUpperCase().trim(), playerName.trim(), user?.id)
    }
  }

  return (
    <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          <Text style={styles.emoji}>{isCreating ? "🎮" : "🔗"}</Text>
          <Text style={styles.title}>{isCreating ? "Create Room" : "Join Room"}</Text>
          <Text style={styles.subtitle}>{isCreating ? "Start a new game session" : "Enter your room code"}</Text>
        </Animated.View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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

          {isCreating && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Your Role 🎭</Text>
                <Text style={styles.roleDescription}>
                  Choose whether you want to answer questions or guess your partner's answers
                </Text>
                <View style={styles.roleSelector}>
                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      selectedRole === "answerer" && styles.roleOptionSelected
                    ]}
                    onPress={() => setSelectedRole("answerer")}
                    activeOpacity={0.8}
                    disabled={loading}
                  >
                    <Text style={styles.roleEmoji}>✍️</Text>
                    <Text style={[
                      styles.roleTitle,
                      selectedRole === "answerer" && styles.roleTextSelected
                    ]}>
                      Answerer
                    </Text>
                    <Text style={styles.roleSubtext}>
                      You answer questions honestly
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleOption,
                      selectedRole === "guesser" && styles.roleOptionSelected
                    ]}
                    onPress={() => setSelectedRole("guesser")}
                    activeOpacity={0.8}
                    disabled={loading}
                  >
                    <Text style={styles.roleEmoji}>🎯</Text>
                    <Text style={[
                      styles.roleTitle,
                      selectedRole === "guesser" && styles.roleTextSelected
                    ]}>
                      Guesser
                    </Text>
                    <Text style={styles.roleSubtext}>
                      You guess your partner's answers
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Choose Theme ✨</Text>
                <ScrollView 
                  style={styles.themesScrollView} 
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                >
                  {themes.map((theme) => (
                    <TouchableOpacity
                      key={theme.id}
                      style={[
                        styles.themeCard,
                        selectedTheme === theme.id && styles.themeCardSelected
                      ]}
                      onPress={() => setSelectedTheme(theme.id)}
                      activeOpacity={0.8}
                      disabled={loading}
                    >
                      <LinearGradient colors={theme.colors} style={styles.themeGradient}>
                        <Text style={styles.themeEmoji}>{theme.emoji}</Text>
                        <View style={styles.themeInfo}>
                          <Text style={styles.themeName}>{theme.name}</Text>
                          <Text style={styles.themeDescription}>{theme.description}</Text>
                        </View>
                        {selectedTheme === theme.id && (
                          <View style={styles.checkmark}>
                            <Text style={styles.checkmarkText}>✓</Text>
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton, 
              (loading || (isCreating && !selectedTheme)) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading || (isCreating && !selectedTheme)}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Connecting..." : isCreating ? "Create Room 🚀" : "Join Game 💫"}
            </Text>
          </TouchableOpacity>
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
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerContent: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: -1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
    marginBottom: 16,
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
  themesScrollView: {
    maxHeight: 160,
    marginTop: 8,
  },
  themeCard: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  themeCardSelected: {
    borderColor: "#A855F7",
  },
  themeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  themeEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#10B981",
  },
  roleDescription: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
    lineHeight: 14,
  },
  roleSelector: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  roleOption: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E9D5FF",
  },
  roleOptionSelected: {
    borderColor: "#A855F7",
    backgroundColor: "#F3E8FF",
  },
  roleEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 2,
  },
  roleTextSelected: {
    color: "#A855F7",
  },
  roleSubtext: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 14,
  },
})
