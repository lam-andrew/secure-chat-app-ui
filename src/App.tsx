import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { SidebarProvider } from './components/SidebarContext';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [isSidebarOpen] = useState(true);
  const responseMessage = (response: any) => {
    console.log(response);
  };
  const errorMessage = (error: any) => {
    console.log(error);
  };
  return (
    <>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage as any} />
      <SidebarProvider>
        <div className="flex h-screen p-4 bg-slate-900">
          <Sidebar />
          <Chat className={`${isSidebarOpen ? 'md:w-3/4 lg:w-3/4' : 'w-full'}`} />
        </div>
      </SidebarProvider>
    </>
  );
}

export default App;
