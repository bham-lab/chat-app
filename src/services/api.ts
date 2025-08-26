export const API_URL = "/api";

export async function fetchUsers() {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
}

export async function fetchMessages() {
  const res = await fetch(`${API_URL}/messages`);
  return res.json();
}

export async function sendMessage(message: { sender: string; receiver: string; text: string }) {
  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  return res.json();
}
