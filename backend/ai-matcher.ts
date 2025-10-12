import OpenAI from "openai"

interface MatchResult {
  isMatch: boolean
  similarity: number
  explanation: string
}

let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

export async function analyzeAnswerMatch(
  question: string,
  answer1: string,
  answer2: string,
  player1Name: string,
  player2Name: string,
): Promise<MatchResult> {
  try {
    const openai = getOpenAIClient()
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a fun, playful AI that analyzes couple compatibility. Keep explanations SHORT (max 10 words), casual, and fun. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: `Analyze these answers from a couples compatibility game:

Question: "${question}"
${player1Name}'s answer: "${answer1}"
${player2Name}'s answer: "${answer2}"

Consider:
- Semantic similarity (same meaning, different words)
- Complementary answers (different but compatible)
- Shared values or preferences
- Overall vibe and energy match

Respond with JSON containing: isMatch (boolean), similarity (0-100 number), explanation (string with MAX 10 words - be playful and concise!).
Be generous with matches - couples don't need identical answers to be compatible.`,
        },
      ],
      response_format: { type: "json_object" },
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("OpenAI returned empty response")
    }

    const result = JSON.parse(content) as MatchResult
    return result
  } catch (error) {
    console.error("[v0] AI matching error:", error)
    // Fallback to simple matching
    return {
      isMatch: answer1.toLowerCase().trim() === answer2.toLowerCase().trim(),
      similarity: answer1.toLowerCase().trim() === answer2.toLowerCase().trim() ? 100 : 0,
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
    const openai = getOpenAIClient()

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a fun, playful relationship analyst who creates encouraging vibe analyses for couples.",
        },
        {
          role: "user",
          content: `${player1Name} and ${player2Name} matched on ${scores.player1} out of ${totalRounds} questions (${matchPercentage}%).

Generate a fun, playful, and encouraging vibe analysis (2-3 sentences) that:
- Celebrates their connection
- Is romantic and positive
- Uses emojis sparingly
- Gives them a creative "vibe" label (like "Cosmic Soulmates", "Adventure Twins", "Cozy Companions", etc.)

Keep it upbeat and fun!`,
        },
      ],
    })

    return response.choices[0].message.content || "You two have an amazing connection! 💖"
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
