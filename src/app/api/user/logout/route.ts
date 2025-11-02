import { clearSession } from "@/firebase/firebase-admin";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await clearSession();

    return NextResponse.json(
      { message: "Logged off successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error clearing session:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// Optional: Handle other methods explicitly (for better DX)
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
