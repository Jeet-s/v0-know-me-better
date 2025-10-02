"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { partnersAPI } from "../services/api"

interface HistoryItem {
  question: string
  answerA: string
  answerB: string
  verdict: string
  resultText: string
  date: string
  theme?: string
}

interface PartnerProfile {
  partner: {
    id: string
    name: string
    email: string
  }
  gamesPlayed: number
  streak: number
  lastPlayed: string
  history: HistoryItem[]
}

export default function PartnerProfileScreen({ navigation, route }: any) {
  const { partnerId } = route.params
  const [profile, setProfile] = useState<PartnerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"history" | "streak">("history")

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await partnersAPI.getPartnerProfile(partnerId)
      setProfile(response)
    } catch (error) {
      console.error("[v0] Load profile error:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadProfile()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (loading) {
    return (
      <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </LinearGradient>
    )
  }

  if (!profile) {
    return (
      <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Partner not found</Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />}
      >
        {/* Partner Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.partner.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.partnerName}>{profile.partner.name}</Text>
          <Text style={styles.partnerEmail}>{profile.partner.email}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statEmoji}>🎮</Text>
              <Text style={styles.statNumber}>{profile.gamesPlayed}</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statNumber}>{profile.streak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statEmoji}>📅</Text>
              <Text style={styles.statNumber}>{formatDate(profile.lastPlayed)}</Text>
              <Text style={styles.statLabel}>Last Played</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.challengeButton}
            onPress={() => navigation.navigate("DailyChallenge", { partnerId, partnerName: profile.partner.name })}
            activeOpacity={0.8}
          >
            <Text style={styles.challengeButtonText}>💌 Send Daily Challenge</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "history" && styles.activeTab]}
            onPress={() => setActiveTab("history")}
          >
            <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "streak" && styles.activeTab]}
            onPress={() => setActiveTab("streak")}
          >
            <Text style={[styles.tabText, activeTab === "streak" && styles.activeTabText]}>Streak</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === "history" ? (
          <View style={styles.historyContainer}>
            {profile.history.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📝</Text>
                <Text style={styles.emptyText}>No game history yet</Text>
              </View>
            ) : (
              profile.history.map((item, index) => (
                <View key={index} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyQuestion}>{item.question}</Text>
                    <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
                  </View>

                  {item.theme && (
                    <View style={styles.themeTag}>
                      <Text style={styles.themeTagText}>{item.theme}</Text>
                    </View>
                  )}

                  <View style={styles.answersContainer}>
                    <View style={styles.answerBubble}>
                      <Text style={styles.answerLabel}>You</Text>
                      <Text style={styles.answerText}>{item.answerA}</Text>
                    </View>

                    <View style={styles.answerBubble}>
                      <Text style={styles.answerLabel}>{profile.partner.name}</Text>
                      <Text style={styles.answerText}>{item.answerB}</Text>
                    </View>
                  </View>

                  <View style={[styles.verdictBadge, item.verdict === "Matched" && styles.verdictMatched]}>
                    <Text style={styles.verdictText}>
                      {item.verdict === "Matched" ? "✅ Matched" : "❌ Not Matched"}
                    </Text>
                  </View>

                  <Text style={styles.resultText}>{item.resultText}</Text>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.streakContainer}>
            <View style={styles.streakCard}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakNumber}>{profile.streak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
              <Text style={styles.streakDescription}>
                {profile.streak === 0
                  ? "Play a game to start your streak!"
                  : profile.streak === 1
                    ? "Great start! Keep it going!"
                    : `Amazing! You've played ${profile.streak} days in a row!`}
              </Text>
            </View>

            <View style={styles.streakInfo}>
              <Text style={styles.streakInfoTitle}>How Streaks Work</Text>
              <Text style={styles.streakInfoText}>
                • Play a game with this partner on consecutive days to build your streak
              </Text>
              <Text style={styles.streakInfoText}>• Streaks reset if you skip a day</Text>
              <Text style={styles.streakInfoText}>• Daily challenges also count towards your streak</Text>
            </View>
          </View>
        )}
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
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#A855F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  partnerName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  partnerEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  statBox: {
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  challengeButton: {
    backgroundColor: "#A855F7",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
  },
  challengeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#A855F7",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  historyContainer: {
    gap: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    marginBottom: 16,
  },
  historyQuestion: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  answersContainer: {
    gap: 12,
    marginBottom: 12,
  },
  answerBubble: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A855F7",
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    color: "#1F2937",
  },
  verdictBadge: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  verdictMatched: {
    backgroundColor: "#D1FAE5",
  },
  verdictText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2937",
  },
  resultText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  streakContainer: {
    gap: 20,
  },
  streakCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  streakEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: "900",
    color: "#A855F7",
    marginBottom: 8,
  },
  streakLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  streakDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  streakInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 20,
  },
  streakInfoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  streakInfoText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
    lineHeight: 20,
  },
  themeTag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  themeTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A855F7",
  },
})
