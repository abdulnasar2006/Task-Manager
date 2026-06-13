export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  category: string;
  ownerId: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isLocalOnly: boolean;
}

export const CATEGORIES = [
  'Work',
  'Personal',
  'Health',
  'Finance',
  'Shopping',
  'Education',
  'Other'
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed'
};

export const PRIORITY_COLORS: Record<TaskPriority, { bg: string; text: string; border: string }> = {
  low: { bg: 'bg-[#1C1C1E]', text: 'text-[#8E8E93]', border: 'border-[#242426]' },
  medium: { bg: 'bg-amber-950/30', text: 'text-amber-400', border: 'border-amber-800/30' },
  high: { bg: 'bg-rose-950/30', text: 'text-rose-400', border: 'border-rose-800/30' }
};

export const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string; dot: string; border: string }> = {
  todo: { bg: 'bg-[#111112]', text: 'text-[#8E8E93]', dot: 'bg-[#636366]', border: 'border-[#242426]' },
  in_progress: { bg: 'bg-blue-900/30', text: 'text-blue-450', dot: 'bg-blue-500', border: 'border-blue-800/30' },
  completed: { bg: 'bg-emerald-900/30', text: 'text-emerald-450', dot: 'bg-emerald-500', border: 'border-emerald-800/30' }
};
