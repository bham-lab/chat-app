// /api/users/route.ts
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  await connectDb();

  // Use URL constructor for request URL
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    // Fetch all users except the current user
    const users = await User.find({ _id: { $ne: userId } }).select("_id name");
    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
