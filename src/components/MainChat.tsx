"use client";
import { useState, useEffect } from "react";
import FriendList from "./FriendList";
import ChatBox from "./ChatBox";
import Settings from "./Settings";

interface User {
  _id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

interface Friend {
  _id: string;
  name: string;
  avatarUrl?: string;
  lastSeen?: string; // ISO string
}

interface MainChatProps {
  user: User;
}

export default function MainChat({ user }: MainChatProps) {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});

const handleLogout = async () => {
  const userId = user._id;
  const token = localStorage.getItem("token");

  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
  } catch (err) {
    console.error("Failed to update lastSeen:", err);
  }

  localStorage.removeItem("token");
  window.location.href = "/auth/login";
};


  // 🔔 Simulate receiving new messages (replace with WebSocket or API in real app)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!selectedFriend) {
        // Pick a random friend id for demo
        const friendId = "friend123";
        setUnreadCounts((prev) => ({
          ...prev,
          [friendId]: (prev[friendId] || 0) + 1,
        }));
      }
    }, 10000); // every 10s

    return () => clearInterval(interval);
  }, [selectedFriend]);

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    // Reset unread count when opening chat
    setUnreadCounts((prev) => ({ ...prev, [friend._id]: 0 }));
  };

  return (
    <div className="flex h-screen bg-[#e5ebf1] ">
      {/* Sidebar */}
      <div
        className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300
          ${selectedFriend || showSettings ? "hidden sm:flex sm:w-80" : "flex w-full sm:w-80"}
        `}
      >
        {/* Profile */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2"
          >
            <img
              src={user.avatarUrl || "/default-avatar.png"}
              alt={user.name}
              className="w-10 h-10 rounded-full border"
            />
            <span className="font-semibold">{user.name}</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Friend list with notifications */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 ">
          {!showSettings && (
            <FriendList
              userId={user._id}
              onSelectFriend={handleSelectFriend}
           
            />
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col  relative bg-[#f5f8fc]
        ${!selectedFriend && !showSettings ? "hidden sm:flex" : "flex"}
      `}
      >
        {selectedFriend && !showSettings && (
          <ChatBox
            userId={user._id}
            friendId={selectedFriend._id}
            friendName={selectedFriend.name}
            friendProfile={selectedFriend.avatarUrl}
            lastSeen={selectedFriend.lastSeen}
            onBack={() => setSelectedFriend(null)}
          />
        )}

        {showSettings && (
          <div className="absolute top-0 right-0 h-full w-full sm:relative sm:w-auto bg-white z-50 shadow-lg">
            <Settings user={user} onBack={() => setShowSettings(false)} />
          </div>
        )}

        {!selectedFriend && !showSettings && (
          <div className="flex items-center justify-center h-full text-gray-500 sm:flex ">
            <div className="text-center">
              <img
                src="/telegram-logo.png"
                alt="Telegram"
                className="w-20 h-20 mx-auto opacity-70"
              />
              <p className="mt-4 text-lg font-semibold">
                Select a chat to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
