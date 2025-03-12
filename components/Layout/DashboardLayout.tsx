import React from 'react';
import Navigation from '../Navigation/Navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container-app py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 