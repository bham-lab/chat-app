"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [user, setUser] = useState<{ _id: string; name: string; email?: string } | null>(null);
  const router = useRouter();

  // Fetch user from local storage / API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Example: fetch user info from backend
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => router.push("/auth/login"));
  }, [router]);

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => router.push("/chat")}
        className="text-blue-500 font-semibold mb-4"
      >
        ← Back to Chat
      </button>

      <div className="p-4 border rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Profile Info</h2>
        <p><span className="font-semibold">Name:</span> {user.name}</p>
        <p><span className="font-semibold">Email:</span> {user.email ?? "N/A"}</p>
      </div>

      {/* Example: Theme Toggle */}
      <div className="p-4 border rounded-lg shadow flex items-center justify-between mt-4">
        <h2 className="text-xl font-bold">Theme</h2>
        <button
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
        >
          Toggle
        </button>
      </div>
    </div>
  );
}
