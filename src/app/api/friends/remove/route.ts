// /api/friends/remove/route.ts
import { NextRequest, NextResponse } from "next/server";
import {connectDb} from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectDb();
  const { userId, friendId } = await req.json();

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);
  if (!user || !friend) return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Remove friend
  user.friends = user.friends.filter(f => f.toString() !== friendId);
  await user.save();

  // Optional: Remove user from friend's list as well
  friend.friends = friend.friends.filter(f => f.toString() !== userId);
  await friend.save();

  return NextResponse.json({ message: "Friend removed" });
}
