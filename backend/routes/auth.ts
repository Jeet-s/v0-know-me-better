import express from "express"
import { OAuth2Client } from "google-auth-library"
import User from "../models/User"
import { generateToken } from "../middleware/auth"

const router = express.Router()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Google Sign-In
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      return res.status(400).json({ error: "Invalid token" })
    }

    const { sub: googleId, email, name } = payload

    // Find or create user
    let user = await User.findOne({ googleId })

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        partners: [],
      })
      console.log("[v0] New user created:", email)
    } else {
      // Update last active
      user.lastActive = new Date()
      await user.save()
    }

    // Generate JWT
    const token = generateToken(user._id.toString())

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("[v0] Google auth error:", error)
    res.status(500).json({ error: "Authentication failed" })
  }
})

// Get current user
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Access token required" })
    }

    const jwt = require("jsonwebtoken")
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

    const decoded: any = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-__v")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        partners: user.partners,
      },
    })
  } catch (error) {
    console.error("[v0] Get user error:", error)
    res.status(500).json({ error: "Failed to get user" })
  }
})

router.post("/push-token", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Access token required" })
    }

    const jwt = require("jsonwebtoken")
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

    const decoded: any = jwt.verify(token, JWT_SECRET)
    const { pushToken } = req.body

    const user = await User.findByIdAndUpdate(decoded.userId, { pushToken }, { new: true })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ message: "Push token updated" })
  } catch (error) {
    console.error("[v0] Update push token error:", error)
    res.status(500).json({ error: "Failed to update push token" })
  }
})

export default router
