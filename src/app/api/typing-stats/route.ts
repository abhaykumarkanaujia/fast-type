import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import userStat from "@/models/userStat";
import { getSession } from "@/firebase/firebase-admin";
import typingStat from "@/models/typingStat";
import { processTestResult } from "@/lib/gamification";

export async function POST(request: Request) {
  try {
    // 1️⃣ Verify session
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = session;
    await connectDB();

    // 2️⃣ Parse & validate input
    const body = await request.json();
    const { wpm, accuracy, timePlayed } = body ?? {};

    if (
      typeof wpm !== "number" ||
      typeof accuracy !== "number" ||
      typeof timePlayed !== "number"
    ) {
      return NextResponse.json(
        { message: "Missing or invalid fields: wpm, accuracy, timePlayed" },
        { status: 400 }
      );
    }

    // 3️⃣ Create new typing stat
    const stat = await typingStat.create({
      userId,
      wordsPerMin: wpm,
      accuracy,
      timePlayed,
    });

    // 4️⃣ Asynchronous cleanup (keep only 50 most recent stats)
    void (async () => {
      try {
        const count = await typingStat.countDocuments({ userId });
        if (count > 50) {
          const excess = count - 50;
          await typingStat
            .find({ userId })
            .sort({ createdAt: 1 })
            .limit(excess)
            .deleteMany();
        }
      } catch (cleanupErr) {
        console.error("[TypingStat Cleanup Error]:", cleanupErr);
      }
    })();

    // 5️⃣ Update gamification
    let gamification = {};
    try {
      const oldStat = await userStat.findOne({ userId }).select("-__v").lean();
      const newStat = processTestResult(oldStat ?? {}, wpm);
      gamification = await userStat.findOneAndUpdate(
        { userId },
        { $set: newStat },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("[UserStat Update Error]:", err);
    }

    // 6️⃣ Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Stat saved successfully",
        data: { stat, gamification },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[TypingStat POST Error]:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
