import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Friend from "@/models/Friend";
import mongoose from "mongoose";

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

export async function GET(req: NextRequest, context: any) {
  try {
    await connectDb();
    const { userId } = await context.params; // works regardless of typing

    const friendDocs = await Friend.find({ user: userId }).populate(
      "friend",
      "_id name avatarUrl lastSeen"
    );

    const friends: IFriendWithPopulated[] = friendDocs.map((doc) => {
      const populatedFriend = doc.friend as any;
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
    return NextResponse.json(
      { friends: [], error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}
