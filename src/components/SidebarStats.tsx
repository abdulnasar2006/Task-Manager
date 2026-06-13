import { useApp } from '../context/AppContext';
import { CATEGORIES, TaskStatus, TaskPriority } from '../types';
import { Search, Hash, Star, LayoutGrid, Calendar, CheckSquare, Clock, Circle } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarStatsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarStats({ isOpen, onClose }: SidebarStatsProps) {
  const {
    tasks,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy
  } = useApp();

  // Metrics definitions
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const todoCount = tasks.filter(t => t.status === 'todo').length;

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Render priority counters
  const highPriorityCount = tasks.filter(t => t.priority === 'high').length;
  const mediumPriorityCount = tasks.filter(t => t.priority === 'medium').length;
  const lowPriorityCount = tasks.filter(t => t.priority === 'low').length;

  return (
    <aside 
      className={`fixed inset-y-0 left-0 w-80 bg-[#111112] border-r border-[#242426] p-6 z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 lg:w-80 shrink-0 overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col gap-6 md:mt-2">
        
        {/* Mobile Header: Hidden on Desktop */}
        <div className="flex items-center justify-between md:hidden pb-2 border-b border-[#242426]">
          <span className="font-semibold text-[#E5E5E7] text-sm font-serif italic" style={{ fontFamily: "Georgia, serif" }}>Filters & Analytics</span>
          <button 
            type="button"
            onClick={onClose}
            className="text-xs text-[#E5E5E7] font-semibold active:scale-95 px-2 py-1 rounded bg-[#1C1C1E] border border-[#242426]"
          >
            Close
          </button>
        </div>

        {/* Real-time Productivity Card */}
        <div className="bg-[#1C1C1E] rounded-lg p-5 border border-[#242426] shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#636366] font-semibold">PRODUCTIVITY</span>
            <span className="text-xs font-semibold text-[#E5E5E7] font-mono">{progressPercent}%</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3 select-none">
            <span className="text-3xl font-light text-[#E5E5E7] font-serif tracking-tight" style={{ fontFamily: "Georgia, serif" }}>{completedCount}</span>
            <span className="text-xs font-medium text-[#8E8E93]">/ {totalCount} tasks</span>
          </div>
          <div className="w-full h-1.5 bg-[#0A0A0B] rounded-sm overflow-hidden border border-[#242426]">
            <motion.div 
              className="h-full bg-[#E5E5E7] rounded-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#242426] text-center">
            <div>
              <span className="text-[10px] font-medium text-[#636366] block mb-0.5">Todo</span>
              <span className="text-xs font-bold text-[#8E8E93] font-mono">{todoCount}</span>
            </div>
            <div>
              <span className="text-[10px] font-medium text-[#636366] block mb-0.5 font-mono">Active</span>
              <span className="text-xs font-bold text-blue-400 font-mono">{inProgressCount}</span>
            </div>
            <div>
              <span className="text-[10px] font-medium text-[#636366] block mb-0.5">Done</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">{completedCount}</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#636366] font-semibold block">Search Tasks</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#636366] pointer-events-none" />
            <input 
              type="text" 
              placeholder="Filter by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-[#242426] focus:border-[#444446] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#E5E5E7] placeholder-[#636366] outline-none transition-all"
            />
          </div>
        </div>

        <hr className="border-[#242426]" />

        {/* Quick Sorting Toggle */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#636366] font-semibold block">Sort Order</label>
          <div className="grid grid-cols-3 gap-1 bg-[#0A0A0B] border border-[#242426] p-1 rounded-sm">
            {(['dueDate', 'createdAt', 'priority'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSortBy(option)}
                className={`py-1 rounded-sm text-[10px] font-medium transition-colors cursor-pointer ${
                  sortBy === option 
                    ? 'bg-[#1C1C1E] text-[#E5E5E7] border border-[#242426] shadow-md font-semibold' 
                    : 'text-[#8E8E93] hover:text-[#E5E5E7] hover:bg-[#111112]'
                }`}
              >
                {option === 'dueDate' ? 'Due Date' : option === 'createdAt' ? 'Created' : 'Priority'}
              </button>
            ))}
          </div>
        </div>

        {/* Filter by Status */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#636366] font-semibold block">Overview</label>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left text-xs font-medium transition-all ${
                statusFilter === 'all' 
                  ? 'bg-[#1C1C1E] text-[#E5E5E7] font-semibold border border-[#242426]' 
                  : 'text-[#8E8E93] hover:text-[#E5E5E7] hover:bg-[#1C1C1E]/30'
              }`}
            >
              <span className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 opacity-70" />
                All Tasks
              </span>
              <span className="bg-[#0A0A0B] border border-[#242426] text-[#8E8E93] px-1.5 py-0.5 rounded text-[10px] tabular-nums font-mono">{totalCount}</span>
            </button>
            
            <button
              onClick={() => setStatusFilter('todo')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left text-xs font-medium transition-all ${
                statusFilter === 'todo' 
                  ? 'bg-[#1C1C1E] text-[#E5E5E7] font-semibold border border-[#242426]' 
                  : 'text-[#8E8E93] hover:text-[#E5E5E7] hover:bg-[#1C1C1E]/30'
              }`}
            >
              <span className="flex items-center gap-3">
                <Circle className="w-4 h-4 opacity-70" />
                To Do Pending
              </span>
              <span className="bg-[#0A0A0B] border border-[#242426] text-[#8E8E93] px-1.5 py-0.5 rounded text-[10px] tabular-nums font-mono">{todoCount}</span>
            </button>

            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left text-xs font-medium transition-all ${
                statusFilter === 'in_progress' 
                  ? 'bg-[#1C1C1E] text-[#E5E5E7] font-semibold border border-[#242426]' 
                  : 'text-[#8E8E93] hover:text-[#E5E5E7] hover:bg-[#1C1C1E]/30'
              }`}
            >
              <span className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-400 opacity-70" />
                In Progress
              </span>
              <span className="bg-[#0A0A0B] border border-[#242426] text-[#8E8E93] px-1.5 py-0.5 rounded text-[10px] tabular-nums font-mono">{inProgressCount}</span>
            </button>

            <button
              onClick={() => setStatusFilter('completed')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left text-xs font-medium transition-all ${
                statusFilter === 'completed' 
                  ? 'bg-[#1C1C1E] text-[#E5E5E7] font-semibold border border-[#242426]' 
                  : 'text-[#8E8E93] hover:text-[#E5E5E7] hover:bg-[#1C1C1E]/30'
              }`}
            >
              <span className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4 text-emerald-400 opacity-70" />
                Complete
              </span>
              <span className="bg-[#0A0A0B] border border-[#242426] text-[#8E8E93] px-1.5 py-0.5 rounded text-[10px] tabular-nums font-mono">{completedCount}</span>
            </button>
          </div>
        </div>

        {/* Filter by Priority */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#636366] font-semibold block">Priorities</label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setPriorityFilter('all')}
              className={`px-3 py-1 rounded-md text-[10px] font-medium border transition-colors ${
                priorityFilter === 'all' 
                  ? 'bg-[#E5E5E7] text-[#0A0A0B] border-[#E5E5E7] font-semibold' 
                  : 'bg-[#0A0A0B] text-[#8E8E93] border-[#242426] hover:text-[#E5E5E7]'
              }`}
            >
              All [{totalCount}]
            </button>
            <button
              onClick={() => setPriorityFilter('high')}
              className={`px-3 py-1 rounded-md text-[10px] font-medium border transition-colors ${
                priorityFilter === 'high' 
                  ? 'bg-rose-950/30 text-rose-450 border-rose-800/30 font-semibold' 
                  : 'bg-[#0A0A0B] text-rose-450/70 border-[#242426] hover:text-rose-400'
              }`}
            >
              High [{highPriorityCount}]
            </button>
            <button
              onClick={() => setPriorityFilter('medium')}
              className={`px-3 py-1 rounded-md text-[10px] font-medium border transition-colors ${
                priorityFilter === 'medium' 
                  ? 'bg-amber-950/30 text-amber-400 border-amber-800/30 font-semibold' 
                  : 'bg-[#0A0A0B] text-amber-400/70 border-[#242426] hover:text-amber-400'
              }`}
            >
              Mid [{mediumPriorityCount}]
            </button>
            <button
              onClick={() => setPriorityFilter('low')}
              className={`px-3 py-1 rounded-md text-[10px] font-medium border transition-colors ${
                priorityFilter === 'low' 
                  ? 'bg-emerald-950/30 text-emerald-450 border-[#242426] font-semibold' 
                  : 'bg-[#0A0A0B] text-[#636366] border-[#242426] hover:text-[#8E8E93]'
              }`}
            >
              Low [{lowPriorityCount}]
            </button>
          </div>
        </div>

        {/* Filter by Category */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#636366] font-semibold block">Projects & Categories</label>
          <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto pr-1">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-left text-xs font-semibold tracking-wide transition-all ${
                categoryFilter === 'all' 
                  ? 'bg-[#1C1C1E] text-[#E5E5E7] border border-[#242426]' 
                  : 'text-[#8E8E93] hover:text-[#E5E5E7] hover:bg-[#1C1C1E]/30'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                All Categories
              </span>
            </button>

            {CATEGORIES.map((category) => {
              const categoryTasksSum = tasks.filter(t => t.category === category).length;
              // Custom color markers corresponding to different category names
              const colorDotMap: Record<string, string> = {
                Work: 'bg-orange-400',
                Personal: 'bg-emerald-400',
                Health: 'bg-rose-400',
                Finance: 'bg-blue-400',
                Shopping: 'bg-amber-400',
                Education: 'bg-[#9b5de5]',
                Other: 'bg-[#a3b18a]'
              };
              const dotColorClass = colorDotMap[category] || 'bg-slate-400';

              return (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-left text-xs font-medium transition-all ${
                    categoryFilter === category 
                      ? 'bg-[#1C1C1E] text-[#E5E5E7] border border-[#242426] font-semibold' 
                      : 'text-[#8E8E93] hover:text-[#E5E5E7] hover:bg-[#1C1C1E]/30'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColorClass}`}></span>
                    {category}
                  </span>
                  {categoryTasksSum > 0 && (
                    <span className="bg-[#0A0A0B] border border-[#242426] text-[#8E8E93] text-[9px] font-semibold font-mono px-1.5 py-0.5 rounded">{categoryTasksSum}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
}
