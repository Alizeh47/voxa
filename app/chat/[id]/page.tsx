'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Video, MoreVertical, Image as ImageIcon, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: Date;
  isMe: boolean;
}

const ChatPage = ({ params }: { params: { id: string } }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Hey there! How are you?',
      sender: 'John Doe',
      timestamp: new Date(Date.now() - 3600000),
      isMe: false,
    },
    {
      id: 2,
      content: 'I\'m good, thanks! How about you?',
      sender: 'Me',
      timestamp: new Date(Date.now() - 3000000),
      isMe: true,
    },
    {
      id: 3,
      content: 'Great! Should we discuss the project updates?',
      sender: 'John Doe',
      timestamp: new Date(Date.now() - 2400000),
      isMe: false,
    },
  ]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: message,
      sender: 'Me',
      timestamp: new Date(),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate received message
    setTimeout(() => {
      const receivedMessage: Message = {
        id: messages.length + 2,
        content: 'Thanks for your message! I\'ll get back to you soon.',
        sender: 'John Doe',
        timestamp: new Date(),
        isMe: false,
      };
      setMessages(prev => [...prev, receivedMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Chat Header */}
      <motion.div 
        className="flex items-center justify-between px-6 py-4 bg-white border-b"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#3E7BFA] to-[#6F42C1] flex items-center justify-center text-white font-['Audiowide']">
            J
          </div>
          <div>
            <h2 className="font-['Bruno_Ace_SC'] text-lg">John Doe</h2>
            <p className="text-sm text-gray-500 font-['Tomorrow']">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => console.log('Audio call')}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => console.log('Video call')}
          >
            <Video className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Search in Conversation</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <motion.div 
        className="flex-1 overflow-y-auto p-6 space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            variants={item}
          >
            <div className={`max-w-[70%] ${msg.isMe ? 'bg-[#3E7BFA] text-white' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
              <p className="font-['Tomorrow']">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.isMe ? 'text-blue-100' : 'text-gray-500'} font-['Michroma']`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chat Input */}
      <motion.div 
        className="p-4 bg-white border-t"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 font-['Tomorrow']"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <Smile className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleSendMessage}
            className="rounded-full bg-[#3E7BFA] text-white hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatPage; 