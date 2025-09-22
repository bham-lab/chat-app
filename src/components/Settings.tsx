"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FiUser, FiLogOut } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import UserList from "./UserList";

interface SettingsProps {
  user: { _id: string; name: string; email?: string; avatarUrl?: string };
  onBack: () => void;
}

export default function Settings({ user, onBack }: SettingsProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [friends, setFriends] = useState<string[]>([]);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ Load theme preference
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // ✅ Apply + persist theme preference
  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Fetch friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(`/api/friends?userId=${user._id}`);
        const data = await res.json();
        setFriends(data.friends.map((f: any) => f.friend._id));
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };
    fetchFriends();
  }, [user._id]);

  const handleFriendAdded = (friendId: string) => {
    setFriends((prev) => [...prev, friendId]);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (avatar) formData.append("avatar", avatar);

      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) alert("Profile updated successfully!");
      else alert("Failed to update profile");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      const res = await fetch(`/api/users/${user._id}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (res.ok) {
        alert("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert("Failed to update password. Check your current password.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex flex-col h-full bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Back + Profile Section */}
      <div className="flex items-center p-4 border-b dark:border-gray-700 gap-4">
        <button
          onClick={onBack}
          className="text-blue-500 font-semibold flex items-center gap-1"
        >
          <IoArrowBack /> Back
        </button>
        <img
          src={avatarPreview || "/default-avatar.png"}
          alt="Avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col flex-1">
          <span className="font-semibold truncate">{name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {email}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Profile Update */}
        <form
          onSubmit={handleProfileUpdate}
          className="space-y-4 p-4 border rounded-lg shadow dark:border-gray-700"
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FiUser /> Update Profile
          </h2>
          <div className="flex items-center gap-4">
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
            >
              <FiUser /> Update Profile
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Username:</label>
            <input
              className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Email:</label>
            <input
              className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </form>

        {/* Password Update */}
        <form
          onSubmit={handlePasswordUpdate}
          className="space-y-4 p-4 border rounded-lg shadow dark:border-gray-700"
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            <RiLockPasswordLine /> Change Password
          </h2>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Current Password:</label>
            <input
              type="password"
              className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">New Password:</label>
            <input
              type="password"
              className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Confirm New Password:</label>
            <input
              type="password"
              className="border p-2 rounded dark:bg-gray-800 dark:border-gray-600"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-1"
          >
            <RiLockPasswordLine /> Update Password
          </button>
        </form>

        {/* Theme Toggle */}
        <div className="p-4 border rounded-lg shadow flex items-center justify-between dark:border-gray-700">
          <h2 className="text-lg font-bold flex items-center gap-1">Theme</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 flex items-center gap-1"
          >
            {darkMode ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
            {darkMode ? "Dark" : "Light"}
          </button>
        </div>

        {/* User List */}
        <UserList
          userId={user._id}
          existingFriends={friends}
          onFriendAdded={handleFriendAdded}
        />
      </div>

      {/* Sticky Logout Footer */}
      <div className="p-4 border-t bg-white dark:bg-gray-800 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-1 justify-center"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
}
