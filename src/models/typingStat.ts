import mongoose from "mongoose";

const TypingStatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    wordsPerMin: {
      type: Number,
      required: true,
      min: 0,
    },
    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    timePlayed: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

TypingStatSchema.index({ userId: 1, createdAt: 1 });

export default mongoose.models.TypingStat ??
  mongoose.model("TypingStat", TypingStatSchema);
