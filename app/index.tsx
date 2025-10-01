"use client"
import { Text, TouchableOpacity, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"

export default function HomeScreen() {
  const router = useRouter()

  return (
    <LinearGradient colors={["#FFF5F7", "#FFE8EC", "#FFF0F5"]} style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
        <Text style={styles.emoji}>💕</Text>
        <Text style={styles.title}>Know Me Better</Text>
        <Text style={styles.subtitle}>How well do you really know each other?</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={300} duration={1000} style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/join?mode=create")}>
          <Text style={styles.primaryButtonText}>Create Room</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/join?mode=join")}>
          <Text style={styles.secondaryButtonText}>Join Room</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeIn" delay={600} duration={1000} style={styles.footer}>
        <Text style={styles.footerText}>Play together, grow closer 💖</Text>
      </Animatable.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#8B5A7C",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#FF6B9D",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF6B9D",
  },
  secondaryButtonText: {
    color: "#FF6B9D",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#8B5A7C",
    fontStyle: "italic",
  },
})
