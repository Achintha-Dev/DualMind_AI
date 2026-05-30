import { useState } from 'react';
import ThemeToggle from './ThemeToggle'; 
import {NavLink, useNavigate} from 'react-router-dom'
import Login from './LoginAvatar'

import { FaArrowLeft } from 'react-icons/fa6';
import { FiMenu, FiMessageCircle } from 'react-icons/fi';
import { FiPlusCircle } from 'react-icons/fi'
import { RiCloseFill } from "react-icons/ri";

function Drawer({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  // State to handle desktop expanding and collapsing
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobileExpanded = isOpen || isExpanded;

  function handleNewChat(){
    sessionStorage.removeItem('guest_messages');

    navigate('/chat');
  }

  return (
    <>
      {/* Mobile Backdrop Overlay - Only active when mobile drawer is triggered open */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Drawer Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col justify-between py-6 border-r
        bg-white text-zinc-800 border-zinc-200
        dark:bg-[#1a1a1a] dark:text-zinc-400 dark:border-zinc-800
        transition-all duration-300 ease-in-out
        
        /* Visibility Status: Slide out from the left on mobile, stay locked on desktop */
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-screen

        /* FIXED RESPONSIVE RULE: Control expansion states natively across all mobile sizes */
        ${isMobileExpanded ? 'w-64 items-start px-4' : 'w-16 items-center px-0'}
      `}>
        
        {/* TOP SECTION: Menu Control & Navigation Items */}
        <div className="flex flex-col items-center lg:items-stretch gap-6 w-full">
          
            {/* Header Area with Expand/Collapse toggle button */}
            <div className={`flex w-full items-center ${isMobileExpanded ? 'justify-between px-2' : 'justify-center'} h-10`}>
                {isMobileExpanded && <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm tracking-wider">DualMind AI</span>}
                
                {/* Desktop Collapse/Expand Chevron Button */}
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hidden lg:flex p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors hover:scale-125"
                    title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {isExpanded ? <FaArrowLeft/> : <FiMenu size={20}/> }
                </button>

                {/* Mobile Close Button (X) - Only shows up on smaller viewports */}
                <button 
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-2xl"
                >
                    <RiCloseFill  />
                </button>
            </div>

            {/* Navigation Icon Links */}
            <nav className="flex flex-col gap-3 w-full px-2">
                <NavLink to={'/'} onClick={handleNewChat} className="flex items-center gap-4 p-3 rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 transition-all w-full " title='New Chat'>
                    <span className="text-xl hover:scale-125 transition-transform duration-100 hover:rotate-180"><FiPlusCircle /></span>
                    {isMobileExpanded && <span className="font-medium text-sm animate-fade-in">New chat</span>}
                </NavLink>

                

                <NavLink to={'/history'} className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all w-full" title='Recent chats'>
                    <span className="text-xl hover:scale-125"><FiMessageCircle/></span>
                    {isMobileExpanded && <span className="font-medium text-sm">History</span>}
                </NavLink>
            </nav>
        </div>



        {/* BOTTOM SECTION: Theme Toggle & Sign In Module */}
        <div className="flex flex-col items-center lg:items-stretch gap-6 w-full px-2">
          {/* THEME TOGGLE (Included inside the drawer layout) */}
          <div className={`flex w-full items-center ${isMobileExpanded ? 'justify-between bg-zinc-50 dark:bg-zinc-900 p-2 rounded-xl border border-zinc-00 dark:border-zinc-800' : 'justify-center'}`}>
            {isMobileExpanded && <span className="text-xs font-sans font-bold pl-1 mb-1">Appearance</span>}
            <div className='border-r-2 dark:border-white/10 border-black/30 h-5'></div>
            <ThemeToggle />
          </div>

          <Login isMobileExpanded={isMobileExpanded} />
          {/* User Sign In Module */}

        </div>
      </aside>
    </>
  );
}

export default Drawer;