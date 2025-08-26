// src/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://admin:admin@cluster0.lbuhyyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}