// /api/notifications/[userId]/route.ts
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Message from "@/models/Message";

export async function GET(req: Request, { params }: any) {
  try {
    await connectDb();
    const { userId } = params;

    // Find unread messages for the user
    const unreadMessages = await Message.find({
      receiver: userId,
      status: { $ne: "read" },
    }).populate("sender", "name avatarUrl");

    // Group by sender for chat app notifications
    const notifications = unreadMessages.reduce((acc: any, msg: any) => {
      const senderId = msg.sender._id.toString();
      if (!acc[senderId]) {
        acc[senderId] = {
          sender: msg.sender,
          count: 0,
          lastMessage: msg.text,
          lastAt: msg.createdAt,
        };
      }
      acc[senderId].count++;
      return acc;
    }, {});

    return NextResponse.json({ notifications: Object.values(notifications) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
