import { questions } from "../data/questions.js"

export function getRandomQuestions(count = 5) {
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getQuestionsByCategory(category, count = 5) {
  const filtered = questions.filter((q) => q.category === category)
  const shuffled = [...filtered].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
