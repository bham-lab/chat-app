// /api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectDb();
  const { userId } = await req.json();

  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  // Set lastSeen to now on logout
  await User.findByIdAndUpdate(userId, { lastSeen: new Date() });

  // Clear session/token here if you use JWT or cookies
  return NextResponse.json({ success: true });
}
