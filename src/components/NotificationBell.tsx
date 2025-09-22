// components/Notifications.tsx
"use client";

import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

interface Notification {
  sender: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  count: number;
  lastMessage: string;
  lastAt: string;
}

export default function Notifications({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications/${userId}`);
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

    fetchNotifications();

    // Poll every 10s for updates
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <FaBell size={22} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.reduce((sum, n) => sum + n.count, 0)}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-2 max-h-80 overflow-y-auto z-50">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.sender._id}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <img
                  src={n.sender.avatarUrl || "/default-avatar.png"}
                  alt={n.sender.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{n.sender.name}</p>
                  <p className="text-xs text-gray-500 truncate">{n.lastMessage}</p>
                </div>
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {n.count}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 p-2">No new messages</p>
          )}
        </div>
      )}
    </div>
  );
}
