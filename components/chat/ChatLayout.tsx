import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { FiSearch, FiMoreHorizontal, FiPhone, FiVideo, FiMessageSquare } from 'react-icons/fi';
import Sidebar from './Sidebar';

interface Message {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
  userId: string;
}

interface User {
  id: string;
  name: string;
  message: string;
  time: string;
  online: boolean;
  avatar: string;
  status: 'new' | 'closed' | 'active';
}

interface SharedFile {
  id: string;
  name: string;
  size: string;
}

interface UserDetails {
  phone: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  sharedFiles: {
    name: string;
    size: string;
    date: string;
  }[];
}

const mockMessages: { [key: string]: Message[] } = {
  '1': [
    { id: '1', text: "Hey, are you available for a meeting today?", isMe: false, time: '10:30', userId: '1' },
    { id: '2', text: "Yes, I can do 2 PM", isMe: true, time: '10:32', userId: '1' },
    { id: '3', text: `Perfect! I'll send you the meeting link`, isMe: false, time: '10:33', userId: '1' },
    { id: '4', text: "Looking forward to it 👍", isMe: true, time: '10:35', userId: '1' },
    { id: '5', text: `You'll call me later?`, isMe: false, time: '12:45', userId: '1' }
  ],
  '2': [
    { id: '1', text: 'Did you review the latest design?', isMe: false, time: '11:20', userId: '2' },
    { id: '2', text: 'Yes, it looks amazing! 🎨', isMe: true, time: '11:25', userId: '2' },
    { id: '3', text: 'Great! Any suggestions for improvements?', isMe: false, time: '11:30', userId: '2' },
    { id: '4', text: 'Maybe we could adjust the color scheme', isMe: true, time: '11:32', userId: '2' },
    { id: '5', text: "You'll call me later to discuss?", isMe: false, time: '12:45', userId: '2' }
  ],
  '3': [
    { id: '1', text: 'I really love Coca-Cola! ❤️', isMe: false, time: '14:32', userId: '3' },
    { id: '2', text: 'Have you tried the new flavor?', isMe: true, time: '14:33', userId: '3' },
    { id: '3', text: "Not yet! Is it good?", isMe: false, time: '14:34', userId: '3' },
    { id: '4', text: "It's amazing, you should try it!", isMe: true, time: '14:35', userId: '3' },
    { id: '5', text: "I'm Coca-cola lover! 🥤", isMe: false, time: '12:45', userId: '3' }
  ],
  '4': [
    { id: '1', text: 'Marketing campaign update:', isMe: false, time: '09:15', userId: '4' },
    { id: '2', text: 'The numbers look promising!', isMe: true, time: '09:20', userId: '4' },
    { id: '3', text: 'Q4 projections are exceeding expectations', isMe: false, time: '09:25', userId: '4' },
    { id: '4', text: 'Great news! 📈', isMe: true, time: '09:30', userId: '4' },
    { id: '5', text: "You'll call me later for the details?", isMe: false, time: '12:45', userId: '4' }
  ]
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Donald',
    message: "You'll call me later?",
    time: '12:45',
    online: false,
    avatar: '/images/profiles/donald.jpg',
    status: 'new'
  },
  {
    id: '2',
    name: 'Diana',
    message: "You'll call me later?",
    time: '12:45',
    online: false,
    avatar: '/images/profiles/diana.jpg',
    status: 'active'
  },
  {
    id: '3',
    name: 'Kristin Watson',
    message: "I'm Coca-cola lover!",
    time: '12:45',
    online: true,
    avatar: '/images/profiles/kristin.jpg',
    status: 'active'
  },
  {
    id: '4',
    name: 'Coca-cola',
    message: "You'll call me later?",
    time: '12:45',
    online: false,
    avatar: '/images/profiles/coca-cola.jpg',
    status: 'closed'
  }
];

const mockFiles: SharedFile[] = [
  { id: '1', name: 'Annual statement from 2.pdf', size: '1.8 MB' },
  { id: '2', name: 'picture1.jpeg', size: '1.9 MB' },
  { id: '3', name: 'legal-notice.pdf', size: '1.5 MB' },
  { id: '4', name: 'document_1.pdf', size: '1.8 MB' },
];

const mockTeams = [
  { 
    id: '1', 
    name: 'Apple', 
    color: '#FFD700', 
    letter: 'A',
    logo: '/images/teams/apple.png',
    bgGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
  },
  { 
    id: '2', 
    name: 'Cargo', 
    color: '#8B8B8B', 
    letter: 'C',
    logo: '/images/teams/cargo.png',
    bgGradient: 'linear-gradient(135deg, #8B8B8B 0%, #696969 100%)'
  },
  { 
    id: '3', 
    name: 'NASA', 
    color: '#4169E1', 
    letter: 'N',
    logo: '/images/teams/nasa.png',
    bgGradient: 'linear-gradient(135deg, #4169E1 0%, #1E90FF 100%)'
  },
  { 
    id: '4', 
    name: 'G&G', 
    color: '#32CD32', 
    letter: 'G',
    logo: '/images/teams/g-and-g.png',
    bgGradient: 'linear-gradient(135deg, #32CD32 0%, #228B22 100%)'
  },
  { 
    id: '5', 
    name: 'Paypal', 
    color: '#FFB6C1', 
    letter: 'P',
    logo: '/images/teams/paypal.png',
    bgGradient: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)'
  },
];

const mockUserDetails: { [key: string]: UserDetails } = {
  '1': {
    phone: '+1 (555) 123-4567',
    dateOfBirth: '15 April 1992',
    gender: 'Male',
    email: 'donald@example.com',
    sharedFiles: [
      { name: 'financial statement.pdf', size: '1.8 MB', date: '2024-03-10' },
      { name: 'contract.jpg', size: '1.9 MB', date: '2024-03-09' },
      { name: 'legal-notice.pdf', size: '1.5 MB', date: '2024-03-08' },
      { name: 'document.pdf', size: '1.8 MB', date: '2024-03-07' }
    ]
  },
  '2': {
    phone: '+1 (555) 234-5678',
    dateOfBirth: '23 June 1988',
    gender: 'Female',
    email: 'diana@example.com',
    sharedFiles: [
      { name: 'design_draft.pdf', size: '2.1 MB', date: '2024-03-10' },
      { name: 'mockup.jpg', size: '3.2 MB', date: '2024-03-09' },
      { name: 'assets.zip', size: '5.5 MB', date: '2024-03-08' },
      { name: 'presentation.pdf', size: '1.8 MB', date: '2024-03-07' }
    ]
  },
  '3': {
    phone: '+1 (555) 345-6789',
    dateOfBirth: '12 March 1990',
    gender: 'Female',
    email: 'kristin@example.com',
    sharedFiles: [
      { name: 'Annual statement from 2.pdf', size: '1.8 MB', date: '2024-03-10' },
      { name: 'concert.jpg', size: '1.9 MB', date: '2024-03-09' },
      { name: 'legal-notice.pdf', size: '1.5 MB', date: '2024-03-08' },
      { name: 'document_1.pdf', size: '1.8 MB', date: '2024-03-07' }
    ]
  },
  '4': {
    phone: '+1 (555) 456-7890',
    dateOfBirth: 'Est. 1892',
    gender: 'Company',
    email: 'contact@coca-cola.com',
    sharedFiles: [
      { name: 'report_q4.pdf', size: '2.8 MB', date: '2024-03-10' },
      { name: 'campaign.jpg', size: '4.2 MB', date: '2024-03-09' },
      { name: 'metrics.xlsx', size: '1.1 MB', date: '2024-03-08' },
      { name: 'strategy.pdf', size: '2.3 MB', date: '2024-03-07' }
    ]
  }
};

const ChatLayout = () => {
  const [selectedChat, setSelectedChat] = useState('3');
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'closed'>('all');
  const [messageInput, setMessageInput] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const headerMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [chatListWidth, setChatListWidth] = useState(320); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const resizerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mockMessages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target as Node)) {
        setShowHeaderMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = useMemo(() => {
    switch (activeTab) {
      case 'new':
        return mockUsers.filter(user => user.status === 'new');
      case 'closed':
        return mockUsers.filter(user => user.status === 'closed');
      default:
        return mockUsers;
    }
  }, [activeTab]);
  
  const selectedUser = mockUsers.find(user => user.id === selectedChat);

  const getTabStyle = (tab: 'all' | 'new' | 'closed') => {
    const isActive = activeTab === tab;
    return `flex-1 py-2 text-sm font-bruno ${
      isActive 
        ? 'text-[#3E7BFA] border-b-2 border-[#3E7BFA]' 
        : 'text-gray-500 hover:text-gray-700'
    } hover-lift transition-all duration-200`;
  };

  const currentMessages = mockMessages[selectedChat] || [];

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: String(Date.now()),
      text: messageInput,
      isMe: true,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      userId: selectedChat
    };

    mockMessages[selectedChat] = [...(mockMessages[selectedChat] || []), newMessage];
    setMessageInput('');
    scrollToBottom();
  };

  const handleProfileInfoClick = () => {
    setShowProfileModal(true);
    setShowHeaderMenu(false);
    setShowProfileMenu(false);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowProfileModal(false);
      }
    };

    if (showProfileModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileModal]);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      // Calculate new width while respecting min/max bounds
      const newWidth = Math.max(240, Math.min(600, e.clientX));
      setChatListWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.classList.remove('resizing');
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.classList.add('resizing');
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('resizing');
    };
  }, [isResizing]);

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  return (
    <>
      <div className="flex h-screen bg-[var(--primary-bg)] pattern-dots">
        <Sidebar />
        
        {/* Chat List - Now Resizable */}
        <div 
          className="relative bg-white/80 border-r border-gray-200 animate-fade-in backdrop-blur-sm min-w-panel max-w-panel"
          style={{ width: `${chatListWidth}px` }}
        >
          {/* Profile Header */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 profile-picture animate-float">
                  <Image
                    src="/images/profiles/jenny.jpg"
                    alt="Jenny Wilson"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-['Bruno_Ace_SC'] text-sm">Jenny Wilson</h3>
                  <p className="text-xs text-gray-500 font-['Michroma']">@jenny_wils</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search here"
                className="w-full chat-input py-2 pl-10 pr-4 text-sm font-['Michroma']"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Teams Section */}
          <div className="px-4 mb-4">
            <h3 className="text-xs text-gray-500 mb-3 font-['Bruno_Ace_SC']">Teams</h3>
            <div className="grid grid-cols-5 gap-3">
              {mockTeams.map((team) => (
                <div
                  key={team.id}
                  className="team-item aspect-square rounded-xl flex items-center justify-center text-white text-sm font-['Michroma'] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative animate-float"
                  style={{ 
                    background: team.bgGradient,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={team.logo}
                      alt={team.name}
                      width={32}
                      height={32}
                      className="object-contain opacity-90"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              className={getTabStyle('all')}
              onClick={() => setActiveTab('all')}
            >
              All
              <span className="ml-1 text-xs text-gray-400">({mockUsers.length})</span>
            </button>
            <button 
              className={getTabStyle('new')}
              onClick={() => setActiveTab('new')}
            >
              New
              <span className="ml-1 text-xs text-gray-400">
                ({mockUsers.filter(u => u.status === 'new').length})
              </span>
            </button>
            <button 
              className={getTabStyle('closed')}
              onClick={() => setActiveTab('closed')}
            >
              Closed
              <span className="ml-1 text-xs text-gray-400">
                ({mockUsers.filter(u => u.status === 'closed').length})
              </span>
            </button>
          </div>

          {/* Chat List */}
          <div className="overflow-y-auto">
            {filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className={`chat-item p-4 border-b border-gray-200 cursor-pointer ${
                  selectedChat === user.id ? 'bg-gray-50' : ''
                } ${user.status === 'new' ? 'border-l-4 border-l-[#3E7BFA]' : ''}`}
                onClick={() => setSelectedChat(user.id)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden profile-picture">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    {user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse-slow"></div>
                    )}
                    {user.status === 'closed' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-bruno text-sm">{user.name}</h4>
                      <span className="text-xs text-gray-500 font-tomorrow">{user.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate font-tomorrow">{user.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer Logo */}
          <div className="footer-logo">
            <Image
              src="/images/logo.png"
              alt="Voxa Logo"
              width={40}
              height={40}
              className="logo-image"
            />
            <span className="logo-text">Voxa</span>
          </div>

          {/* Resizer Handle */}
          <div
            ref={resizerRef}
            className={`resizer ${isResizing ? 'resizing' : ''}`}
            onMouseDown={handleResizeStart}
        />
      </div>
      
        {/* Chat Area */}
      <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
            <h2 className="font-medium">{selectedUser?.name}</h2>
            <div className="flex items-center space-x-4 relative" ref={headerMenuRef}>
              <button 
                className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                title="Call"
              >
                <FiPhone className="text-gray-500 w-5 h-5" />
              </button>
              <button 
                className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                title="Video Call"
              >
                <FiVideo className="text-gray-500 w-5 h-5" />
              </button>
              <button 
                className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                title="Profile"
                onClick={handleProfileInfoClick}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden">
                  <Image
                    src={selectedUser?.avatar || "/avatars/placeholder.svg"}
                    alt={selectedUser?.name || "User"}
                    width={20}
                    height={20}
                    className="object-cover"
                  />
                </div>
              </button>
              <button 
                onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                title="More options"
              >
                <FiMoreHorizontal className="text-gray-500 w-5 h-5" />
              </button>
              
              {showHeaderMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 animate-fade-in">
                  <div className="py-1">
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-['Tomorrow'] font-extralight"
                      onClick={handleProfileInfoClick}
                    >
                      Profile info
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-['Tomorrow'] font-extralight">
                      Pin conversation
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-['Tomorrow'] font-extralight">
                      Mute notifications
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-['Tomorrow'] font-extralight">
                      Search in conversation
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-['Tomorrow'] font-extralight">
                      Delete conversation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth pattern-grid">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? 'justify-end' : 'justify-start'} animate-slide-in`}
              >
                {!message.isMe && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 animate-float">
                    <Image
                      src={selectedUser?.avatar || "/avatars/placeholder.svg"}
                      alt={selectedUser?.name || "User"}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                )}
                <div
                  className={`message-bubble ${message.isMe ? 'sent' : 'received'} px-4 py-2`}
                >
                  <p className="message-text whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                  <p className="message-time">
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="h-20 px-6 flex items-center border-t border-gray-200/50 bg-white/80 backdrop-blur-sm">
            <div className="flex-1 flex items-center chat-input rounded-lg px-4 py-2">
              <input
                type="text"
                placeholder="Type here..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-transparent outline-none text-sm font-['Michroma']"
              />
              <button 
                onClick={handleSendMessage}
                className="ml-2 px-4 py-1.5 bg-[var(--accent-purple)] text-white rounded-md text-sm hover:bg-[var(--message-sent)] transition-colors font-['Bruno_Ace_SC']"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 modal-overlay">
          <div 
            ref={modalRef}
            className="bg-white w-[480px] max-h-[90vh] rounded-2xl overflow-hidden shadow-xl modal-content"
          >
            {/* Modal Header */}
            <div className="relative h-40 bg-gradient-to-r from-purple-500 to-pink-500">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg profile-picture-pop">
                  <Image
                    src={selectedUser?.avatar || "/avatars/placeholder.svg"}
                    alt={selectedUser?.name || "User"}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Profile Content - Now Scrollable */}
            <div className="pt-20 px-8 pb-8 max-h-[calc(90vh-160px)] overflow-y-auto custom-scrollbar">
              <div className="text-center mb-8">
                <h2 className="profile-name mb-2">{selectedUser?.name}</h2>
                <p className="profile-value">
                  {mockUserDetails[selectedChat]?.email}
                </p>
              </div>

              <div className="space-y-6">
                {/* Phone Section */}
                <div className="animate-fade-in-up delay-100">
                  <h4 className="profile-label mb-2">Phone</h4>
                  <p className="profile-value">
                    {mockUserDetails[selectedChat]?.phone}
                  </p>
                </div>

                {/* Date of Birth Section */}
                <div className="animate-fade-in-up delay-200">
                  <h4 className="profile-label mb-2">Date of birth</h4>
                  <p className="profile-value">
                    {mockUserDetails[selectedChat]?.dateOfBirth}
                  </p>
                </div>

                {/* Gender Section */}
                <div className="animate-fade-in-up delay-300">
                  <h4 className="profile-label mb-2">Gender</h4>
                  <p className="profile-value">
                    {mockUserDetails[selectedChat]?.gender}
                  </p>
                </div>

                {/* Shared Files Section */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="shared-files-title">Shared files</h3>
                    <button className="text-xs text-[#ff5c4c] font-['Michroma'] hover:text-red-700 transition-colors">
                      View all
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {mockUserDetails[selectedChat]?.sharedFiles.map((file, index) => (
                      <div 
                        key={index}
                        className="file-item flex items-center p-3 bg-gray-50/80 rounded-lg animate-fade-in-up"
                        style={{ animationDelay: `${400 + index * 100}ms` }}
                      >
                        <div className="w-8 h-8 bg-gray-200/50 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="file-name truncate max-w-[180px]">
                            {file.name}
                          </p>
                          <p className="file-size mt-0.5">
                            {file.size}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Footer Logo */}
            <div className="profile-footer-logo">
              <Image
                src="/images/logo.png"
                alt="Voxa Logo"
                width={40}
                height={40}
                className="logo-image"
              />
              <span className="logo-text">Voxa</span>
            </div>
      </div>
    </div>
      )}
    </>
  );
};

export default ChatLayout; 