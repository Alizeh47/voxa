'use client';

import React, { useState } from 'react';
import { FiSearch, FiMoreVertical, FiPhone, FiVideo, FiMessageSquare } from 'react-icons/fi';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for the UI
const mockUsers = [
  { id: '1', name: 'Jenny Wilson', username: '@jenny_wils', avatar: '/avatars/placeholder.svg', status: 'online' },
  { id: '2', name: 'Donald', username: '@donald', avatar: '/avatars/placeholder.svg', status: 'offline', lastMessage: "You'll call me later?" },
  { id: '3', name: 'Diana', username: '@diana', avatar: '/avatars/placeholder.svg', status: 'offline', lastMessage: "You'll call me later?" },
  { id: '4', name: 'Kristin Watson', username: '@kristin', avatar: '/avatars/placeholder.svg', status: 'online', lastMessage: "I'm Coca-cola lover!" },
  { id: '5', name: 'Coca-cola', username: '@cocacola', avatar: '/avatars/placeholder.svg', status: 'offline', lastMessage: "You'll call me later?" },
];

const mockMessages = [
  { id: '1', sender: '1', receiver: '4', text: 'I really missed you', time: '14:32', isMe: false },
  { id: '2', sender: '4', receiver: '1', text: 'I really missed you', time: '14:34', isMe: true },
  { id: '3', sender: '4', receiver: '1', text: 'Do you want to see me?', time: '14:35', isMe: false },
  { id: '4', sender: '1', receiver: '4', text: "OK! I'm going to", time: '14:36', isMe: true },
  { id: '5', sender: '4', receiver: '1', text: "PS! Order dinner for two! 🍕", time: '14:38', isMe: false },
];

const mockSharedFiles = [
  { id: '1', name: 'financial-statement-from-2.pdf', size: '1.8 MB' },
  { id: '2', name: 'picture1.jpeg', size: '1.9 MB' },
  { id: '3', name: 'legal-notice.pdf', size: '1.5 MB' },
  { id: '4', name: 'document_1.pdf', size: '1.8 MB' },
];

const ChatApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeUser, setActiveUser] = useState(mockUsers[3]); // Kristin Watson
  const [activeTab, setActiveTab] = useState('all');
  const [selectedChat, setSelectedChat] = useState('4'); // Kristin Watson

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="mb-4">You need to be signed in to access the chat.</p>
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-20 bg-gray-800 flex flex-col items-center py-6 border-r border-gray-700">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mb-8">
          <span>V</span>
        </div>
        
        <div className="flex flex-col items-center space-y-8 flex-1">
          <button className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        
        <div className="mt-auto">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
            <span>JW</span>
          </div>
        </div>
      </div>
      
      {/* Chat List Sidebar */}
      <div className="w-72 border-r border-gray-200 flex flex-col">
        {/* User Profile */}
        <div className="p-4 border-b border-gray-200 flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
            <img src="/avatars/placeholder.svg" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Jenny Wilson</h3>
            <p className="text-xs text-gray-500">@jenny_wils</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search here" 
              className="w-full bg-gray-100 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            <button className="absolute right-3 top-2.5 text-gray-400">
              <FiMoreVertical />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'new' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('new')}
          >
            New
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'closed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('closed')}
          >
            Closed
          </button>
        </div>
        
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {mockUsers.slice(1).map((user) => (
            <div 
              key={user.id}
              className={`flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${selectedChat === user.id ? 'bg-gray-100' : ''}`}
              onClick={() => {
                setSelectedChat(user.id);
                setActiveUser(user);
              }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  <img src="/avatars/placeholder.svg" alt={user.name} className="w-full h-full object-cover" />
                </div>
                {user.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm">{user.name}</h4>
                  <span className="text-xs text-gray-500">12:45</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{user.lastMessage}</p>
              </div>
              {user.id === '4' && (
                <div className="ml-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  1
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <h2 className="font-medium">Kristin</h2>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {mockMessages.map((message) => (
            <div 
              key={message.id} 
              className={`flex mb-4 ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isMe && (
                <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
                  <img src="/avatars/placeholder.svg" alt="Kristin" className="w-full h-full object-cover" />
                </div>
              )}
              <div 
                className={`max-w-xs p-3 rounded-lg ${
                  message.isMe 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${message.isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
          
          {/* Audio Message */}
          <div className="flex justify-end mb-4">
            <div className="max-w-xs p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="mx-2 flex-1">
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div className="h-1 bg-blue-600 rounded-full w-1/3"></div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">0:24</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <button className="text-gray-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input 
              type="text" 
              placeholder="Type here..." 
              className="flex-1 py-2 px-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="ml-2 bg-blue-600 text-white p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar - User Profile */}
      <div className="w-72 border-l border-gray-200 flex flex-col">
        {/* User Profile Header */}
        <div className="p-4 border-b border-gray-200 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 overflow-hidden">
            <img src="/avatars/placeholder.svg" alt="Kristin Watson" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-medium">Kristin Watson</h3>
          
          {/* Action Buttons */}
          <div className="flex justify-center mt-4 space-x-4">
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
              <FiPhone />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
              <FiMessageSquare />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
              <FiVideo />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
              <FiMoreVertical />
            </button>
          </div>
        </div>
        
        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="mb-4">
            <h4 className="text-xs text-gray-500 mb-1">Phone</h4>
            <p className="text-sm">+1 (555) 555-55-55</p>
          </div>
          <div className="mb-4">
            <h4 className="text-xs text-gray-500 mb-1">Date of birth</h4>
            <p className="text-sm">12 March 1990</p>
          </div>
          <div>
            <h4 className="text-xs text-gray-500 mb-1">Gender</h4>
            <p className="text-sm">Male</p>
          </div>
        </div>
        
        {/* Shared Files */}
        <div className="p-4 flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-sm">Shared files</h3>
            <a href="#" className="text-xs text-blue-600">View all</a>
          </div>
          
          <div className="space-y-3">
            {mockSharedFiles.map((file) => (
              <div key={file.id} className="flex items-center p-2 bg-gray-50 rounded">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp; 