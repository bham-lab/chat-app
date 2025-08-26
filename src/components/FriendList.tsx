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
  };
  lastMessage?: string;
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
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };

    fetchFriends();
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
    <div className="flex flex-col gap-2 h-full">
      <h2 className="text-lg font-bold p-2 border-b">Friends</h2>
      {friends.length === 0 ? (
        <p className="text-gray-400 p-2">No friends found</p>
      ) : (
        friends.map((f) => (
          <div
            key={f._id}
            onClick={() => onSelectFriend(f.friend)}
            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded"
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={f.friend.avatarUrl || "/default-avatar.png"}
                alt={f.friend.name}
                className="w-12 h-12 rounded-full shadow-sm"
              />
              {/* Online indicator if lastSeen < 5min */}
              {f.friend.lastSeen && (new Date().getTime() - new Date(f.friend.lastSeen).getTime()) < 5 * 60 * 1000 && (
                <>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full opacity-75 animate-ping"></span>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10"></span>
                </>
              )}
            </div>

            {/* Friend info */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="font-medium truncate">{f.friend.name}</span>
                <span className="text-xs text-gray-400 ml-2">
                  {formatTime(f.friend.lastSeen)}
                </span>
              </div>
              {f.lastMessage && (
                <p className="text-sm text-gray-500 truncate">{f.lastMessage}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
