import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  googleId: string
  name: string
  email: string
  partners: string[]
  pushToken?: string
  createdAt: Date
  lastActive: Date
}

const UserSchema: Schema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  partners: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  pushToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model<IUser>("User", UserSchema)
