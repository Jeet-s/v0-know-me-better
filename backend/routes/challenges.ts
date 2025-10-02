import express from "express"
import { authenticateToken, type AuthRequest } from "../middleware/auth"
import PartnerRelation from "../models/PartnerRelation"
import { analyzeAnswerMatch } from "../ai-matcher"

const router = express.Router()

// Get random challenge question
function getRandomChallengeQuestion(): string {
  const questions = [
    "What's your favorite comfort food?",
    "What's your go-to coffee or tea order?",
    "What's your ideal breakfast?",
    "What's your favorite movie of all time?",
    "What's your favorite music genre?",
    "What's your ideal way to relax after a long day?",
    "Beach vacation or mountain getaway?",
    "What's your ideal date night?",
    "What's your dream vacation destination?",
    "What's your favorite season?",
  ]
  return questions[Math.floor(Math.random() * questions.length)]
}

// Send daily challenge
router.post("/send", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const { partnerId } = req.body

    // Find the partner relation
    const relation = await PartnerRelation.findOne({
      $or: [
        { userA: userId, userB: partnerId },
        { userA: partnerId, userB: userId },
      ],
    })

    if (!relation) {
      return res.status(404).json({ error: "Partner not found" })
    }

    // Check if challenge already sent today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (relation.dailyChallengeDate && relation.dailyChallengeDate >= today) {
      return res.status(400).json({ error: "Challenge already sent today" })
    }

    // Create new challenge
    const question = getRandomChallengeQuestion()
    relation.dailyChallengeDate = new Date()
    relation.dailyChallengeQuestion = question
    relation.dailyChallengeAnswerA = undefined
    relation.dailyChallengeAnswerB = undefined
    relation.dailyChallengeCompleted = false

    await relation.save()

    res.json({
      message: "Challenge sent",
      question,
    })
  } catch (error) {
    console.error("[v0] Send challenge error:", error)
    res.status(500).json({ error: "Failed to send challenge" })
  }
})

// Submit challenge answer
router.post("/answer", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const { partnerId, answer } = req.body

    // Find the partner relation
    const relation = await PartnerRelation.findOne({
      $or: [
        { userA: userId, userB: partnerId },
        { userA: partnerId, userB: userId },
      ],
    }).populate("userA userB", "name")

    if (!relation) {
      return res.status(404).json({ error: "Partner not found" })
    }

    if (!relation.dailyChallengeQuestion) {
      return res.status(400).json({ error: "No active challenge" })
    }

    // Check if challenge is still valid (within 24 hours)
    const challengeDate = relation.dailyChallengeDate!
    const now = new Date()
    const hoursDiff = (now.getTime() - challengeDate.getTime()) / (1000 * 60 * 60)

    if (hoursDiff > 24) {
      // Challenge expired, reset streak
      relation.streak = 0
      relation.dailyChallengeQuestion = undefined
      await relation.save()
      return res.status(400).json({ error: "Challenge expired" })
    }

    // Determine if user is A or B
    const isUserA = relation.userA._id.toString() === userId

    if (isUserA) {
      relation.dailyChallengeAnswerA = answer
    } else {
      relation.dailyChallengeAnswerB = answer
    }

    // Check if both answered
    if (relation.dailyChallengeAnswerA && relation.dailyChallengeAnswerB) {
      // Both answered, evaluate match
      const userAName = (relation.userA as any).name
      const userBName = (relation.userB as any).name

      const matchResult = await analyzeAnswerMatch(
        relation.dailyChallengeQuestion,
        relation.dailyChallengeAnswerA,
        relation.dailyChallengeAnswerB,
        userAName,
        userBName,
      )

      // Update streak
      if (matchResult.isMatch) {
        relation.streak++
      } else {
        relation.streak = 0
      }

      // Add to history
      relation.history.push({
        question: relation.dailyChallengeQuestion,
        answerA: relation.dailyChallengeAnswerA,
        answerB: relation.dailyChallengeAnswerB,
        verdict: matchResult.isMatch ? "Matched" : "Not Matched",
        resultText: matchResult.explanation,
        date: new Date(),
      })

      relation.dailyChallengeCompleted = true
      relation.gamesPlayed++
      relation.lastPlayed = new Date()

      await relation.save()

      return res.json({
        completed: true,
        isMatch: matchResult.isMatch,
        explanation: matchResult.explanation,
        streak: relation.streak,
        yourAnswer: answer,
        partnerAnswer: isUserA ? relation.dailyChallengeAnswerB : relation.dailyChallengeAnswerA,
      })
    }

    await relation.save()

    res.json({
      completed: false,
      message: "Answer submitted, waiting for partner",
    })
  } catch (error) {
    console.error("[v0] Submit challenge answer error:", error)
    res.status(500).json({ error: "Failed to submit answer" })
  }
})

// Get active challenge
router.get("/active/:partnerId", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const { partnerId } = req.params

    const relation = await PartnerRelation.findOne({
      $or: [
        { userA: userId, userB: partnerId },
        { userA: partnerId, userB: userId },
      ],
    })

    if (!relation || !relation.dailyChallengeQuestion) {
      return res.json({ hasChallenge: false })
    }

    // Check if expired
    const challengeDate = relation.dailyChallengeDate!
    const now = new Date()
    const hoursDiff = (now.getTime() - challengeDate.getTime()) / (1000 * 60 * 60)

    if (hoursDiff > 24) {
      return res.json({ hasChallenge: false })
    }

    const isUserA = relation.userA.toString() === userId
    const userAnswered = isUserA ? !!relation.dailyChallengeAnswerA : !!relation.dailyChallengeAnswerB
    const partnerAnswered = isUserA ? !!relation.dailyChallengeAnswerB : !!relation.dailyChallengeAnswerA

    res.json({
      hasChallenge: true,
      question: relation.dailyChallengeQuestion,
      userAnswered,
      partnerAnswered,
      completed: relation.dailyChallengeCompleted,
      expiresAt: new Date(challengeDate.getTime() + 24 * 60 * 60 * 1000),
    })
  } catch (error) {
    console.error("[v0] Get active challenge error:", error)
    res.status(500).json({ error: "Failed to get challenge" })
  }
})

export default router
