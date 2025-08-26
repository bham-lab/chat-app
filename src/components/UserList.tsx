"use client";
import { useEffect, useState } from "react";

interface UserListProps {
  userId: string;
  existingFriends: string[]; // current friend IDs
  onFriendAdded?: (friendId: string) => void;
}

interface IUser {
  _id: string;
  name: string;
}

export default function UserList({ userId, existingFriends, onFriendAdded }: UserListProps) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const res = await fetch(`/api/users?userId=${userId}`);
    const data = await res.json();
    // Filter out already friends
    const filteredUsers = data.users.filter((u: IUser) => !existingFriends.includes(u._id));
    setUsers(filteredUsers);
  };

  const addFriend = async (friendId: string) => {
    setLoading(true);
    try {
      await fetch("/api/friends/add", {
        method: "POST",
        body: JSON.stringify({ userId, friendId }),
        headers: { "Content-Type": "application/json" },
      });
      onFriendAdded?.(friendId);
      // Remove from list after adding
      setUsers(prev => prev.filter(u => u._id !== friendId));
      alert("Friend added!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [existingFriends]);

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold mb-2">All Users</h2>
      <div className="flex flex-col gap-2">
        {users.length > 0 ? (
          users.map(u => (
            <div key={u._id} className="flex justify-between items-center p-2 border rounded">
              <span>{u.name}</span>
              <button
                onClick={() => addFriend(u._id)}
                disabled={loading}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Add Friend
              </button>
            </div>
          ))
        ) : (
          <p>No users to add</p>
        )}
      </div>
    </div>
  );
}
