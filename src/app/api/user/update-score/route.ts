import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { getSession } from "@/firebase/firebase-admin";

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = session;
    const { score, gameTime } = await request.json();

    if (typeof score !== "number") {
      return NextResponse.json(
        { message: "Missing or invalid field: score" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update game stats
    user.totalGamesPlayed += 1;
    if (typeof gameTime === "number") {
      user.totalTimePlayed += gameTime;
    }

    if (score > user.highestScore) {
      user.highestScore = score;
    }

    await user.save();

    return NextResponse.json(
      {
        message: "Score updated successfully",
        user: {
          userId: user.userId,
          highestScore: user.highestScore,
          totalGamesPlayed: user.totalGamesPlayed,
          totalTimePlayed: user.totalTimePlayed,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating score:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
