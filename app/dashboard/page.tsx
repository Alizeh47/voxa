'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Phone, Video, Plus, Search, Users, FileText, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import SharedLayout from '@/components/Layout/SharedLayout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState('');
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState<Date>();
  const [reminderTime, setReminderTime] = useState('');
  const [reminderDuration, setReminderDuration] = useState('30');
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Team Meeting 1', time: '2:00 PM', date: new Date(), duration: '30' },
    { id: 2, title: 'Team Meeting 2', time: '3:00 PM', date: new Date(), duration: '30' },
    { id: 3, title: 'Team Meeting 3', time: '4:00 PM', date: new Date(), duration: '30' },
  ]);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentFiles, setRecentFiles] = useState([
    { id: 1, name: 'Project Proposal.pdf', type: 'pdf', size: '2.5 MB', lastModified: '2024-03-10' },
    { id: 2, name: 'Meeting Notes.docx', type: 'doc', size: '1.2 MB', lastModified: '2024-03-09' },
    { id: 3, name: 'Budget Report.xlsx', type: 'excel', size: '3.8 MB', lastModified: '2024-03-08' },
  ]);

  // Mock data for recent chats
  const recentChats = [
    {
      id: 1,
      name: 'Marketing Team',
      lastMessage: 'Let\'s discuss the new campaign strategy',
      time: '10:30 AM',
      unread: 3,
      isGroup: true,
    },
    {
      id: 2,
      name: 'Jane Smith',
      lastMessage: 'The presentation looks great!',
      time: 'Yesterday',
      unread: 0,
      isGroup: false,
    },
    {
      id: 3,
      name: 'Product Development',
      lastMessage: 'We need to fix that bug before release',
      time: 'Yesterday',
      unread: 5,
      isGroup: true,
    },
    {
      id: 4,
      name: 'John Doe',
      lastMessage: 'Can we schedule a call tomorrow?',
      time: 'Monday',
      unread: 0,
      isGroup: false,
    },
  ];

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

  const filteredChats = recentChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    setIsNewChatModalOpen(true);
  };

  const handleNewGroup = () => {
    setIsNewGroupModalOpen(true);
  };

  const handleCreateGroup = () => {
    // Here you would typically make an API call to create the group
    console.log('Creating group:', { name: groupName, members: groupMembers.split(',') });
    setIsNewGroupModalOpen(false);
    setGroupName('');
    setGroupMembers('');
    router.push('/chat/groups');
  };

  const handleStartCall = () => {
    setIsCallModalOpen(true);
  };

  const handleInitiateCall = () => {
    // Here you would typically initiate the call with the selected type
    console.log('Starting', callType, 'call');
    setIsCallModalOpen(false);
    router.push(`/call/${callType}`);
  };

  const handleFiles = () => {
    router.push('/files');
  };

  const handleAddReminder = () => {
    setIsReminderModalOpen(true);
  };

  const handleCreateReminder = () => {
    if (!reminderTitle || !reminderDate || !reminderTime) return;

    const newReminder = {
      id: reminders.length + 1,
      title: reminderTitle,
      time: reminderTime,
      date: reminderDate,
      duration: reminderDuration
    };

    setReminders([...reminders, newReminder]);
    setIsReminderModalOpen(false);
    setReminderTitle('');
    setReminderDate(undefined);
    setReminderTime('');
    setReminderDuration('30');
  };

  const handleCallAgain = (callDetails: { title: string }) => {
    setIsCallModalOpen(true);
    // Store the call details for when the call is initiated
    console.log('Calling again:', callDetails);
  };

  const handleStartNewChat = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      // Here you would typically make an API call to create a new chat
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      router.push(`/chat/${selectedUser}`);
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setIsLoading(false);
      setIsNewChatModalOpen(false);
      setSelectedUser('');
    }
  };

  const handleChatClick = (chatId: number) => {
    setIsLoading(true);
    router.push(`/chat/${chatId}`);
  };

  const handleFileClick = (fileId: number) => {
    router.push(`/files/${fileId}`);
  };

  return (
    <SharedLayout>
      <motion.div 
        className="space-y-8 p-6"
        initial="hidden"
        animate="show"
        variants={container}
      >
        {/* Header Section with working search */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          variants={item}
        >
          <h1 className="text-3xl md:text-4xl font-['Audiowide'] bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Dashboard
          </h1>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3E7BFA] font-['Tomorrow'] bg-white/80 backdrop-blur-sm"
            />
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </motion.div>

        {/* Quick Actions with working buttons */}
        <motion.div variants={item}>
          <h2 className="text-xl font-['Bruno_Ace_SC'] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: <MessageSquare />, label: 'New Chat', color: 'from-blue-500 to-blue-600', onClick: handleNewChat },
              { icon: <Users />, label: 'New Group', color: 'from-purple-500 to-purple-600', onClick: handleNewGroup },
              { icon: <Video />, label: 'Start Call', color: 'from-green-500 to-green-600', onClick: handleStartCall },
              { icon: <FileText />, label: 'Files', color: 'from-orange-500 to-orange-600', onClick: handleFiles }
            ].map((action, index) => (
              <motion.button
                key={action.label}
                onClick={action.onClick}
                className={`p-6 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300`}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                variants={item}
              >
                <div className="flex flex-col items-center space-y-2">
                  {action.icon}
                  <span className="font-['Michroma'] text-sm">{action.label}</span>
        </div>
              </motion.button>
            ))}
        </div>
        </motion.div>

        {/* Recent Conversations with working chat links */}
        <motion.div variants={item}>
          <h2 className="text-xl font-['Bruno_Ace_SC'] mb-4">Recent Conversations</h2>
          <div className="space-y-3">
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                className="p-4 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white cursor-pointer transition-all duration-300 border border-gray-100"
                whileHover={{ x: 10 }}
                variants={item}
                onClick={() => handleChatClick(chat.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-[#3E7BFA] to-[#6F42C1] flex items-center justify-center text-white font-['Audiowide']">
                      {chat.isGroup ? <Users className="h-6 w-6" /> : chat.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <p className="font-['Bruno_Ace_SC']">{chat.name}</p>
                      <p className="text-sm text-gray-500 font-['Tomorrow'] truncate max-w-xs">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-['Michroma']">{chat.time}</p>
                    {chat.unread > 0 && (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#3E7BFA] text-white text-xs mt-1 font-['Tomorrow']">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reminders Section */}
        <motion.div variants={item} className="mb-8 relative">
          {/* Geometric Decorations */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <motion.h2 
                className="text-2xl font-['Bruno_Ace_SC'] relative"
                whileHover={{ scale: 1.05 }}
              >
                Reminders
                <motion.div 
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </motion.h2>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 font-['Tomorrow'] relative overflow-hidden group"
                onClick={handleAddReminder}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <Plus className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Add Reminder</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {reminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  className="relative bg-gradient-to-r from-[#3E7BFA]/10 to-[#6F42C1]/10 p-6 rounded-xl backdrop-blur-sm overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3E7BFA] to-[#6F42C1]" />
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-purple-500/5 rounded-full transform rotate-45 group-hover:scale-150 transition-transform duration-500" />
                  <div className="flex items-start gap-4 relative z-10">
                    <motion.div 
                      className="p-3 bg-[#3E7BFA] rounded-xl"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Bell className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-['Bruno_Ace_SC'] text-lg mb-1">{reminder.title}</h3>
                      <p className="text-sm text-gray-600 font-['Tomorrow']">
                        {format(reminder.date, 'MMM dd')} at {reminder.time}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500 font-['Michroma']">{reminder.duration} min</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call Logs Section */}
        <motion.div variants={item} className="relative">
          {/* Geometric Decorations */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative">
            <motion.h2 
              className="text-2xl font-['Bruno_Ace_SC'] mb-6 relative inline-block"
              whileHover={{ scale: 1.05 }}
            >
              Recent Calls
              <motion.div 
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-green-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </motion.h2>
            <div className="space-y-6">
              {[
                { id: 1, title: 'Marketing Team Call 1', time: '10:30 AM' },
                { id: 2, title: 'Marketing Team Call 2', time: '11:30 AM' },
                { id: 3, title: 'Marketing Team Call 3', time: '12:30 PM' }
              ].map((call, index) => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    x: 10,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-green-500/5 rounded-full transform rotate-45 group-hover:scale-150 transition-transform duration-500" />
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Phone className="w-5 h-5 text-green-600" />
                      </motion.div>
                      <div>
                        <h3 className="font-['Bruno_Ace_SC'] text-lg">{call.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-sm text-gray-500 font-['Tomorrow']">Today, {call.time} • 45 min</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-['Michroma']">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="font-['Tomorrow'] relative overflow-hidden group"
                      onClick={() => handleCallAgain(call)}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                      <span className="relative z-10">Call Again</span>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* New Group Modal */}
      <Dialog open={isNewGroupModalOpen} onOpenChange={setIsNewGroupModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-['Bruno_Ace_SC']">Create New Group</DialogTitle>
            <DialogDescription className="font-['Tomorrow']">
              Create a new group chat by adding members.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-['Michroma']">Group Name</label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="font-['Tomorrow']"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-['Michroma']">Members (comma-separated emails)</label>
              <Input
                value={groupMembers}
                onChange={(e) => setGroupMembers(e.target.value)}
                placeholder="member1@example.com, member2@example.com"
                className="font-['Tomorrow']"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewGroupModalOpen(false)}
              className="font-['Tomorrow']"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              className="bg-purple-600 hover:bg-purple-700 text-white font-['Tomorrow']"
              disabled={!groupName || !groupMembers}
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Call Modal */}
      <Dialog open={isCallModalOpen} onOpenChange={setIsCallModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-['Bruno_Ace_SC']">Start a Call</DialogTitle>
            <DialogDescription className="font-['Tomorrow']">
              Choose your preferred call type.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              onClick={() => setCallType('audio')}
              className={`p-6 font-['Tomorrow'] ${
                callType === 'audio' ? 'border-2 border-blue-500' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Phone className="w-8 h-8" />
                <span>Audio Call</span>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => setCallType('video')}
              className={`p-6 font-['Tomorrow'] ${
                callType === 'video' ? 'border-2 border-blue-500' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Video className="w-8 h-8" />
                <span>Video Call</span>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCallModalOpen(false)}
              className="font-['Tomorrow']"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInitiateCall}
              className="bg-green-600 hover:bg-green-700 text-white font-['Tomorrow']"
            >
              Start {callType} Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Reminder Modal */}
      <Dialog open={isReminderModalOpen} onOpenChange={setIsReminderModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-['Bruno_Ace_SC']">Add Reminder</DialogTitle>
            <DialogDescription className="font-['Tomorrow']">
              Set up a new reminder for your calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-['Michroma']">Title</label>
              <Input
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
                placeholder="Enter reminder title"
                className="font-['Tomorrow']"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-['Michroma']">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-['Tomorrow']",
                      !reminderDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {reminderDate ? format(reminderDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={reminderDate}
                    onSelect={setReminderDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-['Michroma']">Time</label>
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="font-['Tomorrow']"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-['Michroma']">Duration (minutes)</label>
              <Input
                type="number"
                value={reminderDuration}
                onChange={(e) => setReminderDuration(e.target.value)}
                min="5"
                max="180"
                step="5"
                className="font-['Tomorrow']"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReminderModalOpen(false)}
              className="font-['Tomorrow']"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateReminder}
              className="bg-purple-600 hover:bg-purple-700 text-white font-['Tomorrow']"
              disabled={!reminderTitle || !reminderDate || !reminderTime}
            >
              Add Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Chat Modal */}
      <Dialog open={isNewChatModalOpen} onOpenChange={setIsNewChatModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-['Bruno_Ace_SC']">Start New Chat</DialogTitle>
            <DialogDescription className="font-['Tomorrow']">
              Enter the username or email to start a new conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-['Michroma']">Username or Email</label>
              <Input
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                placeholder="Enter username or email"
                className="font-['Tomorrow']"
              />
        </div>
      </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewChatModalOpen(false)}
              className="font-['Tomorrow']"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartNewChat}
              className="bg-blue-600 hover:bg-blue-700 text-white font-['Tomorrow']"
              disabled={!selectedUser || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Chat
                </>
              ) : (
                'Start Chat'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SharedLayout>
  );
};

export default Dashboard; 