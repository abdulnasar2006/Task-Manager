import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import SidebarStats from './components/SidebarStats';
import TaskCard from './components/TaskCard';
import TaskFormModal from './components/TaskFormModal';
import LoginScreen from './components/LoginScreen';
import { Task, TaskStatus, TaskPriority } from './types';
import { Plus, ClipboardList, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const {
    user,
    loading,
    tasks,
    createTask,
    updateTask,
    deleteTask,
    searchQuery,
    statusFilter,
    priorityFilter,
    categoryFilter,
    sortBy
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeEditTask, setActiveEditTask] = useState<Task | null>(null);
  const [showSandboxBanner, setShowSandboxBanner] = useState(true);

  // Filter & Sort Logic
  const filteredTasks = tasks.filter((task) => {
    // 1. Keyword search title / desc
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Status filter
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

    // 3. Priority filter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    // 4. Category filter
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    if (sortBy === 'priority') {
      const weight = { high: 3, medium: 2, low: 1 };
      const weightA = weight[a.priority as TaskPriority] || 0;
      const weightB = weight[b.priority as TaskPriority] || 0;
      return weightB - weightA;
    }

    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    return 0;
  });

  const handleCreateOrUpdateTask = async (taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    category: string;
    dueDate: string;
  }) => {
    if (activeEditTask) {
      await updateTask(activeEditTask.id, taskData);
    } else {
      await createTask(taskData);
    }
    handleCloseModal();
  };

  const handleToggleTaskStatus = async (id: string, currentStatus: TaskStatus) => {
    const nextStatusMap: Record<TaskStatus, TaskStatus> = {
      todo: 'in_progress',
      in_progress: 'completed',
      completed: 'todo'
    };
    await updateTask(id, { status: nextStatusMap[currentStatus] });
  };

  const handleEditClick = (task: Task) => {
    setActiveEditTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveEditTask(null);
  };

  const handleTriggerNewTask = () => {
    setActiveEditTask(null);
    setIsModalOpen(true);
  };

  // Loading skeleton screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        <div className="space-y-5 text-center max-w-xs w-full">
          <div className="inline-block relative">
            <div className="w-12 h-12 border-2 border-[#242426] border-t-[#E5E5E7] rounded-full animate-spin"></div>
            <div className="w-3.5 h-3.5 bg-[#E5E5E7] rounded-sm absolute inset-0 m-auto"></div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#E5E5E7] uppercase tracking-widest font-mono">Initializing Workspace</p>
            <p className="text-[10px] text-[#8E8E93] mt-0.5 font-light">Contacting system directories...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not Authenticated
  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E5E5E7] flex flex-col font-sans" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      
      {/* Navigation Header */}
      <Navbar 
        onOpenNewTask={handleTriggerNewTask} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* Main Content Layout Wrapper */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex min-h-0 relative">
        
        {/* Sidebar Filters & Statistics */}
        <SidebarStats 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Backdrop for mobile sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Task Dashboard Center */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          <div className="space-y-6">
            
            {/* Ambient Offline Notification Banner */}
            {user.isLocalOnly && showSandboxBanner && (
              <motion.div 
                layout
                className="bg-[#111112] border border-[#242426] rounded-xl p-4 flex gap-3 text-left relative overflow-hidden shadow-2xl"
              >
                <div className="w-9 h-9 rounded-md bg-[#1C1C1E] border border-[#242426] flex items-center justify-center text-[#E5E5E7] shrink-0 select-none">
                  <Info className="w-4 h-4 text-blue-400" />
                </div>
                <div className="space-y-1.5 pr-8">
                  <h4 className="text-xs font-semibold text-[#E5E5E7] uppercase tracking-wider">Local Sandbox Mode</h4>
                  <p className="text-[11px] text-[#8E8E93] leading-relaxed font-light">
                    You are logged in under a guest session. Your connected tasks are currently backed up offline in browser storage. Setup standard Cloud Sync via Firebase configurations to share real-time syncing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSandboxBanner(false)}
                  className="absolute top-2.5 right-2.5 p-1.5 text-[#636366] hover:text-[#E5E5E7] hover:bg-[#1C1C1E] rounded-md cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}

            {/* Dashboard Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-light italic text-[#E5E5E7] tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Today's Focus</h2>
                <p className="text-xs text-[#8E8E93] mt-1 font-light">
                  {statusFilter === 'all' ? 'All Active' : `${statusFilter.toUpperCase()} `} tasks matching criteria ({sortedTasks.length} visible)
                </p>
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-1.5 self-start">
                <button
                  type="button"
                  onClick={handleTriggerNewTask}
                  className="sm:hidden bg-[#E5E5E7] hover:bg-white text-[#0A0A0B] font-semibold text-xs px-4 py-2 rounded-full cursor-pointer transition-all"
                >
                  Add Task
                </button>
              </div>
            </div>

            {/* Task Grid Rendering */}
            <AnimatePresence mode="popLayoutContainer">
              {sortedTasks.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {sortedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditClick}
                      onDelete={deleteTask}
                      onToggleStatus={handleToggleTaskStatus}
                    />
                  ))}
                </motion.div>
              ) : (
                // Empty State Cards
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#111112] border border-[#242426] rounded-xl p-8 text-center max-w-md mx-auto my-8 space-y-5 shadow-2xl"
                >
                  <div className="w-14 h-14 rounded-full bg-[#1C1C1E] border border-[#242426] flex items-center justify-center text-[#8E8E93] mx-auto select-none shadow-sm">
                    <ClipboardList className="w-6 h-6 border-[#242426]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-light italic text-[#E5E5E7]" style={{ fontFamily: "Georgia, serif" }}>Workspace is all clear</h3>
                    <p className="text-xs text-[#8E8E93] max-w-xs mx-auto leading-relaxed font-light">
                      No active tasks match your search or filter configuration. Change filters or initiate a new task structure.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTriggerNewTask}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-[#E5E5E7] hover:bg-white font-semibold text-xs text-[#0A0A0B] rounded-full transition-all cursor-pointer mx-auto"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5px]" />
                    <span>Create a Task</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>

      {/* Task Creation Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdateTask}
        task={activeEditTask}
      />

    </div>
  );
}

// Global App entry injecting Provider
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
