import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
    default: null,
  },
  highestScore: {
    type: Number,
    default: 0,
  },
  totalGamesPlayed: {
    type: Number,
    default: 0,
  },
  totalTimePlayed: {
    type: Number,
    default: 0,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", function (next) {
  this.updatedAt = new Date(Date.now());
  next();
});

UserSchema.index({ highestScore: -1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
