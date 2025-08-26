interface UserProfileProps {
  user: { name: string; email: string; avatar?: string; bio?: string };
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="p-4">
      <img src={user.avatar || "/default-avatar.png"} className="w-24 h-24 rounded-full mb-2" />
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
      <p className="text-gray-500">{user.bio}</p>
    </div>
  );
}
