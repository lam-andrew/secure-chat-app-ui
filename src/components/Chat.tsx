import React, { useState, useRef, useEffect } from 'react';
import { useSidebar } from './SidebarContext';
import { useUser } from '../context/UserContext';
import cat from '../assets/cat.png';
import { Socket } from 'socket.io-client';
import axios from 'axios';
import { encryptMessage, decryptMessage, addSystemMessage } from '../utils';

type Message = {
  id: number;
  socketId?: string;
  text: string;
  from: 'user' | 'system';
  googleId?: string;
  username?: string;
  profilePicUrl?: string;
  timestamp: number;
};

type MessageData = {
  data: string;
  sid: string;
  googleId: string;
  username: string;
  profilePicUrl: string;
  from: 'user' | 'system';
  timestamp: number;
}

type ChatProps = {
  className: string;
  socket?: Socket;
};

const Chat: React.FC<ChatProps> = ({ className, socket }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { isSidebarOpen } = useSidebar();
  const { user } = useUser();

  useEffect(() => {
    // Function to fetch message data from the server
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/messages`);
        const encryptedData = response.data; // Axios automatically parses the JSON response into an object
        // Decrypt each message's text before updating the state
        const decryptedMessages = encryptedData.map((message: any) => ({
          ...message,
          text: decryptMessage(message.text)
        }));
        setMessages(decryptedMessages);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchMessages();
  }, []); // Empty dependency array means this effect runs only once after the initial render


  const handleSendMessage = async () => {
    if (!inputText.trim() || !socket || !user) return;
    const encryptedMessage = encryptMessage(inputText);
    const messageData = {
      text: encryptedMessage,
      googleId: user.id,
      username: user.name,
      profilePicUrl: user.picture,
      from: 'user',
      timestamp: Date.now()
    };
    socket.emit('data', messageData);
    setInputText('');
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "inherit";
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('userConnected', (data) => {
      if(user && data.googleId === user.id) {
        addSystemMessage(`${data.username} has joined the chat`, socket, user);
      }
    });

    socket.on('data', (data: MessageData) => {
      const decryptedText = decryptMessage(data.data);
      const newMessage: Message = {
        id: messages.length,
        socketId: data.sid,
        text: decryptedText,
        from: data.from,
        googleId: data.googleId,
        username: data.username,
        profilePicUrl: data.profilePicUrl,
        timestamp: data.timestamp,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket.off('userConnected');
      }
    };
  }, [socket]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
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
        {messages.slice().sort((a, b) => b.timestamp - a.timestamp).map((message, index) => (
          <div
            key={index}
            className={`rounded p-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl break-words ${message.from === 'system' ? 'text-gray-500 mx-auto' : 'text-white'} ${message.from === 'system' ? '' : (message.googleId === user?.id ? 'bg-[#6d84f7] ml-auto' : 'bg-slate-700 mr-auto')}`}
            style={{ width: message.from === 'system' ? '100%' : undefined }}
          >
            <span className={`break-words ${message.from === 'system' ? 'flex justify-center' : ''}`}>{message.text}</span>
            {message.from !== 'system' && 'username' in message && (
              <div className="flex items-center mt-2">
                <img
                  src={message.profilePicUrl || cat}
                  alt="profile"
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-xs text-white opacity-80">{message.username}</span>
              </div>
            )}
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
}

export default Chat;