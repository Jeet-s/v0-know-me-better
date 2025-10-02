import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = "http://localhost:3001/api"

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  googleSignIn: async (idToken: string) => {
    const response = await api.post("/auth/google", { idToken })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },
}

export const partnersAPI = {
  getPartners: async () => {
    const response = await api.get("/partners")
    return response.data
  },

  getPartnerProfile: async (partnerId: string) => {
    const response = await api.get(`/partners/${partnerId}`)
    return response.data
  },
}

export const challengesAPI = {
  sendChallenge: async (partnerId: string) => {
    const response = await api.post("/challenges/send", { partnerId })
    return response.data
  },

  submitAnswer: async (partnerId: string, answer: string) => {
    const response = await api.post("/challenges/answer", { partnerId, answer })
    return response.data
  },

  getActiveChallenge: async (partnerId: string) => {
    const response = await api.get(`/challenges/active/${partnerId}`)
    return response.data
  },
}

export default api
