import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type WebSocketCallProps = {
  socket: Socket;
};

const WebSocketCall: React.FC<WebSocketCallProps> = ({ socket }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (!message.trim()) return; // Trim to check for non-empty messages excluding whitespaces
    socket.emit("data", message);
    setMessage("");
  };

  useEffect(() => {
    const handleNewMessage = (data: { data: string }) => {
      setMessages((msgs) => [...msgs, data.data]);
    };

    socket.on("data", handleNewMessage);

    return () => {
      socket.off("data", handleNewMessage);
    };
  }, [socket]);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">WebSocket Communication</h2>
      <div className="mt-2">
        <input
          type="text"
          value={message}
          onChange={handleText}
          className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </div>
      <ul className="mt-4 list-disc list-inside">
        {messages.map((msg, ind) => (
          <li key={ind} className="text-gray-600">{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketCall;
