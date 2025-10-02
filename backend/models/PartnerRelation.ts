import mongoose, { Schema, type Document } from "mongoose"

interface GameHistory {
  question: string
  answerA: string
  answerB: string
  verdict: string
  resultText: string
  date: Date
  theme?: string
}

export interface IPartnerRelation extends Document {
  userA: mongoose.Types.ObjectId
  userB: mongoose.Types.ObjectId
  gamesPlayed: number
  streak: number
  lastPlayed: Date
  history: GameHistory[]
  dailyChallengeDate?: Date
  dailyChallengeQuestion?: string
  dailyChallengeAnswerA?: string
  dailyChallengeAnswerB?: string
  dailyChallengeCompleted?: boolean
}

const PartnerRelationSchema: Schema = new Schema({
  userA: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userB: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gamesPlayed: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastPlayed: {
    type: Date,
    default: Date.now,
  },
  history: [
    {
      question: String,
      answerA: String,
      answerB: String,
      verdict: String,
      resultText: String,
      date: {
        type: Date,
        default: Date.now,
      },
      theme: String,
    },
  ],
  dailyChallengeDate: Date,
  dailyChallengeQuestion: String,
  dailyChallengeAnswerA: String,
  dailyChallengeAnswerB: String,
  dailyChallengeCompleted: Boolean,
})

// Compound index to ensure unique partner pairs
PartnerRelationSchema.index({ userA: 1, userB: 1 }, { unique: true })

export default mongoose.model<IPartnerRelation>("PartnerRelation", PartnerRelationSchema)
