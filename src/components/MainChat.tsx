"use client";
import { useState } from "react";
import FriendList from "./FriendList";
import ChatBox from "./ChatBox";
import Settings from "./Settings";

interface User {
  _id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

interface MainChatProps {
  user: User;
}

export default function MainChat({ user }: MainChatProps) {
  const [selectedFriend, setSelectedFriend] = useState<{ _id: string; name: string; avatarUrl?: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex h-screen relative">
      {/* Sidebar / Friend List */}
      <div
        className={`flex flex-col justify-between border-r p-2
          ${selectedFriend || showSettings ? "hidden sm:flex w-1/4" : "flex w-full sm:w-1/4"}
        `}
      >
        <div>
          {/* User Profile */}
          <button
            onClick={() => setShowSettings(true)}
            className="relative flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full transition-transform duration-200 hover:scale-105"
          >
            <div className="relative">
              <img
                src={user.avatarUrl || "/default-avatar.png"}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full opacity-75 animate-ping"></span>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10"></span>
            </div>
            <span className="font-medium">{user.name}</span>
          </button>

          {/* Friend List */}
          {!showSettings && <FriendList userId={user._id} onSelectFriend={setSelectedFriend} />}
        </div>

        {/* Logout button */}
      
      </div>

      {/* Chat & Settings */}
      <div className={`flex-1 flex flex-col relative
        ${!selectedFriend && !showSettings ? "hidden sm:flex" : "flex"}
      `}>
        {/* ChatBox */}
        {selectedFriend && !showSettings && (
          <ChatBox
            userId={user._id}
            friendId={selectedFriend._id}
            friendName={selectedFriend.name}
            friendProfile={selectedFriend.avatarUrl}
            onBack={() => setSelectedFriend(null)} // Mobile back
          />
        )}

        {/* Settings overlay */}
        {showSettings && (
          <div className="absolute top-0 right-0 h-full w-full sm:relative sm:w-auto bg-white z-50 shadow-lg transform transition-transform duration-300">
            <Settings user={user} onBack={() => setShowSettings(false)} />
          </div>
        )}

        {/* Mobile placeholder if no friend selected */}
        {!selectedFriend && !showSettings && (
          <div className="flex items-center justify-center h-full text-gray-500 sm:hidden">
            Select a friend to chat
          </div>
        )}
      </div>
    </div>
  );
}
