"use client"

import { useEffect, useState, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import socketService from "../services/socket"

export default function WaitingScreen({ navigation, route }: any) {
  const { roomCode, playerName, playerId, isHost, selectedTheme } = route.params
  const [players, setPlayers] = useState([{ id: playerId, name: playerName }])
  const [countdown, setCountdown] = useState(3)
  const [showCountdown, setShowCountdown] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(selectedTheme || null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  // Debug logging
  console.log("[v0] WaitingScreen - isHost:", isHost, "playerName:", playerName)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Request current room state when component loads
    socketService.getRoomState(roomCode)

    socketService.onRoomState((data) => {
      console.log("[v0] Room state received:", data)
      setPlayers(data.players)
      if (data.theme) {
        setCurrentTheme(data.theme)
      }
    })

    socketService.onPlayerJoined((data) => {
      console.log("[v0] Player joined event:", data)
      setPlayers(data.players)
    })

    socketService.onThemeSelected((data) => {
      console.log("[v0] Theme selected:", data.theme)
      setCurrentTheme(data.theme)
    })

    socketService.onGameStarted((data) => {
      console.log("[v0] Game started:", data)
      navigation.replace("Game", {
        roomCode,
        playerName,
        playerId,
        questions: data.questions,
        currentRound: data.currentRound,
        theme: data.theme,
        answerer: data.answerer,
      })
    })

    socketService.onPlayerLeft((data) => {
      console.log("[v0] Player left:", data)
      setPlayers(data.players)
      Alert.alert("Player Left", "Your partner has left the game")
    })

    return () => {
      socketService.off("room-state")
      socketService.off("player-joined")
      socketService.off("theme-selected")
      socketService.off("game-started")
      socketService.off("player-left")
    }
  }, [roomCode, playerId]) // Add dependencies to re-establish listeners when room changes


  const handleStartGame = () => {
    if (players.length < 2) {
      Alert.alert("Wait!", "You need 2 players to start the game")
      return
    }

    if (!currentTheme) {
      Alert.alert("Select Theme", "Please select a theme before starting")
      return
    }

    setShowCountdown(true)
  }

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (showCountdown && countdown === 0) {
      socketService.startGame(roomCode, currentTheme!)
    }
  }, [showCountdown, countdown])

  return (
    <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
      {showCountdown ? (
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Animated.Text style={[styles.countdownEmoji, { transform: [{ scale: pulseAnim }] }]}>🎮</Animated.Text>
          <Text style={styles.countdownText}>{countdown}</Text>
          <Text style={styles.countdownLabel}>Get Ready!</Text>
        </Animated.View>
      ) : (
        <>
          <View style={styles.header}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <Animated.Text style={[styles.emoji, { transform: [{ scale: pulseAnim }] }]}>
                {players.length < 2 ? "⏳" : "✨"}
              </Animated.Text>
              <Text style={styles.title}>Waiting Room</Text>
            </Animated.View>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >

            <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>Room Code</Text>
              <Text style={styles.code}>{roomCode}</Text>
              <Text style={styles.codeHint}>Share this code with your partner</Text>
            </View>

            {currentTheme && (
              <View style={styles.themeCard}>
                <Text style={styles.themeLabel}>Selected Theme</Text>
                <Text style={styles.themeName}>{currentTheme}</Text>
              </View>
            )}

            <View style={styles.playersContainer}>
              <Text style={styles.playersTitle}>Players ({players.length}/2)</Text>
              {players.map((player, index) => (
                <View key={player.id} style={styles.playerCard}>
                  <View style={styles.playerAvatar}>
                    <Text style={styles.playerEmoji}>{index === 0 ? "👤" : "💕"}</Text>
                  </View>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <View style={styles.readyBadge}>
                    <Text style={styles.readyText}>✓</Text>
                  </View>
                </View>
              ))}
              {players.length < 2 && (
                <View style={[styles.playerCard, styles.emptyPlayerCard]}>
                  <View style={styles.playerAvatar}>
                    <Text style={styles.playerEmoji}>👥</Text>
                  </View>
                  <Text style={[styles.playerName, styles.emptyPlayerName]}>Waiting for partner...</Text>
                </View>
              )}
            </View>

            {isHost && (
              <TouchableOpacity
                style={[styles.startButton, (players.length < 2 || !currentTheme) && styles.startButtonDisabled]}
                onPress={handleStartGame}
                activeOpacity={0.8}
                disabled={players.length < 2 || !currentTheme}
              >
                <Text style={styles.startButtonText}>
                  {players.length < 2
                    ? "Waiting for Partner..."
                    : !currentTheme
                      ? "Theme Loading..."
                      : "Start Game 🚀"}
                </Text>
              </TouchableOpacity>
            )}

            {!isHost && (
              <View style={styles.noteCard}>
                <Text style={styles.note}>Waiting for host to start the game...</Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
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
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 16,
    letterSpacing: -1,
    textAlign: "center",
  },
  codeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  code: {
    fontSize: 48,
    fontWeight: "900",
    color: "#A855F7",
    letterSpacing: 8,
    marginBottom: 8,
  },
  codeHint: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  playersContainer: {
    width: "100%",
    marginBottom: 24,
  },
  playersTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  emptyPlayerCard: {
    opacity: 0.5,
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  playerEmoji: {
    fontSize: 24,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    flex: 1,
  },
  emptyPlayerName: {
    color: "#9CA3AF",
  },
  readyBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  readyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  startButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  startButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  startButtonText: {
    color: "#A855F7",
    fontSize: 20,
    fontWeight: "800",
  },
  noteCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  note: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  countdownEmoji: {
    fontSize: 96,
    marginBottom: 24,
  },
  countdownText: {
    fontSize: 80,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  countdownLabel: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  themeCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    width: "100%",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  themeName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
})
