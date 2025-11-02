import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import UserStat from "@/models/userStat";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Fetch leaderboard data from UserStat
    const stats = await UserStat.find({ lastTestWPM: { $gt: 0 } })
      .sort({ lastTestWPM: -1 })
      .skip(offset)
      .limit(limit)
      .select("userId lastTestWPM lastTestDate")
      .lean();

    const userIds = Array.from(
      new Set(stats.map((s) => s.userId).filter(Boolean))
    );

    // Fetch user display names and photos
    const users = await User.find({ userId: { $in: userIds } })
      .select("userId displayName photoURL")
      .lean();

    const userMap = users.reduce<
      Record<string, { displayName: string; photoURL: string | null }>
    >((acc, u) => {
      acc[u.userId] = {
        displayName: u.displayName || u.userId,
        photoURL: u.photoURL || null,
      };
      return acc;
    }, {});

    const leaderboard = stats.map((s, idx) => {
      const info = userMap[s.userId] || {
        displayName: s.userId || "Anonymous",
        photoURL: null,
      };
      return {
        rank: offset + idx + 1,
        userId: s.userId,
        displayName: info.displayName,
        photoURL: info.photoURL,
        lastTestWPM: s.lastTestWPM,
        lastTestDate: s.lastTestDate,
      };
    });

    const total = await UserStat.countDocuments({ lastTestWPM: { $gt: 0 } });

    return NextResponse.json({
      leaderboard,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error("Error fetching leaderboard from UserStat:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
