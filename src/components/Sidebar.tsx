import React, { useEffect } from 'react';
import UserCard from './UserCard';
import { useSidebar } from './SidebarContext';
import backArrow from '../assets/arrow_back.svg';
import frontArrow from '../assets/arrow_forward.svg';

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // Tailwind's 'md' breakpoint
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsSidebarOpen]);

  const OpenSidebarButton = () => (
    <button
      onClick={() => setIsSidebarOpen(true)}
      className="fixed top-0 left-0 z-50 px-2 pt-20 m-2 text-white bg-transparent rounded"
      aria-label="Open sidebar"
    >
      <img src={frontArrow} className='text-white' alt="Open" />
    </button>
  );

  return (
    <>
      {!isSidebarOpen && <OpenSidebarButton />}
      <div className={`mt-16 rounded transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-full md:w-1/2 lg:w-1/4" : "w-0"} mr-3 bg-slate-800 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-slate-800`}>
        <div className="flex items-center justify-between ml-1 mt-4">
          <input
            className='flex items-center p-2 mx-1 text-white bg-slate-900 shadow rounded-lg w-11/12 outline-none'
            type="search"
            placeholder="Search"
          />
          <button onClick={() => setIsSidebarOpen(false)} className="mx-4 text-white">
            <img src={backArrow} className='text-white' alt="Close" />
          </button>
        </div>
        {isSidebarOpen && (
          <>
            <UserCard username='Andrew Lam' profilePicture='' status='active' description='FrontEnd & Deployment' />
            <UserCard username='Tyler Hipolito' profilePicture='' status='active' description='Security & Encryption' />
            <UserCard username='Allen Chiang' profilePicture='' status='active' description='Client & Server' />
            <UserCard username='Michael Tran' profilePicture='' status='active' description='Database Schema Design' />
            <UserCard username='Danny Nguyen' profilePicture='' status='active' description='Client & Server' />
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
