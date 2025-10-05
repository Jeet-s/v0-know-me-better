"use client"

import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import LoginScreen from "./screens/LoginScreen"
import HomeScreen from "./screens/HomeScreen"
import JoinScreen from "./screens/JoinScreen"
import WaitingScreen from "./screens/WaitingScreen"
import GameScreen from "./screens/GameScreen"
import ResultsScreen from "./screens/ResultsScreen"
import PartnersListScreen from "./screens/PartnersListScreen"
import PartnerProfileScreen from "./screens/PartnerProfileScreen"
import DailyChallengeScreen from "./screens/DailyChallengeScreen"
import ThemeSelectionScreen from "./screens/ThemeSelectionScreen"
import { useEffect } from "react"
import socketService from "./services/socket"

const Stack = createNativeStackNavigator()

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    socketService.connect()

    return () => {
      socketService.disconnect()
    }
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Join" component={JoinScreen} />
            <Stack.Screen name="Waiting" component={WaitingScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
            <Stack.Screen name="PartnersList" component={PartnersListScreen} />
            <Stack.Screen name="PartnerProfile" component={PartnerProfileScreen} />
            <Stack.Screen name="DailyChallenge" component={DailyChallengeScreen} />
            <Stack.Screen name="ThemeSelection" component={ThemeSelectionScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
})
