"use client"

import { useEffect, useRef, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useAuth } from "../contexts/AuthContext"
import socketService from "../services/socket"
import { partnersAPI } from "../services/api"

interface Partner {
  partnerId: string
  partnerName: string
  hasPendingChallenge: boolean
}

export default function HomeScreen({ navigation }: any) {
  const { user, signOut } = useAuth()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const floatAnim = useRef(new Animated.Value(0)).current
  const [pendingChallenges, setPendingChallenges] = useState<Partner[]>([])
  const [loadingChallenges, setLoadingChallenges] = useState(true)



  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Load pending challenges
    loadPendingChallenges()
  }, [])

  const loadPendingChallenges = async () => {
    try {
      const response = await partnersAPI.getPartners()
      const withPendingChallenges = response.partners.filter((p: any) => p.hasPendingChallenge)
      setPendingChallenges(withPendingChallenges)
    } catch (error) {
      console.error("[v0] Load pending challenges error:", error)
    } finally {
      setLoadingChallenges(false)
    }
  }

  return (
    <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hey, {user?.name?.split(" ")[0]}!</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
            <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          <Animated.Text
            style={[
              styles.emoji,
              {
                transform: [{ translateY: floatAnim }],
              },
            ]}
          >
            💕
          </Animated.Text>

          <Text style={styles.title}>Know Me Better</Text>
          <Text style={styles.subtitle}>Discover how in sync you really are</Text>

          {/* Pending Challenges Section */}
          {!loadingChallenges && pendingChallenges.length > 0 && (
            <View style={styles.challengesSection}>
              <View style={styles.challengesHeader}>
                <Text style={styles.challengesTitle}>📩 Pending Challenges</Text>
                <View style={styles.challengesBadge}>
                  <Text style={styles.challengesBadgeText}>{pendingChallenges.length}</Text>
                </View>
              </View>
              {pendingChallenges.map((partner) => (
                <TouchableOpacity
                  key={partner.partnerId}
                  style={styles.challengeCard}
                  onPress={() =>
                    navigation.navigate("DailyChallenge", {
                      partnerId: partner.partnerId,
                      partnerName: partner.partnerName,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <View style={styles.challengeCardContent}>
                    <View style={styles.challengeAvatar}>
                      <Text style={styles.challengeAvatarText}>{partner.partnerName.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.challengeInfo}>
                      <Text style={styles.challengeName}>{partner.partnerName}</Text>
                      <Text style={styles.challengeText}>Sent you a challenge!</Text>
                    </View>
                    <Text style={styles.challengeArrow}>→</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("Join", { mode: "create" })}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonEmoji}>🎮</Text>
                <Text style={styles.buttonText}>Create Room</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Join", { mode: "join" })}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonEmoji}>🔗</Text>
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Join Room</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.partnersButton}
              onPress={() => navigation.navigate("PartnersList")}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonEmoji}>👥</Text>
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>My Partners</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.descriptionCard}>
            <Text style={styles.description}>5 fun questions • Real-time answers • Instant results</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  content: {
    alignItems: "center",
    width: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 32,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  signOutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  signOutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
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
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 48,
    textAlign: "center",
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  partnersButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonEmoji: {
    fontSize: 24,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#A855F7",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
  },
  descriptionCard: {
    marginTop: 32,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backdropFilter: "blur(10px)",
  },
  description: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
  },
  challengesSection: {
    width: "100%",
    marginBottom: 24,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  challengesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  challengesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  challengesBadge: {
    backgroundColor: "#EF4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  challengesBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  challengeCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  challengeCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  challengeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A855F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  challengeAvatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  challengeText: {
    fontSize: 14,
    color: "#92400E",
    fontWeight: "600",
  },
  challengeArrow: {
    fontSize: 20,
    color: "#92400E",
    fontWeight: "700",
  },
})
