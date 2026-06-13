import { useApp } from '../context/AppContext';
import { LogOut, Cloud, CloudOff, CheckSquare, Plus, Menu } from 'lucide-react';

interface NavbarProps {
  onOpenNewTask: () => void;
  toggleSidebar: () => void;
}

export default function Navbar({ onOpenNewTask, toggleSidebar }: NavbarProps) {
  const { user, signOut, isFirebaseActive } = useApp();

  if (!user) return null;

  return (
    <header className="border-b border-[#242426] bg-[#0A0A0B] sticky top-0 z-40 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Side: Brand and Sidebar trigger for Mobile */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={toggleSidebar}
            className="md:hidden p-2 text-[#8E8E93] hover:text-[#E5E5E7] bg-[#111112] hover:bg-[#1C1C1E] border border-[#242426] rounded-md transition-colors"
            aria-label="Toggle Filters"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E5E5E7] rounded-sm flex items-center justify-center text-[#0A0A0B] font-bold text-lg select-none">S</div>
            <div>
              <h1 className="font-serif font-light italic text-[#E5E5E7] text-base md:text-lg leading-none" style={{ fontFamily: "Georgia, serif" }}>
                SmartTasks
              </h1>
              <span className="text-[9px] uppercase tracking-widest text-[#636366] font-semibold mt-1 block">
                Focus Workspace
              </span>
            </div>
          </div>
        </div>

        {/* Action Button & Session Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Create Task Quick Button */}
          <button
            type="button"
            onClick={onOpenNewTask}
            className="bg-[#E5E5E7] hover:bg-white text-[#0A0A0B] font-semibold text-xs sm:text-sm px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5px]" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Connection Status indicator */}
          <div className="flex items-center gap-1.5 bg-[#111112] border border-[#242426] px-2.5 py-1.5 rounded-lg cursor-default text-[10px] sm:text-xs font-semibold text-[#8E8E93] pointer-events-none">
            {isFirebaseActive && !user.isLocalOnly ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-blue-405 hidden xs:inline uppercase tracking-widest text-[9px]">Cloud Sync</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-[#636366]" />
                <span className="text-[#636366] hidden xs:inline uppercase tracking-widest text-[9px]">Offline</span>
              </>
            )}
          </div>

          <div className="h-6 w-px bg-[#242426]"></div>

          {/* User Profile Card */}
          <div className="flex items-center gap-2.5">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || "Avatar"} 
                className="w-8 h-8 rounded-full border border-[#242426]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1C1C1E] flex items-center justify-center font-bold text-xs text-[#E5E5E7] border border-[#242426]" style={{ fontFamily: "Georgia, serif" }}>
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-[#E5E5E7] leading-none">
                {user.displayName || 'Arthur Sterling'}
              </p>
              <p className="text-[10px] text-[#8E8E93] truncate max-w-[120px] mt-0.5">
                {user.email || 'guest@smarttasks.local'}
              </p>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={signOut}
              title="Sign Out"
              className="p-2 text-[#636366] hover:text-[#E5E5E7] hover:bg-[#1C1C1E] rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
