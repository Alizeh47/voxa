'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { 
  FiMenu,
  FiMessageCircle,
  FiGrid,
  FiSettings,
  FiLogOut,
  FiUser
} from 'react-icons/fi';

interface NavItem {
  id: string;
  icon: JSX.Element;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('messages');

  useEffect(() => {
    // Set active item based on current pathname
    const currentPath = pathname.split('/')[1];
    setActiveItem(currentPath || 'messages');
  }, [pathname]);

  const handleLogout = async () => {
    // Add your logout logic here
    try {
      // await signOut() or your logout function
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems: NavItem[] = [
    {
      id: 'messages',
      icon: <FiMessageCircle size={20} />,
      label: 'Messages',
      href: '/'
    },
    {
      id: 'diamond',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.7,10.3l8.3-8.3c0.4-0.4,1-0.4,1.4,0l8.3,8.3c0.4,0.4,0.4,1,0,1.4l-8.3,8.3c-0.4,0.4-1,0.4-1.4,0l-8.3-8.3 C2.3,11.3,2.3,10.7,2.7,10.3z"/>
        </svg>
      ),
      label: 'Projects',
      href: '/projects'
    },
    {
      id: 'dashboard',
      icon: <FiGrid size={20} />,
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      id: 'profile',
      icon: <FiUser size={20} />,
      label: 'Profile',
      href: '/profile'
    },
    {
      id: 'settings',
      icon: <FiSettings size={20} />,
      label: 'Settings',
      href: '/settings'
    }
  ];

  const handleNavigation = (item: NavItem) => {
    setActiveItem(item.id);
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <div 
      className={`${
        isCollapsed ? 'w-[72px]' : 'w-[200px]'
      } h-screen bg-[#2A3447] flex flex-col items-center py-6 transition-all duration-300 ease-in-out ${className}`}
    >
      {/* App Name */}
      <div className={`mb-6 ${isCollapsed ? 'scale-0 h-0' : 'scale-100 h-auto'} transition-all duration-300`}>
        <h1 className="app-name text-2xl">Voxa</h1>
      </div>

      {/* Menu Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-300 mb-8"
      >
        <FiMenu size={24} />
      </button>

      {/* Main Navigation */}
      <div className="flex flex-col items-center space-y-6 w-full px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item)}
            className={`w-full h-10 flex items-center ${
              isCollapsed ? 'justify-center' : 'px-3'
            } rounded-xl transition-all duration-200 ${
              activeItem === item.id
                ? 'bg-white/10 text-white relative'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {activeItem === item.id && (
              <div className="absolute left-0 w-1 h-full bg-[#3E7BFA] rounded-r-md"></div>
            )}
            <span className="flex items-center justify-center">
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="ml-3 font-tomorrow text-sm">{item.label}</span>
            )}
          </button>
        ))}
      </div>

      {/* Logout - At Bottom */}
      <div className="mt-auto px-3 w-full">
        <button 
          onClick={handleLogout}
          className={`w-full h-10 flex items-center ${
            isCollapsed ? 'justify-center' : 'px-3'
          } text-gray-400 hover:text-gray-300 transition-colors`}
        >
          <FiLogOut size={20} />
          {!isCollapsed && (
            <span className="ml-3 font-tomorrow text-sm">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 