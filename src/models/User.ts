import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  friends: mongoose.Types.ObjectId[];
  lastSeen?: Date; // ✅ add lastSeen
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastSeen: { type: Date, default: Date.now }, // ✅ track lastSeen
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
