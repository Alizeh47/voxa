'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Image, Edit2, Plus, Sparkles, Heart, MessageCircle, Share2, MoreVertical, ChevronLeft, ChevronRight, X, Check, Upload } from 'lucide-react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { BackButton } from '@/components/ui/back-button';
import { default as ImportedSidebar } from '@/components/chat/Sidebar';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SharedLayout from '@/components/Layout/SharedLayout';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState('/images/avatar.jpg');
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isLiked, setIsLiked] = useState<{ [key: number]: boolean }>({});
  const storiesRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // Avatar customization state
  const [activeCustomization, setActiveCustomization] = useState<string>('hairstyle');
  const [avatarOptions, setAvatarOptions] = useState({
    hairstyle: 0,
    eyes: 0,
    nose: 0,
    mouth: 0,
    facialHair: 0,
    accessories: 0,
    skinTone: 3
  });

  const customizationTabs = [
    { id: 'hairstyle', label: 'Hairstyle' },
    { id: 'eyes', label: 'Eyes' },
    { id: 'nose', label: 'Nose' },
    { id: 'mouth', label: 'Mouth' },
    { id: 'facialHair', label: 'Facial Hair' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'skinTone', label: 'Skin Tone' }
  ];

  const hairstyles = [
    { id: 0, image: '/images/avatar/hair1.jpg' },
    { id: 1, image: '/images/avatar/hair2.jpg' },
    { id: 2, image: '/images/avatar/hair3.jpg' },
    { id: 3, image: '/images/avatar/hair4.jpg' },
    { id: 4, image: '/images/avatar/hair5.jpg' },
    { id: 5, image: '/images/avatar/hair6.jpg' },
    { id: 6, image: '/images/avatar/hair7.jpg' },
    { id: 7, image: '/images/avatar/hair8.jpg' }
  ];

  const skinTones = [
    { id: 0, color: '#f8d5c2' },
    { id: 1, color: '#f3c19d' },
    { id: 2, color: '#e8b080' },
    { id: 3, color: '#c68642' },
    { id: 4, color: '#a56c29' },
    { id: 5, color: '#70361c' },
    { id: 6, color: '#321000' }
  ];

  const handleOptionChange = (category: string, id: number) => {
    setAvatarOptions({
      ...avatarOptions,
      [category]: id
    });
  };

  const stories = [
    {
      id: 1,
      title: 'My Latest Adventure',
      image: '/images/story1.jpg',
      time: '2 hours ago',
      likes: 128,
      comments: 24,
      views: 1.2,
      description: 'Exploring hidden trails in the mountains, discovering breathtaking views and making unforgettable memories.'
    },
    {
      id: 2,
      title: 'City Lights',
      image: '/images/story2.jpg',
      time: '5 hours ago',
      likes: 256,
      comments: 42,
      views: 2.1,
      description: 'Capturing the vibrant energy of city life at night, where every corner tells a different story.'
    },
    {
      id: 3,
      title: 'Mountain Trek',
      image: '/images/story3.jpg',
      time: '1 day ago',
      likes: 512,
      comments: 89,
      views: 3.8,
      description: 'Conquering new heights and challenging ourselves with an epic mountain expedition.'
    },
    {
      id: 4,
      title: 'Beach Sunset',
      image: '/images/story4.jpg',
      time: '2 days ago',
      likes: 1024,
      comments: 156,
      views: 5.2,
      description: 'Finding peace in the gentle waves and watching the sun paint the sky in brilliant colors.'
    },
    {
      id: 5,
      title: 'Urban Exploration',
      image: '/images/story5.jpg',
      time: '3 days ago',
      likes: 768,
      comments: 98,
      views: 4.3,
      description: 'Discovering hidden gems in the city, from secret gardens to historic architecture.'
    },
    {
      id: 6,
      title: 'Coffee & Code',
      image: '/images/story6.jpg',
      time: '4 days ago',
      likes: 384,
      comments: 45,
      views: 2.8,
      description: 'A perfect day of coding in a cozy café, where creativity flows with every sip.'
    },
    {
      id: 7,
      title: 'Night Photography',
      image: '/images/story7.jpg',
      time: '5 days ago',
      likes: 896,
      comments: 123,
      views: 4.1,
      description: 'Experimenting with long exposure shots to capture the magic of the night sky.'
    },
    {
      id: 8,
      title: 'Travel Diaries',
      image: '/images/story8.jpg',
      time: '1 week ago',
      likes: 2048,
      comments: 289,
      views: 7.2,
      description: 'A collection of moments from our journey across different cultures and landscapes.'
    }
  ];

  // Duplicate stories for infinite loop effect
  const duplicatedStories = [...stories, ...stories, ...stories];

  useEffect(() => {
    if (!autoScroll) return;
    
    const startScrolling = async () => {
      await controls.start({
        x: '-100%',
        transition: { 
          duration: 120,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      });
    };
    
    startScrolling();
    
    return () => {
      controls.stop();
    };
  }, [controls, autoScroll]);

  const handleMouseEnter = () => {
    setAutoScroll(false);
    controls.stop();
  };

  const handleMouseLeave = () => {
    setAutoScroll(true);
    controls.start({
      x: '-100%',
      transition: { 
        duration: 60,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop"
      }
    });
  };

  const handleStoryClick = (id: number) => {
    setSelectedStory(id);
  };

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const glowVariants = {
    initial: { 
      boxShadow: "0 0 0px rgba(62, 123, 250, 0)" 
    },
    animate: { 
      boxShadow: "0 0 20px rgba(62, 123, 250, 0.7)",
      transition: { 
        duration: 1.5, 
        repeat: Infinity, 
        repeatType: "reverse" as const
      }
    }
  };

  // Handle file upload for avatar
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarUrl(e.target.result as string);
          toast.success('Profile photo updated successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle story like
  const handleLike = (storyId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsLiked(prev => {
      const newState = { ...prev, [storyId]: !prev[storyId] };
      const story = stories.find(s => s.id === storyId);
      if (story) {
        if (newState[storyId]) {
          story.likes += 1;
          toast.success('Story liked!');
        } else {
          story.likes -= 1;
          toast.success('Story unliked');
        }
      }
      return newState;
    });
  };

  // Handle story comment
  const handleComment = (storyId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // You can implement a comment modal here
    toast.info('Comment feature coming soon!');
  };

  // Handle story share
  const handleShare = (storyId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: stories.find(s => s.id === storyId)?.title || 'Check out this story!',
        text: stories.find(s => s.id === storyId)?.description || 'Amazing story to share',
        url: window.location.href,
      }).then(() => {
        toast.success('Story shared successfully!');
      }).catch(() => {
        toast.error('Error sharing story');
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success('Link copied to clipboard!');
      });
    }
  };

  // Handle add story
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    description: '',
    image: null as string | null
  });
  const storyFileInputRef = useRef<HTMLInputElement>(null);

  // Handle story image upload
  const handleStoryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result && typeof result === 'string') {
          setNewStory(prev => ({
            ...prev,
            image: result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle story creation
  const handleCreateStory = () => {
    if (!newStory.title || !newStory.description || !newStory.image) {
      toast.error('Please fill in all fields and add an image');
      return;
    }

    const newStoryObj = {
      id: stories.length + 1,
      title: newStory.title,
      description: newStory.description,
      image: newStory.image,
      time: 'Just now',
      likes: 0,
      comments: 0,
      views: 0
    };

    stories.unshift(newStoryObj);
    setNewStory({
      title: '',
      description: '',
      image: null
    });
    setIsAddStoryModalOpen(false);
    toast.success('Story created successfully!');
  };

  // Update handleAddStory to open modal
  const handleAddStory = () => {
    setIsAddStoryModalOpen(true);
  };

  // Handle avatar customization save
  const handleSaveAvatar = () => {
    toast.success('Avatar customization saved successfully!');
  };

  // Handle avatar customization cancel
  const handleCancelCustomization = () => {
    // Reset avatar options to default
    setAvatarOptions({
      hairstyle: 0,
      eyes: 0,
      nose: 0,
      mouth: 0,
      facialHair: 0,
      accessories: 0,
      skinTone: 3
    });
    toast.info('Avatar customization cancelled');
  };

  return (
    <SharedLayout>
      <div className="container mx-auto p-6 relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl" />
        </div>

        <div className="mb-6">
          <BackButton />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <div className="relative inline-block">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                variants={glowVariants}
                initial="initial"
                animate="animate"
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-0 right-0 rounded-full p-2 bg-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <motion.h1 
              className="text-3xl font-cal font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              John Doe
            </motion.h1>
            <motion.p 
              className="text-gray-600 dark:text-gray-400 font-inter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              @johndoe
            </motion.p>
          </motion.div>

          {/* Stories Section */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-cal font-semibold">Your Stories</h2>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 group"
                onClick={handleAddStory}
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                Add Story
              </Button>
            </div>
            
            <div className="relative overflow-hidden">
              <div className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
                  onClick={() => {
                    if (storiesRef.current) {
                      storiesRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
                  onClick={() => {
                    if (storiesRef.current) {
                      storiesRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                    }
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div 
                className="overflow-hidden py-4 px-2 relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={storiesRef}
              >
                <motion.div 
                  className="flex space-x-4 w-max"
                  animate={controls}
                  initial={{ x: 0 }}
                >
                  {duplicatedStories.map((story, index) => (
                    <motion.div 
                      key={`${story.id}-${index}`}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -5,
                        transition: { type: "spring", stiffness: 300 }
                      }}
                      className="group cursor-pointer"
                      onClick={() => handleStoryClick(story.id)}
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 w-64">
                        <CardContent className="p-0">
                          <div className="aspect-square relative">
                            <img
                              src={story.image}
                              alt={story.title}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <motion.h3 
                                  className="text-white font-medium mb-1"
                                  initial={{ y: 10, opacity: 0 }}
                                  whileHover={{ y: 0, opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {story.title}
                                </motion.h3>
                                <motion.p 
                                  className="text-white/90 text-sm mb-2 line-clamp-2"
                                  initial={{ y: 10, opacity: 0 }}
                                  whileHover={{ y: 0, opacity: 1 }}
                                  transition={{ duration: 0.2, delay: 0.1 }}
                                >
                                  {story.description}
                                </motion.p>
                                <motion.div 
                                  className="flex items-center gap-4 text-white/80 text-sm"
                                  initial={{ y: 10, opacity: 0 }}
                                  whileHover={{ y: 0, opacity: 1 }}
                                  transition={{ duration: 0.2, delay: 0.2 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`flex items-center gap-1 ${isLiked[story.id] ? 'text-red-500' : 'text-white'}`}
                                    onClick={(e) => handleLike(story.id, e)}
                                  >
                                    <Heart className={`w-4 h-4 ${isLiked[story.id] ? 'fill-current' : ''}`} />
                                    {story.likes}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1 text-white"
                                    onClick={(e) => handleComment(story.id, e)}
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    {story.comments}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1 text-white"
                                    onClick={(e) => handleShare(story.id, e)}
                                  >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                  </Button>
                                </motion.div>
                              </div>
                            </motion.div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="rounded-full bg-white/10 backdrop-blur-sm">
                                <MoreVertical className="w-4 h-4 text-white" />
                              </Button>
                            </div>
                            <motion.div 
                              className="absolute inset-0 border-2 border-transparent rounded-lg"
                              whileHover={{ 
                                borderColor: "rgba(62, 123, 250, 0.7)",
                                boxShadow: "0 0 15px rgba(62, 123, 250, 0.5)"
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Story Viewer */}
          <AnimatePresence>
            {selectedStory !== null && (
              <motion.div 
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedStory(null)}
              >
                <motion.div 
                  className="bg-white rounded-lg overflow-hidden max-w-2xl w-full mx-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative aspect-video">
                    <img 
                      src={stories.find(s => s.id === selectedStory)?.image || '/placeholder-story.jpg'} 
                      alt="Story" 
                      className="w-full h-full object-cover"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 rounded-full bg-black/20 text-white"
                      onClick={() => setSelectedStory(null)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-medium">
                      {stories.find(s => s.id === selectedStory)?.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {stories.find(s => s.id === selectedStory)?.time}
                    </p>
                    <p className="text-gray-700 mt-2">
                      {stories.find(s => s.id === selectedStory)?.description}
                    </p>
                    <div className="flex items-center gap-6 mt-4">
                      <Button variant="ghost" className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Like
                      </Button>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Comment
                      </Button>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Avatar Customization Section */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <Card className="overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
              <CardContent className="p-0">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-cal font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    Avatar Customization
                  </h2>
                </div>
                
                <div className="flex flex-col md:flex-row">
                  {/* Avatar Preview */}
                  <div className="w-full md:w-1/3 p-6 flex flex-col items-center border-r">
                    <div className="relative">
                      <motion.div 
                        className="w-48 h-48 rounded-full bg-gradient-to-r from-green-500/20 to-teal-500/20 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <img
                          src={avatarUrl}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-full bg-white shadow-md"
                          onClick={handleCancelCustomization}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-full bg-white shadow-md"
                          onClick={handleSaveAvatar}
                        >
                          <Check className="w-4 h-4 text-green-500" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-8 w-full">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Randomize</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-full"
                          onClick={() => {
                            // Randomize avatar options
                            setAvatarOptions({
                              hairstyle: Math.floor(Math.random() * 8),
                              eyes: Math.floor(Math.random() * 5),
                              nose: Math.floor(Math.random() * 5),
                              mouth: Math.floor(Math.random() * 5),
                              facialHair: Math.floor(Math.random() * 5),
                              accessories: Math.floor(Math.random() * 5),
                              skinTone: Math.floor(Math.random() * 7)
                            });
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            <span>Random</span>
                          </div>
                        </Button>
                      </div>
                      
                      <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                        Save Avatar
                      </Button>
                    </div>
                  </div>
                  
                  {/* Customization Options */}
                  <div className="w-full md:w-2/3 p-4">
                    {/* Tabs */}
                    <div className="flex overflow-x-auto pb-2 mb-4 no-scrollbar">
                      {customizationTabs.map((tab) => (
                        <Button
                          key={tab.id}
                          variant={activeCustomization === tab.id ? "default" : "ghost"}
                          className={`rounded-full px-4 py-2 mr-2 whitespace-nowrap ${
                            activeCustomization === tab.id 
                              ? "bg-blue-500 text-white" 
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                          onClick={() => setActiveCustomization(tab.id)}
                        >
                          {tab.label}
                        </Button>
                      ))}
                    </div>
                    
                    {/* Options Grid */}
                    <div className="grid grid-cols-4 gap-3">
                      {activeCustomization === 'hairstyle' && hairstyles.map((style) => (
                        <motion.div
                          key={style.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                            avatarOptions.hairstyle === style.id 
                              ? "border-green-500" 
                              : "border-transparent"
                          }`}
                          onClick={() => handleOptionChange('hairstyle', style.id)}
                        >
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <img 
                              src={style.image} 
                              alt={`Hairstyle ${style.id}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback for missing images
                                (e.target as HTMLImageElement).src = '/images/avatar/placeholder.png';
                              }}
                            />
                          </div>
                        </motion.div>
                      ))}
                      
                      {activeCustomization === 'skinTone' && skinTones.map((tone) => (
                        <motion.div
                          key={tone.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                            avatarOptions.skinTone === tone.id 
                              ? "border-green-500" 
                              : "border-transparent"
                          }`}
                          onClick={() => handleOptionChange('skinTone', tone.id)}
                        >
                          <div 
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: tone.color }}
                          />
                        </motion.div>
                      ))}
                      
                      {/* Placeholder for other customization options */}
                      {activeCustomization !== 'hairstyle' && activeCustomization !== 'skinTone' && (
                        <div className="col-span-4 py-8 text-center text-gray-500">
                          <p>More {activeCustomization} options coming soon!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add Story Modal */}
          <AnimatePresence>
            {isAddStoryModalOpen && (
              <motion.div 
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddStoryModalOpen(false)}
              >
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden max-w-lg w-full mx-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-semibold">Create New Story</h3>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setIsAddStoryModalOpen(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {/* Image Upload */}
                      <div 
                        className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => storyFileInputRef.current?.click()}
                      >
                        {newStory.image ? (
                          <img 
                            src={newStory.image} 
                            alt="Story preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                            <Upload className="w-8 h-8 mb-2" />
                            <p>Click to upload image</p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={storyFileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleStoryImageUpload}
                        />
                      </div>

                      {/* Title Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          placeholder="Enter story title"
                          value={newStory.title}
                          onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      {/* Description Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Enter story description"
                          value={newStory.description}
                          onChange={(e) => setNewStory(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                        />
                      </div>

                      {/* Create Button */}
                      <Button 
                        className="w-full"
                        onClick={handleCreateStory}
                      >
                        Create Story
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SharedLayout>
  );
} 