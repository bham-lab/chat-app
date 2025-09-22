import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Friend, { IFriend } from "@/models/Friend";
import mongoose from "mongoose";

// Type for populated friend document
interface IPopulatedFriendDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  avatarUrl?: string;
  lastSeen?: string;
}

interface IFriendWithPopulated {
  _id: mongoose.Types.ObjectId;
  friend: IPopulatedFriendDoc;
  unreadCounts?: number;
  lastMessage?: string;
}

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDb();
    const { userId } = params;

    const friendDocs = await Friend.find({ user: userId }).populate(
      "friend",
      "_id name avatarUrl lastSeen"
    );

    // map to type-safe response
    const friends: IFriendWithPopulated[] = friendDocs.map((doc) => {
      const populatedFriend = doc.friend as any; // still cast because Mongoose populate typing is tricky
      return {
        _id: doc._id as mongoose.Types.ObjectId,
        friend: {
          _id: populatedFriend._id as mongoose.Types.ObjectId,
          name: populatedFriend.name,
          avatarUrl: populatedFriend.avatarUrl,
          lastSeen: populatedFriend.lastSeen,
        },
        unreadCounts: (doc as any).unreadCounts || 0,
        lastMessage: (doc as any).lastMessage || "",
      };
    });

    return NextResponse.json({ friends });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ friends: [], error: "Failed to fetch friends" }, { status: 500 });
  }
}
