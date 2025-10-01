export interface Vibe {
  title: string
  emoji: string
  minScore: number
  maxScore: number
}

export const vibes: Vibe[] = [
  {
    title: "Telepathic Twins",
    emoji: "🔮",
    minScore: 5,
    maxScore: 5,
  },
  {
    title: "Mind Readers",
    emoji: "🧠",
    minScore: 4,
    maxScore: 4,
  },
  {
    title: "Synced Souls",
    emoji: "💫",
    minScore: 3,
    maxScore: 3,
  },
  {
    title: "Getting There",
    emoji: "🎯",
    minScore: 2,
    maxScore: 2,
  },
  {
    title: "Opposites Attract",
    emoji: "🎭",
    minScore: 0,
    maxScore: 1,
  },
]

export function getVibeForScore(score: number): Vibe {
  return vibes.find((vibe) => score >= vibe.minScore && score <= vibe.maxScore) || vibes[vibes.length - 1]
}
