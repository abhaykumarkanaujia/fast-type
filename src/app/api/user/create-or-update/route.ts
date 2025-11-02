import { saveSession } from "@/firebase/firebase-admin";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { message: "Missing required fields: idToken" },
        { status: 400 }
      );
    }

    const payload = await saveSession(idToken);
    const { userId, displayName, photoURL, email } = payload;

    await connectDB();

    let user = await User.findOne({ userId });

    if (user) {
      user.lastLogin = Date.now();
      user.displayName = displayName;
      user.photoURL = photoURL;
      await user.save();

      return NextResponse.json(
        { message: "User updated successfully", user },
        { status: 200 }
      );
    }

    user = new User({
      userId,
      email,
      displayName,
      photoURL,
      lastLogin: Date.now(),
    });
    await user.save();

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in create-or-update user:", error.message);
    console.error("Full error object:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
