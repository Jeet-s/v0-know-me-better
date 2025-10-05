"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { authAPI } from "../services/api"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: "79127726549-eeb11vopajijhboc7ogmc2bp5pvdkckg.apps.googleusercontent.com", // Replace with your web client ID
      offlineAccess: true,
    })

    // Check if user is already logged in
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken")
      if (token) {
        const userData = await authAPI.getCurrentUser()
        setUser(userData.user)
      }
    } catch (error) {
      console.error("[v0] Auth check error:", error)
      await AsyncStorage.removeItem("authToken")
    } finally {
      setLoading(false)
    }
  }

  const signIn = async () => {
    try {
      setLoading(true)

      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices()

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn()

      if (!userInfo.idToken) {
        throw new Error("No ID token received")
      }

      // Send token to backend
      const response = await authAPI.googleSignIn(userInfo.idToken)

      // Save token and user data
      await AsyncStorage.setItem("authToken", response.token)
      setUser(response.user)

      console.log("[v0] Sign in successful:", response.user.name)
    } catch (error: any) {
      console.error("[v0] Sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await GoogleSignin.signOut()
      await AsyncStorage.removeItem("authToken")
      setUser(null)
      console.log("[v0] Sign out successful")
    } catch (error) {
      console.error("[v0] Sign out error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
