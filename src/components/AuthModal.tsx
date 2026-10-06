import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  LogOut,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { UserAccount } from '../types';
import { signIn, signUp, ADMIN_USER_ID } from '../services/auth-service';
import { ThemeToggle } from './ThemeToggle';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  onLogout: () => void;
  onOpenAdminDashboard: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onOpenAdminDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state (email & password only, no profile data)
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      const result = await signIn(loginIdentifier, loginPassword);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
        onClose();
      } else {
        // Requirement: If credentials are incorrect, show: "Email or password is incorrect"
        setLoginError(result.error || 'Email or password is incorrect');
      }
    } catch {
      setLoginError('Email or password is incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setIsLoading(true);

    try {
      const result = await signUp(regEmail, regPassword);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
        onClose();
      } else {
        // Requirement: If the email already exists, show: "User already exists. Please sign in"
        setRegError(result.error || 'Registration failed');
      }
    } catch {
      setRegError('Registration failed. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillAdminCredentials = () => {
    setLoginIdentifier(ADMIN_USER_ID);
    setLoginPassword(ADMIN_USER_ID);
    setLoginError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#0a0f1d] border border-rose-200/80 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-rose-100 dark:border-slate-800/80 flex items-center justify-between bg-rose-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-cyan-500/20 text-rose-600 dark:text-cyan-400 border border-rose-200 dark:border-cyan-500/30 flex items-center justify-center">
              {currentUser?.role === 'admin' ? (
                <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-cyan-400" />
              ) : (
                <User className="w-4 h-4 text-rose-600 dark:text-cyan-400" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white font-heading">
                {currentUser ? 'User Account' : activeTab === 'login' ? 'Account Login' : 'Create PLOKU Account'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {currentUser
                  ? currentUser.role === 'admin'
                    ? 'Administrator Privileges Active'
                    : 'Customer Profile'
                  : 'Firebase Authentication'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[80vh]">
          {/* STATE 1: ALREADY LOGGED IN */}
          {currentUser ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-rose-50/40 dark:bg-slate-900/80 border border-rose-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-slate-950 dark:text-white font-heading">
                      {currentUser.name || currentUser.email}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{currentUser.email}</p>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                      currentUser.role === 'admin'
                        ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-700/60'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60'
                    }`}
                  >
                    {currentUser.role === 'admin' ? 'Store Admin' : 'Client'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminDashboard();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 dark:shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Open Admin Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-rose-400 dark:hover:text-rose-300 dark:border-slate-800 flex items-center justify-center gap-2 text-xs font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          ) : (
            /* STATE 2: NOT LOGGED IN - SHOW TABS (LOGIN & REGISTER) */
            <div className="space-y-5">
              {/* Tabs Switcher */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium">
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setLoginError(null);
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-rose-600 text-white font-semibold shadow-sm dark:bg-cyan-500 dark:text-slate-950'
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveTab('register');
                    setRegError(null);
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-rose-600 text-white font-semibold shadow-sm dark:bg-cyan-500 dark:text-slate-950'
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* TAB 1: SIGN IN */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {loginError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-800/80 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="user@example.com"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Quick-fill helper for Admin */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-xs">
                    <button
                      type="button"
                      onClick={handleFillAdminCredentials}
                      className="w-full p-1.5 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:hover:border-cyan-500/50 flex items-center justify-between text-[11px] text-rose-700 dark:text-cyan-300 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
                        <span>Admin Access:</span>
                      </span>
                      <code className="text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                        g0rDnAnu...
                      </code>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 disabled:opacity-60 font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 dark:shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: SIGN UP */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {regError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-800/80 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="newuser@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 disabled:opacity-60 font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 dark:shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Sign Up</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    Signing up authenticates your account directly via Firebase Authentication.
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
