import React from 'react';
import { default as ImportedSidebar } from '../chat/Sidebar';
import { BackButton } from '@/components/ui/back-button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-[var(--primary-bg)] pattern-dots flex">
      <ImportedSidebar />
      <main className="flex-1 h-full overflow-y-auto">
        <div className="container-app py-6 px-4 md:px-6 lg:px-8">
          <div className="mb-6">
            <BackButton />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 