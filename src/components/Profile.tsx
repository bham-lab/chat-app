"use client"

import React from "react"
import { Friend } from "./FriendList"

interface ProfileProps {
  friend?: Friend
}

export default function Profile({ friend }: ProfileProps) {
  if (!friend) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-400 border-b border-gray-200">
        Select a friend to view profile
      </div>
    )
  }

  return (
    <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
      <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-lg">
        {friend.name.charAt(0)}
      </div>
      <div className="ml-4">
        <div className="font-semibold text-lg">{friend.name}</div>
        <div
          className={`text-sm ${
            friend.status === "online" ? "text-green-500" : "text-gray-400"
          }`}
        >
          {friend.status}
        </div>
      </div>
    </div>
  )
}
