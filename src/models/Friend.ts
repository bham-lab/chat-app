import mongoose, { Document, Model } from "mongoose";

export interface IFriend extends Document {
  user: mongoose.Types.ObjectId;
  friend: mongoose.Types.ObjectId;
  lastMessage?: string;      // latest message between user & friend
         // last time this friend was active
  unreadCounts?: number;     // cached number of unread messages
}

const FriendSchema = new mongoose.Schema<IFriend>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    friend: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastMessage: { type: String, default: "" },
    
    unreadCounts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Friend: Model<IFriend> =
  mongoose.models.Friend || mongoose.model<IFriend>("Friend", FriendSchema);

export default Friend;
