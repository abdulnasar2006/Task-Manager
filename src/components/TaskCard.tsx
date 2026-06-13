import { Task, PRIORITY_COLORS, STATUS_COLORS } from '../types';
import { Calendar, Trash2, Edit3, CheckCircle2, Circle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface TaskCardProps {
  key?: string | number;
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: Task['status']) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const priorityStyle = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.low;
  const statusStyle = STATUS_COLORS[task.status] || STATUS_COLORS.todo;

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (task.status === 'completed' || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  return (
    <motion.div
      layout
      id={`task-card-${task.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`bg-[#111112] border ${
        task.status === 'completed' ? 'border-[#242426] opacity-70' : 'border-[#242426] shadow-2xl'
      } p-5 flex flex-col justify-between transition-all group rounded-lg`}
    >
      <div>
        
        {/* Top bar: Category and Priority */}
        <div className="flex items-center justify-between gap-1.5 mb-4">
          <span className="text-[10px] font-semibold text-[#8E8E93] bg-[#1C1C1E] border border-[#242426] px-2 py-0.5 rounded uppercase tracking-wider">
            {task.category || 'Other'}
          </span>
          
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}>
            {task.priority} Priority
          </span>
        </div>

        {/* Title & Checkbox */}
        <div className="flex gap-3 items-start">
          <button
            type="button"
            onClick={() => onToggleStatus(task.id, task.status)}
            className="mt-0.5 cursor-pointer transition-transform hover:scale-105 shrink-0"
            title={task.status === 'completed' ? "Mark incomplete" : "Mark completed"}
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : task.status === 'in_progress' ? (
              <Clock className="w-5 h-5 text-blue-400" />
            ) : (
              <Circle className="w-5 h-5 text-[#636366] hover:text-[#E5E5E7]" />
            )}
          </button>
          
          <div className="space-y-1.5 flex-1 min-w-0">
            <h3 className={`font-semibold text-sm leading-snug break-words ${
              task.status === 'completed' ? 'line-through text-zinc-500' : 'text-zinc-100'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-xs leading-relaxed whitespace-pre-wrap font-light line-clamp-3 ${
                task.status === 'completed' ? 'text-zinc-600' : 'text-zinc-400'
              }`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Card bottom section */}
      <div className="mt-5 pt-4 border-t border-[#242426] flex items-center justify-between">
        
        {/* Due Date Block */}
        <div className={`flex items-center gap-1.5 select-none ${
          isOverdue() ? 'text-rose-400 font-medium' : 'text-zinc-500'
        }`}>
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium font-mono">
            {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
            {isOverdue() && ' (Overdue)'}
          </span>
        </div>

        {/* Hover actions panel */}
        <div className="flex items-center gap-1 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="p-1 px-1.5 text-[#636366] hover:text-[#E5E5E7] hover:bg-[#1C1C1E] rounded-md transition-colors cursor-pointer border border-transparent hover:border-[#242426]"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            title="Delete Task"
            className="p-1 px-1.5 text-[#636366] hover:text-rose-400 hover:bg-rose-950/20 rounded-md transition-colors cursor-pointer border border-transparent hover:border-rose-900/30"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
