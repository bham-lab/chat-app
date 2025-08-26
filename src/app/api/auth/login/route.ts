import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import {connectDb} from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await connectDb(); // connect to MongoDB

  const { email, password }: { email: string; password: string } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // You can return minimal user data (avoid sending password)
  const { _id, name } = user;

  return NextResponse.json({ user: { _id, name, email } });
}
