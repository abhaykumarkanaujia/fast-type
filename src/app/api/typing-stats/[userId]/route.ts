import { NextResponse } from "next/server";
import TypingStat from "@/models/typingStat";
import { connectDB } from "@/lib/db";

export async function GET(
  _: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const { userId } = await context.params;

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const stats = await TypingStat.find({ userId })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error("Error fetching typing stats:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
