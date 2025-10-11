import express from "express"
import { authenticateToken, type AuthRequest } from "../middleware/auth"
import PartnerRelation from "../models/PartnerRelation"

const router = express.Router()

// Get all partners
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId

    // Find all partner relations where user is either userA or userB
    const relations = await PartnerRelation.find({
      $or: [{ userA: userId }, { userB: userId }],
    })
      .populate("userA", "name email")
      .populate("userB", "name email")
      .sort({ lastPlayed: -1 })

    // Format the response
    const partners = relations.map((relation) => {
      const isUserA = relation.userA._id.toString() === userId
      const partner = isUserA ? relation.userB : relation.userA

      // Check if there's a pending challenge for this user
      let hasPendingChallenge = false
      if (relation.dailyChallengeQuestion && !relation.dailyChallengeCompleted) {
        // Check if challenge is still valid (within 24 hours)
        const challengeDate = relation.dailyChallengeDate
        if (challengeDate) {
          const now = new Date()
          const hoursDiff = (now.getTime() - challengeDate.getTime()) / (1000 * 60 * 60)
          
          if (hoursDiff <= 24) {
            // Check if current user hasn't answered yet
            const userAnswered = isUserA ? !!relation.dailyChallengeAnswerA : !!relation.dailyChallengeAnswerB
            hasPendingChallenge = !userAnswered
          }
        }
      }

      return {
        partnerId: partner._id,
        partnerName: (partner as any).name,
        partnerEmail: (partner as any).email,
        gamesPlayed: relation.gamesPlayed,
        streak: relation.streak,
        lastPlayed: relation.lastPlayed,
        hasPendingChallenge,
      }
    })

    res.json({ partners })
  } catch (error) {
    console.error("[v0] Get partners error:", error)
    res.status(500).json({ error: "Failed to get partners" })
  }
})

// Get partner profile (history + streak)
router.get("/:partnerId", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const { partnerId } = req.params

    // Find the partner relation
    const relation = await PartnerRelation.findOne({
      $or: [
        { userA: userId, userB: partnerId },
        { userA: partnerId, userB: userId },
      ],
    }).populate("userA userB", "name email")

    if (!relation) {
      return res.status(404).json({ error: "Partner not found" })
    }

    const isUserA = relation.userA._id.toString() === userId
    const partner = isUserA ? relation.userB : relation.userA

    res.json({
      partner: {
        id: partner._id,
        name: (partner as any).name,
        email: (partner as any).email,
      },
      gamesPlayed: relation.gamesPlayed,
      streak: relation.streak,
      lastPlayed: relation.lastPlayed,
      history: relation.history,
    })
  } catch (error) {
    console.error("[v0] Get partner profile error:", error)
    res.status(500).json({ error: "Failed to get partner profile" })
  }
})

export default router
