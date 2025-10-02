"use client"

import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useRef, useState } from "react"
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

export default function ThemeSelectionScreen({ navigation, route }: any) {
  const { roomCode, isHost } = route.params
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [])

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
  }

  const handleConfirm = () => {
    if (!selectedTheme) return

    socketService.selectTheme(roomCode, selectedTheme)

    navigation.navigate("Waiting", {
      ...route.params,
      selectedTheme,
    })
  }

  return (
    <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Choose Your Vibe ✨</Text>
        <Text style={styles.subtitle}>Pick a theme for your game</Text>

        <ScrollView style={styles.themesContainer} showsVerticalScrollIndicator={false}>
          {themes.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[styles.themeCard, selectedTheme === theme.id && styles.themeCardSelected]}
              onPress={() => handleThemeSelect(theme.id)}
              activeOpacity={0.8}
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

        <TouchableOpacity
          style={[styles.confirmButton, !selectedTheme && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          activeOpacity={0.8}
          disabled={!selectedTheme}
        >
          <Text style={styles.confirmButtonText}>{selectedTheme ? "Confirm Theme 🎮" : "Select a Theme"}</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 24,
    textAlign: "center",
  },
  themesContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 16,
  },
  themeCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "transparent",
  },
  themeCardSelected: {
    borderColor: "#FFFFFF",
  },
  themeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  themeEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#10B981",
  },
  confirmButton: {
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
  },
  confirmButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  confirmButtonText: {
    color: "#A855F7",
    fontSize: 18,
    fontWeight: "800",
  },
})
