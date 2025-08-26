// /api/friends/[userId]/route.ts
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request, { params }: any) {
  try {
    await connectDb();
    const { userId } = params; // works even on Vercel

    const user = await User.findById(userId).populate("friends", "_id name avatarUrl lastMessage lastSeen");
    if (!user) return NextResponse.json({ friends: [] });

    const friends = user.friends.map((f: any) => ({
      _id: f._id.toString(),
      name: f.name,
      avatarUrl: f.avatarUrl,
      lastMessage: f.lastMessage || "",
      lastSeen: f.lastSeen || null
    }));

    return NextResponse.json({ friends });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ friends: [], error: "Failed to fetch friends" }, { status: 500 });
  }
}
