import express from "express"
import Question from "../models/Question"

const router = express.Router()

// Get random questions by theme
router.get("/", async (req, res) => {
  try {
    const { theme, count = 5 } = req.query

    if (!theme) {
      return res.status(400).json({ error: "Theme is required" })
    }

    const questions = await Question.aggregate([
      { $match: { theme: theme as string } },
      { $sample: { size: Number.parseInt(count as string) } },
    ])

    res.json({ questions: questions.map((q) => q.text) })
  } catch (error) {
    console.error("[v0] Error fetching questions:", error)
    res.status(500).json({ error: "Failed to fetch questions" })
  }
})

export default router
