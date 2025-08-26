import { NextRequest, NextResponse } from "next/server";
import Friend from "@/models/Friend";
import User from "@/models/User";
import {connectDb} from "@/lib/db";

export async function POST(req: NextRequest) {
  await connectDb();
  const { userId, friendId }: { userId: string; friendId: string } = await req.json();

  const existing = await Friend.findOne({ user: userId, friend: friendId });
  if (existing) return NextResponse.json({ message: "Already friends" });

  await Friend.create({ user: userId, friend: friendId });
  return NextResponse.json({ message: "Friend added" });
}

export async function GET(req: NextRequest) {
  await connectDb();
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId")!;
  const friends = await Friend.find({ user: userId }).populate("friend");
  return NextResponse.json({ friends });
}
