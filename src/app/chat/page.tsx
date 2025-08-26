"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainChat from "@/components/MainChat";

export default function ChatPage() {
  const [user, setUser] = useState<{ _id: string; name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/auth/login"); // redirect if not logged in
    } else {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return <MainChat user={user} />;
}
