"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { partnersAPI } from "../services/api"

interface Partner {
  partnerId: string
  partnerName: string
  partnerEmail: string
  gamesPlayed: number
  streak: number
  lastPlayed: string
  hasPendingChallenge: boolean
}

export default function PartnersListScreen({ navigation }: any) {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    try {
      const response = await partnersAPI.getPartners()
      setPartners(response.partners)
    } catch (error) {
      console.error("[v0] Load partners error:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadPartners()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const renderPartner = ({ item }: { item: Partner }) => (
    <TouchableOpacity
      style={styles.partnerCard}
      onPress={() => navigation.navigate("PartnerProfile", { partnerId: item.partnerId })}
      activeOpacity={0.8}
    >
      <View style={styles.partnerHeader}>
        <View style={styles.partnerAvatar}>
          <Text style={styles.partnerInitial}>{item.partnerName.charAt(0).toUpperCase()}</Text>
          {item.hasPendingChallenge && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>!</Text>
            </View>
          )}
        </View>
        <View style={styles.partnerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.partnerName}>{item.partnerName}</Text>
            {item.hasPendingChallenge && (
              <View style={styles.challengeBadge}>
                <Text style={styles.challengeBadgeText}>📩 Challenge</Text>
              </View>
            )}
          </View>
          <Text style={styles.partnerEmail}>{item.partnerEmail}</Text>
        </View>
      </View>

      <View style={styles.partnerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>🎮</Text>
          <Text style={styles.statValue}>{item.gamesPlayed}</Text>
          <Text style={styles.statLabel}>Games</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statValue}>{item.streak}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>📅</Text>
          <Text style={styles.statValue}>{formatDate(item.lastPlayed)}</Text>
          <Text style={styles.statLabel}>Last Played</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <LinearGradient colors={["#FF6B9D", "#A855F7", "#06B6D4"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
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
        <Text style={styles.title}>My Partners</Text>
      </View>

      {partners.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>👥</Text>
          <Text style={styles.emptyTitle}>No Partners Yet</Text>
          <Text style={styles.emptyText}>Play a game with someone to add them as a partner!</Text>
        </View>
      ) : (
        <FlatList
          data={partners}
          renderItem={renderPartner}
          keyExtractor={(item) => item.partnerId}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />}
        />
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
    paddingHorizontal: 24,
    paddingBottom: 20,
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
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  partnerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  partnerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  partnerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#A855F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  partnerInitial: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  notificationBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  partnerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  partnerName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  challengeBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  challengeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  partnerEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  partnerStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  statItem: {
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
})
