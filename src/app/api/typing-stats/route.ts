import { NextResponse } from "next/server";
import TypingStat from "@/models/typingStat";
import { connectDB } from "@/lib/db";
import { getSession } from "@/firebase/firebase-admin";

export async function POST(request: Request) {
  try {
    // Verify session and extract user info
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = session;
    await connectDB();

    // Parse body
    const { wpm, accuracy, timePlayed } = await request.json();

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

    // Insert new stat
    const stat = await TypingStat.create({
      userId,
      wordsPerMin: wpm,
      accuracy,
      timePlayed,
    });

    // Asynchronous cleanup: keep only 50 most recent stats per user
    (async () => {
      try {
        const olds = await TypingStat.find({ userId })
          .sort({ createdAt: 1 })
          .skip(50)
          .select("_id");
        const ids = olds.map((d) => d._id);
        if (ids.length) {
          await TypingStat.deleteMany({ _id: { $in: ids } });
        }
      } catch (cleanupErr) {
        console.error("Error during typing-stats cleanup:", cleanupErr);
      }
    })();

    return NextResponse.json({ message: "Stat saved", stat }, { status: 201 });
  } catch (error: any) {
    console.error("Error saving typing stat:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
