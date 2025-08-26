"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.user) {
        // Save user info or token in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
console.log("User logged in:", data.user);
        // Redirect to chat page
        router.push("/chat");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 border rounded w-96 bg-white shadow-lg">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Login</button>
        <p className="text-sm text-center text-gray-500">
          Don't have an account? <span className="text-blue-500 cursor-pointer" onClick={() => router.push("/")}>Register</span>
        </p>
      </form>
    </div>
  );
}
