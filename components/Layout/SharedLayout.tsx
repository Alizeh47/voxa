import React from 'react';
import { default as ImportedSidebar } from '@/components/chat/Sidebar';

interface SharedLayoutProps {
  children: React.ReactNode;
}

const SharedLayout = ({ children }: SharedLayoutProps) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ImportedSidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default SharedLayout; 