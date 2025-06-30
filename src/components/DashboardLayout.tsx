import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-background group/design-root overflow-x-hidden" style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex flex-1 justify-center py-5 px-4">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;