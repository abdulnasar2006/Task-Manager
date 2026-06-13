import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, UserSession } from '../types';

interface AppContextType {
  user: UserSession | null;
  loading: boolean;
  isFirebaseActive: boolean;
  tasks: Task[];
  createTask: (taskData: Omit<Task, 'id' | 'ownerId' | 'ownerEmail' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  
  // Filtering and searching states
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: TaskStatus | 'all';
  setStatusFilter: (status: TaskStatus | 'all') => void;
  priorityFilter: TaskPriority | 'all';
  setPriorityFilter: (priority: TaskPriority | 'all') => void;
  categoryFilter: string | 'all';
  setCategoryFilter: (category: string | 'all') => void;
  sortBy: 'dueDate' | 'createdAt' | 'priority';
  setSortBy: (sort: 'dueDate' | 'createdAt' | 'priority') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:4000/api';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'createdAt' | 'priority'>('dueDate');

  // Helper to get auth headers
  const getHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Load user session from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('task_manager_user');
    const storedToken = localStorage.getItem('task_manager_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  // Fetch tasks when user/token changes
  useEffect(() => {
    if (!user || !token) {
      setTasks([]);
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          headers: getHeaders()
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else if (response.status === 401) {
          // Token expired or invalid
          signOut();
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, [user, token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('task_manager_user', JSON.stringify(data.user));
      localStorage.setItem('task_manager_token', data.token);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('task_manager_user', JSON.stringify(data.user));
      localStorage.setItem('task_manager_token', data.token);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('task_manager_user');
    localStorage.removeItem('task_manager_token');
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'ownerId' | 'ownerEmail' | 'createdAt' | 'updatedAt'>) => {
    if (!user || !token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(taskData)
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [newTask, ...prev]);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user || !token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user || !token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (response.ok) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      loading,
      isFirebaseActive: false,
      tasks,
      createTask,
      updateTask,
      deleteTask,
      login,
      signup,
      signOut,
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
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
