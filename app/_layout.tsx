import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFF5F7" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="join" />
        <Stack.Screen name="waiting" />
        <Stack.Screen name="game" />
        <Stack.Screen name="results" />
      </Stack>
    </>
  )
}
