import React from 'react';
import { SidebarProvider } from '../components/SidebarContext';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';

const MainPage: React.FC<{isSidebarOpen: boolean}> = ({ isSidebarOpen }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen p-4 bg-slate-900">
        <Sidebar />
        <Chat className={`${isSidebarOpen ? 'md:w-3/4 lg:w-3/4' : 'w-full'}`} />
      </div>
    </SidebarProvider>
  );
}

export default MainPage;
