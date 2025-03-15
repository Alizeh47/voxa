import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { FiSearch, FiMoreHorizontal, FiPhone, FiVideo, FiMessageSquare, FiMic, FiMicOff, FiCamera, FiCameraOff, FiMaximize2, FiMinimize2, FiSmile, FiBold, FiItalic } from 'react-icons/fi';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import RecordRTC from 'recordrtc';
import { default as ImportedSidebar } from './Sidebar';

interface Message {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
  userId: string;
  file?: {
    name: string;
    type: string;
    url: string;
  };
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

// Update Sidebar interface at the top of the file
interface SidebarProps {
  className?: string;
}

// Create a wrapper component for Sidebar
const MobileSidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  return <ImportedSidebar className={className} />;
};

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
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // New state variables for message input features
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [isFormatBold, setIsFormatBold] = useState(false);
  const [isFormatItalic, setIsFormatItalic] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Update emoji picker position state
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({ x: 0, y: 0 });
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const headerMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatListWidth, setChatListWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const resizerRef = useRef<HTMLDivElement>(null);

  // New state for voice recording
  const [recorder, setRecorder] = useState<RecordRTC | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // New state for search functionality
  const [searchQuery, setSearchQuery] = useState('');

  // Add new state variables after the existing ones
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamModalData, setTeamModalData] = useState<(typeof mockTeams)[0] | null>(null);

  // Add new state variables after the existing team-related states
  const [activeTeamChat, setActiveTeamChat] = useState<string | null>(null);
  const [isInTeamMeeting, setIsInTeamMeeting] = useState(false);
  const [showTeamFiles, setShowTeamFiles] = useState(false);
  const [showAllTeams, setShowAllTeams] = useState(false);

  // Add after the searchQuery state
  const [pinnedChats, setPinnedChats] = useState<string[]>([]);
  const [mutedChats, setMutedChats] = useState<string[]>([]);
  const [showSearchInChat, setShowSearchInChat] = useState(false);
  const [searchInChatQuery, setSearchInChatQuery] = useState('');
  const [searchedMessages, setSearchedMessages] = useState<Message[]>([]);

  // Add new state for mobile view after the search states
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  // Add useEffect for handling mobile view detection after other useEffects
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowChatOnMobile(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // New handlers for message input features
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // You can add preview logic here for images
    }
  };

  const handleEmojiClick = () => {
    if (emojiButtonRef.current) {
      const rect = emojiButtonRef.current.getBoundingClientRect();
      setEmojiPickerPosition({
        x: rect.left,
        y: rect.bottom + window.scrollY + 5 // Position below the button with a small gap
      });
      setShowEmojiPicker(!showEmojiPicker);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const text = messageInput;
      const newText = text.substring(0, start) + emoji.native + text.substring(end);
      setMessageInput(newText);
      
      // Set cursor position after emoji
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + emoji.native.length;
        input.focus();
      }, 0);
    } else {
      setMessageInput(prev => prev + emoji.native);
    }
    setShowEmojiPicker(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newRecorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
      });
      
      newRecorder.startRecording();
      setRecorder(newRecorder);
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      recordingTimerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        
        // Send the audio message
        const newMessage: Message = {
          id: String(Date.now()),
          text: '🎤 Voice message',
          isMe: true,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          userId: selectedChat,
          file: {
            name: 'voice-message.webm',
            type: 'audio/webm',
            url: url
          }
        };
        
        mockMessages[selectedChat] = [...(mockMessages[selectedChat] || []), newMessage];
        scrollToBottom();
        
        // Cleanup
        recorder.destroy();
        setRecorder(null);
      });
      
      // Clear timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const handleVoiceRecordStart = () => {
    startRecording();
  };

  const handleVoiceRecordStop = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  const handleFormatClick = () => {
    setShowFormatting(!showFormatting);
  };

  const toggleBold = () => {
    setIsFormatBold(!isFormatBold);
  };

  const toggleItalic = () => {
    setIsFormatItalic(!isFormatItalic);
  };

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

  // Update the filteredUsers memo to include search functionality
  const filteredUsers = useMemo(() => {
    let users = mockUsers;
    
    // First filter by tab
    switch (activeTab) {
      case 'new':
        users = users.filter(user => user.status === 'new');
        break;
      case 'closed':
        users = users.filter(user => user.status === 'closed');
        break;
    }
    
    // Then filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      users = users.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.message.toLowerCase().includes(query)
      );
    }
    
    return users;
  }, [activeTab, searchQuery]);
  
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
    if (!messageInput.trim() && !selectedFile) return;
    
    // Create formatted text if formatting is applied
    let formattedText = messageInput;
    if (isFormatBold) {
      formattedText = `**${formattedText}**`;
    }
    if (isFormatItalic) {
      formattedText = `*${formattedText}*`;
    }

    const newMessage: Message = {
      id: String(Date.now()),
      text: formattedText,
      isMe: true,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      userId: selectedChat,
      file: selectedFile ? {
        name: selectedFile.name,
        type: selectedFile.type,
        url: URL.createObjectURL(selectedFile)
      } : undefined
    };

    mockMessages[selectedChat] = [...(mockMessages[selectedChat] || []), newMessage];
    setMessageInput('');
    setSelectedFile(null);
    setIsFormatBold(false);
    setIsFormatItalic(false);
    setShowFormatting(false);
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

  const handleAudioCall = () => {
    setCallType('audio');
    setShowCallModal(true);
    setIsInCall(true);
  };

  const handleVideoCall = () => {
    setCallType('video');
    setShowCallModal(true);
    setIsInCall(true);
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallType(null);
    setShowCallModal(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsFullscreen(false);
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // Update the emoji picker click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  // Cleanup recording on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (recorder) {
        recorder.destroy();
      }
    };
  }, [recorder]);

  // Add new handler functions before the return statement
  const handleTeamClick = (team: typeof mockTeams[0]) => {
    setSelectedTeam(team.id);
    setTeamModalData(team);
    setShowTeamModal(true);
  };

  const handleJoinTeamChat = (teamId: string) => {
    setActiveTeamChat(teamId);
    setShowTeamModal(false);
    // Switch to team chat view
    setSelectedChat(`team_${teamId}`);
    
    // Add initial team message
    const teamMessage: Message = {
      id: String(Date.now()),
      text: "Welcome to the team chat! 👋",
      isMe: false,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      userId: `team_${teamId}`,
    };
    
    if (!mockMessages[`team_${teamId}`]) {
      mockMessages[`team_${teamId}`] = [teamMessage];
    }
  };

  const handleStartTeamMeeting = (team: typeof mockTeams[0]) => {
    setIsInTeamMeeting(true);
    setCallType('video');
    setShowCallModal(true);
    setShowTeamModal(false);
    
    // Update call UI to show team context
    setSelectedChat(`team_${team.id}`);
  };

  const handleOpenTeamFiles = (team: typeof mockTeams[0]) => {
    setShowTeamFiles(true);
    setShowTeamModal(false);
  };

  const handleViewAllTeams = () => {
    setShowAllTeams(true);
  };

  // Add before the return statement
  const handlePinConversation = () => {
    setPinnedChats(prev => {
      if (prev.includes(selectedChat)) {
        return prev.filter(id => id !== selectedChat);
      }
      return [...prev, selectedChat];
    });
    setShowHeaderMenu(false);
  };

  const handleMuteNotifications = () => {
    setMutedChats(prev => {
      if (prev.includes(selectedChat)) {
        return prev.filter(id => id !== selectedChat);
      }
      return [...prev, selectedChat];
    });
    setShowHeaderMenu(false);
  };

  const handleSearchInConversation = () => {
    setShowSearchInChat(true);
    setShowHeaderMenu(false);
  };

  const handleDeleteConversation = () => {
    if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      setPinnedChats(prev => prev.filter(id => id !== selectedChat));
      setMutedChats(prev => prev.filter(id => id !== selectedChat));
      delete mockMessages[selectedChat];
      const availableChat = Object.keys(mockMessages)[0] || '1';
      setSelectedChat(availableChat);
    }
    setShowHeaderMenu(false);
  };

  const handleSearchInChatQueryChange = (query: string) => {
    setSearchInChatQuery(query);
    if (query.trim()) {
      const results = currentMessages.filter(message => 
        message.text.toLowerCase().includes(query.toLowerCase())
      );
      setSearchedMessages(results);
    } else {
      setSearchedMessages([]);
    }
  };

  // Add mobile-specific styles to modals
  const modalBaseClass = "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
  const modalContentClass = "bg-white rounded-2xl overflow-hidden shadow-xl animate-fade-in";

  // Update the grid columns for mobile view in Teams Section
  const getGridCols = () => {
    return isMobileView ? 'grid-cols-4' : 'grid-cols-5';
  };

    return (
    <>
      <div className="flex h-screen bg-[var(--primary-bg)] pattern-dots">
        <MobileSidebar className={isMobileView ? 'w-16' : ''} />
        
        {/* Chat List - Now Resizable */}
        <div 
          className={`relative flex flex-col bg-white/80 border-r border-gray-200 animate-fade-in backdrop-blur-sm min-w-panel max-w-panel ${
            isMobileView ? 'flex-1' : ''
          } ${isMobileView && showChatOnMobile ? 'hidden' : ''}`}
          style={{ width: isMobileView ? 'auto' : `${chatListWidth}px` }}
        >
          {/* Profile Header */}
          <div className="flex-shrink-0 p-4 border-b border-gray-200/50">
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
                  <h3 className="font-['Audiowide'] text-sm">Jenny Wilson</h3>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full chat-input py-2 pl-10 pr-4 text-sm font-['Michroma']"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && filteredUsers.length === 0 && (
              <p className="text-sm text-gray-500 mt-2 text-center font-['Michroma']">
                No results found
              </p>
            )}
          </div>

          {/* Teams Section */}
          <div className="px-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs text-gray-500 font-['Bruno_Ace_SC']">Teams</h3>
              <button 
                onClick={handleViewAllTeams}
                className="text-xs text-[#3E7BFA] hover:text-blue-700 transition-colors font-['Michroma']"
              >
                View All
              </button>
            </div>
            <div className={`grid grid-cols-5 md:gap-3 ${isMobileView ? 'gap-2 overflow-x-auto whitespace-nowrap' : ''}`}>
              {mockTeams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => handleTeamClick(team)}
                  className={`team-item aspect-square rounded-xl flex items-center justify-center text-white text-sm font-['Michroma'] shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative animate-float cursor-pointer transform hover:scale-105 ${
                    selectedTeam === team.id ? 'ring-2 ring-[#3E7BFA] ring-offset-2' : ''
                  } ${isMobileView ? 'min-w-[48px] w-[48px] h-[48px]' : ''}`}
                  style={{ 
                    background: team.bgGradient,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center hover:backdrop-brightness-90 transition-all">
                    <Image
                      src={team.logo}
                      alt={team.name}
                      width={isMobileView ? 24 : 32}
                      height={isMobileView ? 24 : 32}
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
          <div className={`flex-1 overflow-y-auto ${
            isMobileView 
              ? 'h-[calc(100vh-380px)]' 
              : 'h-[calc(100vh-340px)] custom-scrollbar'
          }`}>
            {filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className={`chat-item p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50/80 transition-colors ${
                  selectedChat === user.id ? 'bg-gray-50' : ''
                } ${user.status === 'new' ? 'border-l-4 border-l-[#3E7BFA]' : ''}`}
                onClick={() => {
                  setSelectedChat(user.id);
                  if (isMobileView) {
                    setShowChatOnMobile(true);
                  }
                }}
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

          {/* Add this CSS class to your global styles or in the appropriate CSS file */}
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(0, 0, 0, 0.2);
              border-radius: 3px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(0, 0, 0, 0.3);
            }
          `}</style>
          
          {/* Footer Logo */}
          <div className="flex-shrink-0 p-4 mt-auto border-t border-gray-200 bg-white/80 backdrop-blur-sm flex items-center justify-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="Voxa Logo"
              width={32}
              height={32}
              className="logo-image"
            />
            <span className="logo-text font-['Audiowide'] text-sm text-gray-700">Voxa</span>
          </div>
      
          {/* Resizer Handle */}
          <div
            ref={resizerRef}
            className={`resizer ${isResizing ? 'resizing' : ''}`}
            onMouseDown={handleResizeStart}
        />
            </div>
      
        {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${
        isMobileView ? (showChatOnMobile ? 'fixed inset-0 z-50 bg-white' : 'hidden') : ''
      }`}>
          {/* Chat Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
            {isMobileView && (
              <button 
                onClick={() => setShowChatOnMobile(false)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex items-center space-x-2">
              <h2 className="font-medium">{selectedUser?.name}</h2>
              {pinnedChats.includes(selectedChat) && (
                <svg className="w-4 h-4 text-[#3E7BFA]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V5zm6 6a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2z" />
                </svg>
              )}
              {mutedChats.includes(selectedChat) && (
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </div>
            <div className="flex items-center space-x-4 relative" ref={headerMenuRef}>
              <button 
                className={`hover:bg-gray-100 p-2 rounded-full transition-colors ${isInCall && callType === 'audio' ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
                title={isInCall && callType === 'audio' ? 'End Call' : 'Start Audio Call'}
                onClick={isInCall && callType === 'audio' ? handleEndCall : handleAudioCall}
              >
                <FiPhone className={`w-5 h-5 ${isInCall && callType === 'audio' ? 'text-white' : 'text-gray-500'}`} />
              </button>
              <button 
                className={`hover:bg-gray-100 p-2 rounded-full transition-colors ${isInCall && callType === 'video' ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
                title={isInCall && callType === 'video' ? 'End Video Call' : 'Start Video Call'}
                onClick={isInCall && callType === 'video' ? handleEndCall : handleVideoCall}
              >
                <FiVideo className={`w-5 h-5 ${isInCall && callType === 'video' ? 'text-white' : 'text-gray-500'}`} />
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
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 font-['Tomorrow'] font-extralight flex items-center justify-between"
                      onClick={handlePinConversation}
                    >
                      <span className={pinnedChats.includes(selectedChat) ? 'text-[#3E7BFA]' : 'text-gray-700'}>
                        {pinnedChats.includes(selectedChat) ? 'Unpin conversation' : 'Pin conversation'}
                      </span>
                      {pinnedChats.includes(selectedChat) && (
                        <svg className="w-4 h-4 text-[#3E7BFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 font-['Tomorrow'] font-extralight flex items-center justify-between"
                      onClick={handleMuteNotifications}
                    >
                      <span className={mutedChats.includes(selectedChat) ? 'text-[#3E7BFA]' : 'text-gray-700'}>
                        {mutedChats.includes(selectedChat) ? 'Unmute notifications' : 'Mute notifications'}
                      </span>
                      {mutedChats.includes(selectedChat) && (
                        <svg className="w-4 h-4 text-[#3E7BFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-['Tomorrow'] font-extralight"
                      onClick={handleSearchInConversation}
                    >
                      Search in conversation
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-['Tomorrow'] font-extralight"
                      onClick={handleDeleteConversation}
                    >
                      Delete conversation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-3 md:p-6 space-y-4 scroll-smooth pattern-grid ${
            isMobileView ? 'pb-24' : 'pb-6'
          }`}>
            {currentMessages.map((message) => (
              <div
                key={message.id}
                id={`message-${message.id}`}
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
                  className={`message-bubble ${message.isMe ? 'sent' : 'received'} px-4 py-2 max-w-[70%]`}
                >
                  {message.file && (
                    <div className="mb-2">
                      {message.file.type.startsWith('image/') ? (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                          <Image
                            src={message.file.url}
                            alt={message.file.name}
                            layout="fill"
                            objectFit="cover"
                            className="hover:opacity-90 transition-opacity cursor-pointer"
                          />
                        </div>
                      ) : message.file.type.startsWith('audio/') ? (
                        <div className="flex items-center bg-white/10 rounded-lg p-2">
                          <audio controls className="w-full max-w-[240px]">
                            <source src={message.file.url} type={message.file.type} />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      ) : (
                        <div className="flex items-center bg-white/10 rounded-lg p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
                          <a 
                            href={message.file.url}
                            download={message.file.name}
                            className="text-sm hover:underline"
                          >
                            {message.file.name}
              </a>
            </div>
                      )}
          </div>
        )}
                  <p className="message-text whitespace-pre-wrap break-words">
                    {message.text.split(/(\*\*.*?\*\*|\*.*?\*)/).map((part, index) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index}>{part.slice(2, -2)}</strong>;
                      } else if (part.startsWith('*') && part.endsWith('*')) {
                        return <em key={index}>{part.slice(1, -1)}</em>;
                      }
                      return part;
                    })}
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
          <div className={`h-20 px-2 md:px-6 flex items-center border-t border-gray-200/50 bg-white/80 backdrop-blur-sm ${isMobileView ? 'fixed bottom-0 left-0 right-0' : ''}`}>
            <div className="flex-1 flex items-center chat-input rounded-lg px-2 md:px-4 py-2 relative">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              />

              {isMobileView ? (
                // Mobile-optimized input area
                <div className="flex items-center space-x-1 w-full">
                  <button 
                    onClick={handleAttachmentClick}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Attach file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  
                  <button 
                    ref={emojiButtonRef}
                    onClick={handleEmojiClick}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Add emoji"
                  >
                    <FiSmile className="h-5 w-5" />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type here..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={`flex-1 bg-transparent outline-none text-sm font-['Michroma'] mx-2 ${
                      isFormatBold ? 'font-bold' : ''
                    } ${isFormatItalic ? 'italic' : ''}`}
                  />

                  <button 
                    onClick={handleSendMessage}
                    className="min-w-[60px] px-3 py-1.5 rounded-md text-sm transition-colors font-['Bruno_Ace_SC'] flex items-center bg-[var(--accent-purple)] text-white hover:bg-[var(--message-sent)]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              ) : (
                // Desktop input area with all features
                <>
                  {/* Attachment Button */}
                  <button 
                    onClick={handleAttachmentClick}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Attach file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  
                  {/* Emoji Button */}
                  <button 
                    ref={emojiButtonRef}
                    onClick={handleEmojiClick}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Add emoji"
                  >
                    <FiSmile className="h-5 w-5" />
                  </button>

                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div 
                      ref={emojiPickerRef}
                      className="absolute z-50 transform -translate-y-full mb-2"
                      style={{
                        left: '0',
                        bottom: '100%'
                      }}
                    >
                      <div className="shadow-xl rounded-lg overflow-hidden">
                        {/* @ts-ignore */}
                        <Picker
                          data={data}
                          onEmojiSelect={handleEmojiSelect}
                          theme="light"
                          previewPosition="none"
                          skinTonePosition="search"
                          searchPosition="sticky"
                          navPosition="bottom"
                          perLine={8}
                          categories={["frequent", "smileys", "people", "nature", "foods", "activity", "places", "objects", "symbols", "flags"]}
                          set="native"
                        />
            </div>
                    </div>
                  )}
                  
                  {/* Voice Recording Button */}
                  <button 
                    onMouseDown={handleVoiceRecordStart}
                    onMouseUp={handleVoiceRecordStop}
                    onMouseLeave={handleVoiceRecordStop}
                    className={`p-2 transition-colors ${
                      isRecording 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title={isRecording ? 'Recording... Release to stop' : 'Hold to record voice message'}
                  >
                    <FiMic className="h-5 w-5" />
                    {isRecording && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </button>

                  {/* Text Formatting Button */}
                  <button 
                    onClick={handleFormatClick}
                    className={`p-2 transition-colors ${
                      showFormatting 
                        ? 'text-blue-500 hover:text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Text formatting"
                  >
                    <FiBold className="h-5 w-5" />
                  </button>

                  {/* Formatting Popup */}
                  {showFormatting && (
                    <div className="absolute bottom-20 bg-white rounded-lg shadow-lg p-2 flex space-x-2">
                      <button
                        onClick={toggleBold}
                        className={`p-2 rounded ${isFormatBold ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                        title="Bold"
                      >
                        <FiBold className="h-4 w-4" />
                      </button>
                      <button
                        onClick={toggleItalic}
                        className={`p-2 rounded ${isFormatItalic ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                        title="Italic"
                      >
                        <FiItalic className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>

                  {/* Selected File Preview */}
                  {selectedFile && (
                    <div className="flex items-center bg-gray-100 rounded px-2 py-1 mr-2">
                      <span className="text-xs text-gray-600 truncate max-w-[100px]">
                        {selectedFile.name}
                      </span>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type here..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={`flex-1 bg-transparent outline-none text-sm font-['Michroma'] mx-2 ${
                      isFormatBold ? 'font-bold' : ''
                    } ${isFormatItalic ? 'italic' : ''}`}
                  />

                  {/* Send Button */}
                  <button 
                    onClick={handleSendMessage}
                    className="ml-2 px-4 py-1.5 rounded-md text-sm transition-colors font-['Bruno_Ace_SC'] flex items-center bg-[var(--accent-purple)] text-white hover:bg-[var(--message-sent)]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className={modalBaseClass}>
          <div className={`${modalContentClass} w-[90vw] md:w-[480px] max-h-[90vh]`}>
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

      {/* Video Call Modal */}
      {showCallModal && callType === 'video' && (
        <div className={modalBaseClass}>
          <div className={`${modalContentClass} w-[90vw] md:w-[800px] h-[90vh] md:h-[600px]`}>
            {/* Main Video Area */}
            <div className="relative w-full h-full bg-gray-800">
              <Image
                src={selectedChat?.startsWith('team_') 
                  ? mockTeams.find(t => `team_${t.id}` === selectedChat)?.logo || "/avatars/placeholder.svg"
                  : selectedUser?.avatar || "/avatars/placeholder.svg"}
                alt={selectedChat?.startsWith('team_')
                  ? mockTeams.find(t => `team_${t.id}` === selectedChat)?.name || "Team"
                  : selectedUser?.name || "User"}
                layout="fill"
                objectFit="cover"
                className="opacity-90"
              />

              {/* Call Info */}
              <div className="absolute top-4 left-4 flex items-center space-x-3">
                <div className="bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                  <p className="text-white font-['Audiowide'] text-sm">
                    {selectedChat?.startsWith('team_')
                      ? `${mockTeams.find(t => `team_${t.id}` === selectedChat)?.name} Meeting`
                      : selectedUser?.name}
                  </p>
                </div>
                <div className="bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-xs font-['Michroma']">Live</span>
                  </div>
                </div>
              </div>

              {/* Control Bar */}
              <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/80 to-transparent">
                <div className="h-full flex items-center justify-center space-x-6">
                  <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`}
                  >
                    {isMuted ? (
                      <FiMicOff className="w-6 h-6 text-white" />
                    ) : (
                      <FiMic className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`}
                  >
                    {isVideoOff ? (
                      <FiCameraOff className="w-6 h-6 text-white" />
                    ) : (
                      <FiCamera className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <button
                    onClick={handleEndCall}
                    className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    <FiPhone className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    {isFullscreen ? (
                      <FiMinimize2 className="w-6 h-6 text-white" />
                    ) : (
                      <FiMaximize2 className="w-6 h-6 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audio Call Modal */}
      {showCallModal && callType === 'audio' && (
        <div className={modalBaseClass}>
          <div className={`${modalContentClass} w-[90vw] md:w-[400px]`}>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border-4 border-[#3E7BFA]">
                <Image
                  src={selectedUser?.avatar || "/avatars/placeholder.svg"}
                  alt={selectedUser?.name || "User"}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-['Audiowide'] mb-2">{selectedUser?.name}</h3>
              <p className="text-gray-500 font-['Michroma'] text-sm mb-8">
                Audio Call in Progress...
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                >
                  {isMuted ? (
                    <FiMicOff className="w-6 h-6 text-white" />
                  ) : (
                    <FiMic className="w-6 h-6 text-gray-700" />
                  )}
                </button>
                <button
                  onClick={handleEndCall}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 transition-colors"
                >
                  <FiPhone className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Modal */}
      {showTeamModal && teamModalData && (
        <div className={modalBaseClass}>
          <div className={`${modalContentClass} w-[90vw] md:w-[480px]`}>
            {/* Modal Header */}
            <div 
              className="h-32 relative flex items-center justify-center"
              style={{ background: teamModalData.bgGradient }}
            >
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setShowTeamModal(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
                </button>
              </div>
              <div className="w-24 h-24 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center p-4">
                <Image
                  src={teamModalData.logo}
                  alt={teamModalData.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h2 className="text-2xl font-['Audiowide'] text-center mb-6">{teamModalData.name}</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiMessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-['Michroma'] text-sm">Team Chat</h3>
                      <p className="text-xs text-gray-500">Connect with team members</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleJoinTeamChat(teamModalData.id)}
                    className={`px-4 py-2 ${
                      activeTeamChat === teamModalData.id
                        ? 'bg-blue-200 text-blue-700'
                        : 'bg-[#3E7BFA] text-white hover:bg-blue-600'
                    } rounded-lg transition-colors text-sm font-['Bruno_Ace_SC']`}
                  >
                    {activeTeamChat === teamModalData.id ? 'Joined' : 'Join'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FiVideo className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-['Michroma'] text-sm">Team Meeting</h3>
                      <p className="text-xs text-gray-500">Start or join team meeting</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStartTeamMeeting(teamModalData)}
                    className={`px-4 py-2 ${
                      isInTeamMeeting && selectedChat === `team_${teamModalData.id}`
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white rounded-lg transition-colors text-sm font-['Bruno_Ace_SC']`}
                  >
                    {isInTeamMeeting && selectedChat === `team_${teamModalData.id}` ? 'End' : 'Start'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-['Michroma'] text-sm">Team Files</h3>
                      <p className="text-xs text-gray-500">Access shared documents</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleOpenTeamFiles(teamModalData)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-['Bruno_Ace_SC']"
                  >
                    Open
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setShowTeamModal(false)}
                  className="w-full py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm font-['Michroma']"
                >
                  Close
                </button>
              </div>
            </div>
            </div>
          </div>
        )}

      {/* Team Files Modal */}
      {showTeamFiles && teamModalData && (
        <div className={modalBaseClass}>
          <div className={`${modalContentClass} w-[90vw] md:w-[800px]`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <Image
                    src={teamModalData.logo}
                    alt={teamModalData.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
      </div>
                <div>
                  <h2 className="text-xl font-['Audiowide']">{teamModalData.name} Files</h2>
                  <p className="text-sm text-gray-500 font-['Michroma']">Shared documents and resources</p>
    </div>
              </div>
              <button 
                onClick={() => setShowTeamFiles(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {mockFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-['Michroma'] text-sm">{file.name}</h3>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Teams Modal */}
      {showAllTeams && (
        <div className={modalBaseClass}>
          <div className={`${modalContentClass} w-[90vw] md:w-[800px]`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-['Audiowide']">All Teams</h2>
              <button 
                onClick={() => setShowAllTeams(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {mockTeams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => {
                      handleTeamClick(team);
                      setShowAllTeams(false);
                    }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer transform hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${team.color}20 0%, ${team.color}40 100%)`
                    }}
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden mr-4 flex items-center justify-center">
                      <Image
                        src={team.logo}
                        alt={team.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-['Audiowide'] text-lg mb-1">{team.name}</h3>
                      <p className="text-sm text-gray-500 font-['Michroma']">Click to view details</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Search in Chat Modal */}
      {showSearchInChat && (
        <div className={modalBaseClass}>
          <div className={`${modalContentClass} w-[90vw] md:w-[600px]`}>
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in conversation..."
                  value={searchInChatQuery}
                  onChange={(e) => handleSearchInChatQueryChange(e.target.value)}
                  className="w-full chat-input py-2 pl-10 pr-4 text-sm font-['Michroma']"
                  autoFocus
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                <button
                  onClick={() => {
                    setShowSearchInChat(false);
                    setSearchInChatQuery('');
                    setSearchedMessages([]);
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto p-4">
              {searchInChatQuery && searchedMessages.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No messages found</p>
              ) : (
                <div className="space-y-4">
                  {searchedMessages.map((message) => (
                    <div
                      key={message.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => {
                        const messageElement = document.getElementById(`message-${message.id}`);
                        messageElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setShowSearchInChat(false);
                        setSearchInChatQuery('');
                        setSearchedMessages([]);
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">{message.time}</span>
                        <span className="text-xs text-gray-500">{message.isMe ? 'You' : selectedUser?.name}</span>
                      </div>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatLayout; 