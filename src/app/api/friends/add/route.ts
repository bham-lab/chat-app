// /api/friends/add/route.ts
import { connectDb } from "@/lib/db";
import Friend from "@/models/Friend";

export async function POST(req: Request) {
  await connectDb();
  const { userId, friendId } = await req.json();

  // Prevent adding self
  if (userId === friendId) {
    return new Response(JSON.stringify({ message: "You cannot add yourself as a friend" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if friendship already exists
  const existing = await Friend.findOne({
    user: userId,
    friend: friendId,
  });

  if (existing) {
    return new Response(JSON.stringify({ message: "Friend already added" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create new friend relation
  const newFriend = new Friend({
    user: userId,
    friend: friendId,
  });

  await newFriend.save();

  return new Response(JSON.stringify({ message: "Friend added successfully" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
