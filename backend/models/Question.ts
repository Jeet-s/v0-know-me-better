import mongoose, { Schema, type Document } from "mongoose"

export interface IQuestion extends Document {
  theme: string
  text: string
}

const QuestionSchema: Schema = new Schema({
  theme: {
    type: String,
    required: true,
    enum: [
      "Classic",
      "Foodie Feels 🍕",
      "Love & Affection ❤️",
      "Travel Goals ✈️",
      "Daily Habits ☕",
      "Childhood Memories 🧸",
      "Flirty Fun 😏🔥",
    ],
  },
  text: {
    type: String,
    required: true,
  },
})

QuestionSchema.index({ theme: 1 })

export default mongoose.model<IQuestion>("Question", QuestionSchema)
