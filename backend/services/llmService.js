import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function judgeAnswers(question, answer1, answer2) {
  try {
    const prompt = `You are judging if two people's answers to the same question are similar enough to be considered a "match."

Question: "${question}"

Player 1's answer: "${answer1}"
Player 2's answer: "${answer2}"

Rules for judging:
1. The answers don't need to be identical, but should express the same core idea or preference
2. Minor differences in wording are okay (e.g., "pizza" vs "pepperoni pizza")
3. For subjective questions, look for similar sentiment or direction
4. For factual questions, the key facts should align
5. Be generous - if the answers are in the same ballpark, it's a match

Respond with ONLY "MATCH" or "NO MATCH" - nothing else.`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a fair and friendly judge for a couples game. Be generous in your matching.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 10,
    })

    const result = response.choices[0].message.content?.trim().toUpperCase()
    console.log("[v0] LLM judgment:", result, "for answers:", answer1, "vs", answer2)

    return result === "MATCH"
  } catch (error) {
    console.error("[v0] Error calling OpenAI:", error)
    // Fallback: simple string similarity
    return answer1.toLowerCase().trim() === answer2.toLowerCase().trim()
  }
}
