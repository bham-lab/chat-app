// src/app/api/message/read/route.ts
import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/Message";
import {connectDb} from "@/lib/db";

export async function POST(req: NextRequest) {
  await connectDb();
  const { userId, friendId } = await req.json();

  // Mark all friend → user messages as read
  await Message.updateMany(
    { sender: friendId, receiver: userId, read: false },
    { $set: { read: true } }
  );

  return NextResponse.json({ success: true });
}
