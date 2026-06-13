import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, CATEGORIES } from '../types';
import { X, Calendar, Edit3, PlusCircle, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    category: string;
    dueDate: string;
  }) => Promise<void>;
  task?: Task | null; // If present, we are in Edit mode
}

export default function TaskFormModal({ isOpen, onClose, onSubmit, task }: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync inputs with task prop for editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      setCategory(task.category || 'Work');
      setDueDate(task.dueDate || '');
    } else {
      // Clear for new task mode
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setCategory('Work');
      
      // Default due date to tomorrow or today
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        category,
        dueDate
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        
        {/* Modal Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0A0A0B]/85 backdrop-blur-xs"
        />

        {/* Modal Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-[#111112] border border-[#242426] shadow-2xl max-w-lg w-full overflow-hidden z-10 relative flex flex-col rounded-lg"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#242426] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded bg-[#1C1C1E] border border-[#242426] flex items-center justify-center text-[#E5E5E7]">
                {task ? <Edit3 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              </span>
              <h2 className="text-base font-light italic text-[#E5E5E7] tracking-tight font-serif" style={{ fontFamily: "Georgia, serif" }}>
                {task ? 'Edit Workspace Task' : 'Create New Focus'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#636366] hover:text-[#E5E5E7] hover:bg-[#1C1C1E] rounded-md transition-colors cursor-pointer border border-transparent hover:border-[#242426]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(100vh-180px)] space-y-4">
            
            {error && (
              <div className="bg-rose-950/30 text-rose-400 text-xs px-4 py-3 rounded-md font-medium border border-rose-900/30">
                {error}
              </div>
            )}

            {/* Task Title */}
            <div className="space-y-1.5">
              <label htmlFor="task-title" className="text-[10px] uppercase tracking-[0.2em] text-[#636366] font-semibold block">Task Title</label>
              <input
                id="task-title"
                type="text"
                placeholder="Complete structural architecture flow..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                maxLength={150}
                required
                className="w-full bg-[#0A0A0B] border border-[#242426] focus:border-[#444446] rounded-md px-4 py-2.5 text-sm text-[#E5E5E7] placeholder-[#636366] outline-none transition-all font-light"
              />
            </div>

            {/* Task Description */}
            <div className="space-y-1.5">
              <label htmlFor="task-desc" className="text-[10px] uppercase tracking-[0.2em] text-[#636366] font-semibold block">Description / Notes</label>
              <textarea
                id="task-desc"
                placeholder="Add checklist details or workflow context here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={3}
                className="w-full bg-[#0A0A0B] border border-[#242426] focus:border-[#444446] rounded-md px-4 py-2.5 text-sm text-[#E5E5E7] placeholder-[#636366] outline-none transition-all font-light"
              />
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Category selector */}
              <div className="space-y-1.5">
                <label htmlFor="task-cat" className="text-[10px] uppercase tracking-[0.2em] text-[#636366] font-semibold block">Category</label>
                <select
                  id="task-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0A0A0B] text-[#E5E5E7] border border-[#242426] focus:border-[#444446] rounded-md px-3 py-2.5 text-sm outline-none transition-all cursor-pointer font-light"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-[#111112] text-[#E5E5E7]">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <label htmlFor="task-due" className="text-[10px] uppercase tracking-[0.2em] text-[#636366] font-semibold block">Due Date</label>
                <div className="relative">
                  <input
                    id="task-due"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#0A0A0B] text-[#E5E5E7] border border-[#242426] focus:border-[#444446] rounded-md px-3 py-2.5 text-sm outline-none transition-all cursor-pointer font-light"
                  />
                </div>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">
              
              {/* Priority */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#636366] font-semibold block">Priority</label>
                <div className="flex gap-1.5 bg-[#0A0A0B] p-1 rounded-sm border border-[#242426]">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1 rounded text-[10px] font-semibold capitalize transition-all cursor-pointer ${
                        priority === p
                          ? p === 'high' ? 'bg-rose-950/35 text-rose-400 border border-rose-900/30 shadow-md'
                            : p === 'medium' ? 'bg-amber-950/35 text-amber-400 border border-amber-900/30 shadow-md'
                            : 'bg-[#1C1C1E] text-[#E5E5E7] border border-[#242426] shadow-md'
                          : 'text-[#636366] hover:text-[#8E8E93]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#636366] font-semibold block">Status</label>
                <div className="flex gap-1.5 bg-[#0A0A0B] p-1 rounded-sm border border-[#242426]">
                  {(['todo', 'in_progress', 'completed'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex-1 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                        status === s
                          ? s === 'completed' ? 'bg-emerald-950/35 text-emerald-400 border border-emerald-900/30 shadow-md'
                            : s === 'in_progress' ? 'bg-blue-950/35 text-blue-400 border border-blue-900/30 shadow-md'
                            : 'bg-[#1C1C1E] text-[#8E8E93] border border-[#242426] shadow-md'
                          : 'text-[#636366] hover:text-[#8E8E93]'
                      }`}
                    >
                      {s === 'todo' ? 'Todo' : s === 'in_progress' ? 'Active' : 'Done'}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Save Buttons */}
            <div className="pt-4 flex gap-3 border-t border-[#242426]">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-full text-[#E5E5E7] bg-[#1C1C1E] border border-[#242426] hover:bg-[#2C2C2E] font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-full text-[#0A0A0B] bg-[#E5E5E7] hover:bg-white font-semibold text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {submitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-[#111112]/30 border-t-[#111112] rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>{task ? 'Update Focus' : 'Initiate Focus'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>

      </div>
    </AnimatePresence>
  );
}
