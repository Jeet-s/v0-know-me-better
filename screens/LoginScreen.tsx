"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useAuth } from "../contexts/AuthContext"

export default function LoginScreen() {
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signIn()
    } catch (error: any) {
      Alert.alert("Sign In Failed", error.message || "Could not sign in with Google. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>💕</Text>
        <Text style={styles.title}>Know Me Better</Text>
        <Text style={styles.subtitle}>Sign in to save your games and track your vibes with partners</Text>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🎮</Text>
            <Text style={styles.featureText}>Play fun games with friends</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🔥</Text>
            <Text style={styles.featureText}>Build streaks with partners</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>💌</Text>
            <Text style={styles.featureText}>Send daily challenges</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleGoogleSignIn}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#A855F7" />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.buttonText}>Sign in with Google</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>Free forever • No subscriptions • No ads</Text>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 24,
  },
  features: {
    width: "100%",
    marginBottom: 40,
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    flex: 1,
  },
  signInButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  googleIcon: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4285F4",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  disclaimer: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontWeight: "500",
  },
})
