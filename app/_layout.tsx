import { Stack } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="join" />
        <Stack.Screen name="waiting" />
        <Stack.Screen name="game" />
        <Stack.Screen name="results" />
      </Stack>
    </SafeAreaProvider>
  )
}
