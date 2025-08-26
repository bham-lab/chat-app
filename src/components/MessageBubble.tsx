interface Props {
  message: any;
  userId: string;
}

export default function MessageBubble({ message, userId }: Props) {
  const isOwn = message.sender === userId;

  // Format timestamp nicely, e.g., "14:32"
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`px-3 py-2 rounded-lg max-w-xs ${
          isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <p>{message.text}</p>

        <div className="flex justify-end items-center mt-1 text-xs text-gray-400">
          {isOwn && (
            <span className="mr-1">
              {message.status === "read"
                ? "✔✔"
                : message.status === "delivered"
                ? "✔"
                : "•"}
            </span>
          )}
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}
