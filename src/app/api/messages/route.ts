import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Message from "@/models/Message";

export async function GET(req: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const user1 = searchParams.get("user1");
  const user2 = searchParams.get("user2");

  if (!user1 || !user2) {
    return NextResponse.json({ error: "Missing user1 or user2" }, { status: 400 });
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDb();

  try {
    const { sender, receiver, text } = await req.json();

    if (!sender || !receiver || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const message = new Message({ sender, receiver, text, status: "sent" });
    await message.save();

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// ✅ Add PATCH handler to mark messages as read
export async function PATCH(req: NextRequest) {
  await connectDb();

  try {
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: "Missing senderId or receiverId" }, { status: 400 });
    }

    await Message.updateMany(
      { sender: senderId, receiver: receiverId, status: "sent" },
      { $set: { status: "read" } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 });
  }
}
