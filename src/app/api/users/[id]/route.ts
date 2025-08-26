import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

// GET user by ID
export async function GET(req: Request, { params }: any) {
  try {
    await connectDb();
    const { id } = params;
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}

// UPDATE user
export async function PUT(req: Request, { params }: any) {
  try {
    await connectDb();
    const { id } = params;
    const body = await req.json();
    const updated = await User.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to update user" }, { status: 400 });
  }
}

// DELETE user
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDb();
    const { id } = params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}
