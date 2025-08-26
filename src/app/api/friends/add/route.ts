// /api/friends/add/route.ts
import { connectDb } from "@/lib/db";
import User from "@/models/User";

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

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if already friends
  if (user.friends.includes(friendId)) {
    return new Response(JSON.stringify({ message: "Friend already added" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Add friend
  user.friends.push(friendId);
  await user.save();

  return new Response(JSON.stringify({ message: "Friend added successfully" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
