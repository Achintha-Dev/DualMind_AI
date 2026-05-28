import { useState } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import Drawer from './components/Drawer';
import { FiMenu, FiCpu } from 'react-icons/fi'; // Added FiCpu for global styling alignment

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
 
  return (
    <div className="flex h-screen w-full bg-white text-black dark:bg-[#1a1a1a] dark:text-zinc-100 transition-colors duration-300 overflow-hidden">

      {/* Sidebar Drawer Panel */}
      <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />

      {/* Main Content Workspace Layout - Shift content right on desktop to account for the w-16 drawer */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative"> 
        
        {/* GLOBAL MOBILES HEADER BAR - Visible ONLY on screens smaller than 1024px (lg) */}
        <header className="px-4 py-3 flex items-center justify-between lg:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-sm transition-all cursor-pointer"
              title="Open menu"
            >
              <FiMenu size={16} /> 
            </button>
            
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
              <FiCpu size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-tight">Pipeline Workspace</h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">DualMind AI</p>
            </div>
          </div>
        </header>
        
        {/* Primary Page Router Node Outlet Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative scrollbar-none">
          <AppRoutes />
        </div>
        
      </div>
    </div>
  );
}

export default App;