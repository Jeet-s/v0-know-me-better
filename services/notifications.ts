import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export async function registerForPushNotifications(): Promise<string | null> {
  try {
    // Check if we already have permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    // Request permission if not granted
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      console.log("[v0] Push notification permission denied")
      return null
    }

    // Get push token
    const token = (await Notifications.getExpoPushTokenAsync()).data
    console.log("[v0] Push token:", token)

    // Store token locally
    await AsyncStorage.setItem("pushToken", token)

    // Configure Android channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#A855F7",
      })
    }

    return token
  } catch (error) {
    console.error("[v0] Error registering for push notifications:", error)
    return null
  }
}

export async function sendLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Send immediately
  })
}

export async function scheduleDailyChallengeReminder(partnerName: string, hours = 12) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Daily Challenge Reminder 💌",
      body: `Don't forget to answer ${partnerName}'s challenge!`,
      sound: true,
    },
    trigger: {
      seconds: hours * 60 * 60,
    },
  })
}
