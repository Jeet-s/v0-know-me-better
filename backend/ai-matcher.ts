import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface MatchResult {
  isMatch: boolean
  similarity: number
  explanation: string
}

export async function analyzeAnswerMatch(
  question: string,
  answer1: string,
  answer2: string,
  player1Name: string,
  player2Name: string,
): Promise<MatchResult> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `You are analyzing answers from a couples compatibility game.

Question: "${question}"
${player1Name}'s answer: "${answer1}"
${player2Name}'s answer: "${answer2}"

Analyze if these answers show compatibility and alignment between the couple. Consider:
- Semantic similarity (same meaning, different words)
- Complementary answers (different but compatible)
- Shared values or preferences
- Overall vibe and energy match

Respond in this exact JSON format:
{
  "isMatch": true/false,
  "similarity": 0-100,
  "explanation": "Brief explanation of why they match or don't match"
}

Be generous with matches - couples don't need identical answers to be compatible. Look for alignment in spirit, values, and overall vibe.`,
    })

    const result = JSON.parse(text) as MatchResult
    return result
  } catch (error) {
    console.error("[v0] AI matching error:", error)
    // Fallback to simple matching
    return {
      isMatch: answer1.toLowerCase().trim() === answer2.toLowerCase().trim(),
      similarity: 50,
      explanation: "Using fallback matching due to AI error",
    }
  }
}

export async function generateVibeAnalysis(
  scores: { player1: number; player2: number },
  totalRounds: number,
  player1Name: string,
  player2Name: string,
): Promise<string> {
  try {
    const matchPercentage = Math.round((scores.player1 / totalRounds) * 100)

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `You are analyzing a couple's compatibility based on their game results.

${player1Name} and ${player2Name} matched on ${scores.player1} out of ${totalRounds} questions (${matchPercentage}%).

Generate a fun, playful, and encouraging vibe analysis (2-3 sentences) that:
- Celebrates their connection
- Is romantic and positive
- Uses emojis sparingly
- Gives them a creative "vibe" label (like "Cosmic Soulmates", "Adventure Twins", "Cozy Companions", etc.)

Keep it upbeat and fun!`,
    })

    return text
  } catch (error) {
    console.error("[v0] Vibe analysis error:", error)
    const matchPercentage = Math.round((scores.player1 / totalRounds) * 100)

    if (matchPercentage >= 80) {
      return "You two are totally in sync! Your vibes are perfectly aligned. 💕"
    } else if (matchPercentage >= 60) {
      return "Great connection! You understand each other well. Keep vibing! ✨"
    } else {
      return "Opposites attract! Your unique perspectives make you special together. 💖"
    }
  }
}
