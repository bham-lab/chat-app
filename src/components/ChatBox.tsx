"use client";
import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

interface ChatBoxProps {
  userId: string;
  friendId: string;
  friendName: string;
  friendProfile?: string;
  onBack?: () => void;
}

interface IMessage {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
  createdAt: string;
  status: "sent" | "delivered" | "read";
}

export default function ChatBox({ userId, friendId, friendName, friendProfile, onBack }: ChatBoxProps) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchMessages = async () => {
    if (!friendId) return;
    try {
      const res = await fetch(`/api/messages?user1=${userId}&user2=${friendId}`);
      const data = await res.json();
      setMessages(data || []);

      await fetch(`/api/messages`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: friendId, receiverId: userId }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: userId, receiver: friendId, text }),
      });
      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      setText("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="flex flex-col h-full border rounded">
      {/* Sticky Header */}
      <div className="flex items-center p-3 border-b bg-gray-100 sticky top-0 z-10 shadow-sm">
      
          <button onClick={onBack} className="sm:hidden mr-2 p-1 rounded hover:bg-gray-200">
            ←
          </button>
      
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <img
              src={friendProfile || "/default-avatar.png"}
              alt={friendName}
              className="w-12 h-12 rounded-full shadow-md"
            />
            {isOnline && (
              <>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full opacity-75 animate-ping"></span>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10"></span>
              </>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">{friendName}</h2>
            <span className="text-sm text-gray-500">{isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} userId={userId} />
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Sticky Input */}
      <div className="flex p-2 border-t bg-gray-50 sticky bottom-0 z-10 shadow-inner">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          placeholder="Type a message..."
          className="flex-1 resize-none border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 overflow-hidden max-h-40"
        />
        <button
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
