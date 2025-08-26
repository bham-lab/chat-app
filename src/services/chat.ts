import { Message } from "@/components/ChatWindow";

export async function getMessages(friendId: number) {
  const res = await fetch(`/api/messages?friendId=${friendId}`);
  return res.json() as Promise<Message[]>;
}

export async function sendMessageToBackend(message: Message) {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  return res.json() as Promise<Message>;
}

