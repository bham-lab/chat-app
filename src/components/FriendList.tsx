"use client";
import { useEffect, useState } from "react";

interface FriendListProps {
  userId: string;
  onSelectFriend: (friend: { _id: string; name: string; avatarUrl?: string }) => void;
}

interface IFriend {
  _id: string;
  friend: {
    _id: string;
    name: string;
    avatarUrl?: string;
    lastSeen?: string; // ISO string
     // 👈 unread messages count
  };
  lastMessage?: string;
  unreadCounts: number;
}

export default function FriendList({ userId, onSelectFriend }: FriendListProps) {
  const [friends, setFriends] = useState<IFriend[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchFriends = async () => {
      try {
        const res = await fetch(`/api/friends?userId=${userId}`);
        const data = await res.json();
        setFriends(data.friends || []);
        console.log(data.friends);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };

    fetchFriends();

    // optional: poll every 10s for new unread counts
    const interval = setInterval(fetchFriends, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60 * 1000) return "Just now";
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full gap-2">
 
      {friends.length === 0 ? (
        <p className="p-2 text-gray-400">No friends found</p>
      ) : (
        friends.map((f, idx) => (
          <div
            key={f._id}
            onClick={() => onSelectFriend(f.friend)}
            className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded relative
      ${idx !== friends.length - 1 ? "border-b border-gray-200" : ""}`} 
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={f.friend.avatarUrl || "/default-avatar.png"}
                alt={f.friend.name}
                className="w-12 h-12 rounded-full shadow-sm"
              />
              {/* Online indicator */}
              {f.friend.lastSeen &&
                new Date().getTime() - new Date(f.friend.lastSeen).getTime() < 2 * 60 * 1000 && (
                  <>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full opacity-75 animate-ping"></span>
                    <span className="absolute bottom-0 right-0 z-10 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </>
                )}
            </div>

            {/* Friend info */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">{f.friend.name}</span>
                <span className="ml-2 text-xs text-gray-400">
                  {formatTime(f.friend.lastSeen)}
                </span>
              </div>
              {f.lastMessage && (
                <p className="text-sm text-gray-500 truncate">{f.lastMessage}</p>
              )}
            </div>

            {/* 🔔 Unread badge */}
            {f.unreadCounts > 0 && (
              <span className="absolute px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full right-3 top-3">
                {f.unreadCounts}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
}
