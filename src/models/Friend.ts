import mongoose, { Document, Model } from "mongoose";

export interface IFriend extends Document {
  user: mongoose.Types.ObjectId;
  friend: mongoose.Types.ObjectId;
}

const FriendSchema = new mongoose.Schema<IFriend>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  friend: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Friend: Model<IFriend> = mongoose.models.Friend || mongoose.model<IFriend>("Friend", FriendSchema);
export default Friend;
