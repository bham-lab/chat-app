// /api/friends/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function GET(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  await connectDb();
  const { userId } = context.params; // ✅ extract from context

  const user = await User.findById(userId).populate("friends", "_id");
  if (!user) return NextResponse.json({ friends: [] });

  const friendIds = user.friends.map((f: any) => f._id.toString());
  return NextResponse.json({ friends: friendIds });
}
