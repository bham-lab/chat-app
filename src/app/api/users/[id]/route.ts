import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

// GET user by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDb();
    const user = await User.findById(params.id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}

// UPDATE user
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDb();
    const body = await req.json();
    const updated = await User.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: "Failed to update user" }, { status: 400 });
  }
}

// DELETE user
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDb();
    const deleted = await User.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}
