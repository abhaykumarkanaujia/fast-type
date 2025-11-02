import mongoose, { type Mongoose } from "mongoose";

declare global {
  var mongoose:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI ?? "";

let cached = global.mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached;
}

export async function connectDB() {
  if (cached?.conn) return cached.conn;

  if (!cached?.promise) {
    if (cached) {
      cached.promise = mongoose.connect(MONGODB_URI);
    }
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}
