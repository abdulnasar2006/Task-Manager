import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Target, ListTodo, BrainCircuit, LineChart, Mail, Lock, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginScreen() {
  const { login, signup } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, displayName);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E5E5E7] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      
      {/* Subtle Dark Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-950/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-950/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto w-full text-center sm:text-left z-10">
        <div className="inline-flex items-center gap-3 select-none">
          <div className="w-8 h-8 bg-[#E5E5E7] rounded-sm flex items-center justify-center text-[#0A0A0B] font-bold text-lg">S</div>
          <span className="font-serif font-light italic text-xl tracking-tight text-[#E5E5E7]" style={{ fontFamily: "Georgia, serif" }}>SmartTasks</span>
        </div>
      </div>

      {/* Main Landing Block */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center z-10 py-8">
        
        {/* Left column - Intro Copy */}
        <div className="md:col-span-7 space-y-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light italic text-[#E5E5E7] leading-[1.1] tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              Work smarter, not <span className="text-[#8E8E93] font-normal underline decoration-[#242426] underline-offset-8">harder.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8E8E93] max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
              Elevate your productivity with an intuitive, seamless task management platform designed to help you focus on what truly matters.
            </p>
          </motion.div>

          {/* Core Feature List Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto md:mx-0"
          >
            <div className="flex gap-2.5 text-left">
              <span className="w-8 h-8 bg-[#111112] border border-[#242426] rounded-md flex items-center justify-center text-[#E5E5E7] shrink-0 select-none">
                <BrainCircuit className="w-4 h-4 pointer-events-none" />
              </span>
              <div>
                <h4 className="text-xs font-semibold text-[#E5E5E7] uppercase tracking-wider">Intelligent Organization</h4>
                <p className="text-[11px] text-[#8E8E93] leading-normal font-light">Categorize and prioritize your daily workflow automatically.</p>
              </div>
            </div>

            <div className="flex gap-2.5 text-left">
              <span className="w-8 h-8 bg-[#111112] border border-[#242426] rounded-md flex items-center justify-center text-[#E5E5E7] shrink-0 select-none">
                <Target className="w-4 h-4 pointer-events-none" />
              </span>
              <div>
                <h4 className="text-xs font-semibold text-[#E5E5E7] uppercase tracking-wider">Goal Tracking</h4>
                <p className="text-[11px] text-[#8E8E93] leading-normal font-light">Set deadlines and never lose sight of your primary objectives.</p>
              </div>
            </div>

            <div className="flex gap-2.5 text-left">
              <span className="w-8 h-8 bg-[#111112] border border-[#242426] rounded-md flex items-center justify-center text-[#E5E5E7] shrink-0 select-none">
                <ListTodo className="w-4 h-4 pointer-events-none" />
              </span>
              <div>
                <h4 className="text-xs font-semibold text-[#E5E5E7] uppercase tracking-wider">Seamless Management</h4>
                <p className="text-[11px] text-[#8E8E93] leading-normal font-light">Easily switch statuses from To-Do to Completed with one click.</p>
              </div>
            </div>

            <div className="flex gap-2.5 text-left">
              <span className="w-8 h-8 bg-[#111112] border border-[#242426] rounded-md flex items-center justify-center text-[#E5E5E7] shrink-0 select-none">
                <LineChart className="w-4 h-4 pointer-events-none" />
              </span>
              <div>
                <h4 className="text-xs font-semibold text-[#E5E5E7] uppercase tracking-wider">Analytics & Filters</h4>
                <p className="text-[11px] text-[#8E8E93] leading-normal font-light">Filter by priority, category, or status to view insights instantly.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right column - Clean Authentication Action Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-5 bg-[#111112] border border-[#242426] rounded-xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between"
        >
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-light italic text-[#E5E5E7]" style={{ fontFamily: "Georgia, serif" }}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-xs text-[#8E8E93] mt-1 font-light">
                {isLogin ? 'Sign in to access your workspace.' : 'Sign up to start tracking your tasks.'}
              </p>
            </div>

            {error && (
              <div className="bg-rose-950/30 border border-rose-900/30 text-rose-400 text-[11px] px-3.5 py-2.5 rounded-md font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {isLogin && (
                <div className="bg-[#1C1C1E] border border-[#242426] p-3 rounded-lg flex items-center justify-between mb-4">
                  <div className="text-left">
                    <p className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-0.5">Test Account</p>
                    <p className="text-xs text-[#E5E5E7]">test@smarttasks.com / password123</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { setEmail('test@smarttasks.com'); setPassword('password123'); }}
                    className="px-3 py-1.5 bg-[#242426] hover:bg-[#3A3A3C] font-medium text-[11px] text-[#E5E5E7] rounded transition-colors cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}
              
              {!isLogin && (
                <div>
                  <label className="block text-[11px] font-medium text-[#8E8E93] uppercase tracking-wider mb-1.5">
                    Display Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-[#636366]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-[#1C1C1E] border border-[#242426] rounded-lg pl-10 pr-3 py-2.5 text-sm text-[#E5E5E7] placeholder-[#636366] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-[#8E8E93] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[#636366]" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-[#242426] rounded-lg pl-10 pr-3 py-2.5 text-sm text-[#E5E5E7] placeholder-[#636366] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8E8E93] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#636366]" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-[#242426] rounded-lg pl-10 pr-3 py-2.5 text-sm text-[#E5E5E7] placeholder-[#636366] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 border border-[#242426] rounded-lg bg-[#E5E5E7] hover:bg-white text-[#0A0A0B] text-xs font-semibold shadow-sm active:scale-98 transition-all cursor-pointer mt-6"
              >
                {submitting ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-[11px] text-[#8E8E93] hover:text-[#E5E5E7] transition-colors bg-transparent border-none cursor-pointer"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto w-full text-center z-10 select-none">
        <p className="text-[11px] text-[#636366] font-medium">
          WORKSPACE: <span className="text-[#E5E5E7] uppercase tracking-widest ml-1">SmartTasks</span>
        </p>
      </div>
    </div>
  );
}
