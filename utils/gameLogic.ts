// Simple mock matching logic
export function checkAnswersMatch(answer1: string, answer2: string): boolean {
  const normalize = (str: string) => str.toLowerCase().trim()

  const a1 = normalize(answer1)
  const a2 = normalize(answer2)

  // Exact match
  if (a1 === a2) return true

  // Check if one answer contains the other
  if (a1.includes(a2) || a2.includes(a1)) return true

  // Check for similar words (simple word overlap)
  const words1 = a1.split(/\s+/)
  const words2 = a2.split(/\s+/)

  const commonWords = words1.filter((word) => word.length > 3 && words2.includes(word))

  // If they share significant words, consider it a match
  return commonWords.length >= Math.min(words1.length, words2.length) * 0.5
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
