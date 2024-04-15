// Chat.tsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useSidebar } from './SidebarContext';

type Message = {
  id: number;
  text: string;
  from: 'user' | 'api';
};

type ChatProps = {
  className: string;
};

const Chat: React.FC<ChatProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { isSidebarOpen } = useSidebar();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const newUserMessage: Message = {
      id: messages.length,
      text: inputText,
      from: 'user',
    };
    setMessages([...messages, newUserMessage]);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/flask/echo`, { message: inputText });
      //const echoedMessage = response.data.response; // Adjust based on your actual API response structure
      const echoedMessage = response.data.decrypted;
      
      const newApiMessage: Message = {
        id: messages.length + 1,
        text: echoedMessage,
        from: 'api',
      };
      setMessages((msgs) => [...msgs, newApiMessage]); // Only add the API's response here
    } catch (error) {
      console.error('There was an error sending the message', error);
    } finally {
      setInputText('');
    }

    if(textAreaRef.current) {
      textAreaRef.current.style.height = "40px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line from being entered in the textarea
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col ${isSidebarOpen ? 'lg:w-3/4 md:w-3/4 sm:w-full' : 'w-full'}`}>
      <div className="flex flex-col-reverse flex-grow overflow-y-auto p-4 space-y-2 space-y-reverse scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-900">
        {messages.slice().reverse().map((message, index) => (
          <div
            key={index}
            className={`rounded p-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl break-words ${message.from === 'user' ? 'bg-[#6d84f7] text-white ml-auto' : 'bg-slate-700 text-white mr-auto'}`}
          >
            {message.text}
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
