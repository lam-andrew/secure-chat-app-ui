import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useSidebar } from './SidebarContext';

type Message = {
  id: number;
  socketId?: string;
  text: string;
  from: 'user' | 'api';
};

type MessageData = {
  data: string;
  sid: string;
}

type ChatProps = {
  className: string;
};

const Chat: React.FC<ChatProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isSidebarOpen } = useSidebar();

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_API_BASE_URL}`, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    newSocket.on('data', (data: MessageData) => {
      // Handle incoming messages from the server
      const newMessage: Message = {
        id: messages.length,
        socketId: data.sid,
        text: data.data,
        from: 'api',
      };
      console.log("MESSAGE: ", newMessage)
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !socket) return;
    setInputText('');
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "inherit";
    }
    socket.emit('data', inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const scrollContainer = messagesEndRef.current?.parentNode as HTMLElement;
    if (scrollContainer) {
      scrollContainer.scrollTop = 0; // For flex-col-reverse, this scrolls to the visual bottom
    }
  }, [messages]);

  return (
    <div className={`mt-16 flex flex-col ${isSidebarOpen ? 'lg:w-5/6 md:w-3/4 sm:w-full' : 'w-full'}`}>
      <div className="flex flex-col-reverse flex-grow overflow-y-auto p-4 space-y-2 space-y-reverse scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-900 scroll-smooth">
        {messages.slice().reverse().map((message, index) => (
          <div
            key={index}
            className={`flex flex-col rounded p-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl break-words text-white ${message.socketId === socket?.id ? 'bg-[#6d84f7] ml-auto' : 'bg-slate-700 mr-auto'}`}
          >
            <span className="break-words">{message.text}</span>
            <span className={`text-xs mt-2 text-white opacity-75 ${message.socketId === socket?.id ? 'self-end' : ''}`}>
              ID: {message.socketId}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 bg-slate-800 flex-none w-full rounded-md">
        <div className="flex items-end">
          <textarea
            ref={textAreaRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-grow p-2 bg-slate-800 text-white resize-none outline-none scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-slate-800"
            placeholder="Type a message..."
            rows={1}
            style={{ maxHeight: '150px' }}
          />
          <button onClick={handleSendMessage} className="bg-[#6d84f7] hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded ml-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
