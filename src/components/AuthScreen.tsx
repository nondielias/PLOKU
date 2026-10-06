import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Cpu,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { UserAccount } from '../types';
import { signIn, signUp, ADMIN_USER_ID } from '../services/auth-service';
import { ThemeToggle } from './ThemeToggle';

interface AuthScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
  onExploreStore: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onExploreStore,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign up form state (email & password only)
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      const result = await signIn(loginEmail, loginPassword);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
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
    setLoginEmail(ADMIN_USER_ID);
    setLoginPassword(ADMIN_USER_ID);
    setLoginError(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-rose-500/20 selection:text-rose-700 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200 transition-colors">
      {/* Auth Screen Top Bar */}
      <header className="w-full border-b border-rose-100 dark:border-slate-800/80 bg-white/95 dark:bg-[#090d16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 to-red-700 dark:from-cyan-500 dark:to-blue-600 flex items-center justify-center text-white dark:text-slate-950 shadow-sm shadow-rose-600/20 dark:shadow-cyan-500/20">
              <Cpu className="w-4 h-4 text-white dark:text-slate-950" />
            </div>
            <span className="text-xl font-bold tracking-wider text-slate-950 dark:text-white font-heading">
              PLOKU
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <button
              onClick={onExploreStore}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 dark:text-slate-300 dark:hover:text-white dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
              <span>Browse Store as Guest</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Centered Auth Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-[#0a0f1d] border border-rose-200/80 dark:border-slate-800 rounded-2xl shadow-xl shadow-rose-900/5 dark:shadow-2xl overflow-hidden animate-fadeIn">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-rose-100 dark:border-slate-800/80 bg-rose-50/50 dark:bg-slate-900/40 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-cyan-500/10 border border-rose-200 dark:border-cyan-500/20 text-rose-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-rose-600 dark:text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white font-heading">
              {activeTab === 'login' ? 'Sign In to PLOKU' : 'Create an Account'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Firebase Authentication
            </p>
          </div>

          {/* Form Tabs */}
          <div className="p-6">
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium mb-6">
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

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="user@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
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
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Quick-fill helper for Admin */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-xs">
                  <button
                    type="button"
                    onClick={handleFillAdminCredentials}
                    className="w-full p-2 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:hover:border-cyan-500/50 flex items-center justify-between text-[11px] text-rose-700 dark:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
                      <span>Admin Quick Access:</span>
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

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
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
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
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
                  Firebase Authentication is used to secure your account.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="py-4 text-center text-xs text-slate-500 dark:text-slate-600 border-t border-rose-100 dark:border-slate-800/40">
        PLOKU Electronic Gadget Store · Powered by Firebase Authentication
      </footer>
    </div>
  );
};
