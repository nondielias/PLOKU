import React from 'react';
import { ShoppingBag, ShieldCheck, User, Search, Cpu } from 'lucide-react';
import { UserAccount } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onOpenDashboard?: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  currentUser,
  onOpenAuth,
  onOpenDashboard,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const navCategories = ['All', 'Audio', 'Wearables', 'Workstation', 'Power & Docks'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#090d16]/90 backdrop-blur-md border-b border-rose-100 dark:border-slate-800/80 transition-colors shadow-xs dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-xl font-bold tracking-wider text-slate-950 dark:text-white font-heading group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 to-red-700 dark:from-cyan-500 dark:to-blue-600 flex items-center justify-center text-white dark:text-slate-950 shadow-sm shadow-rose-600/20 dark:shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4 text-white dark:text-slate-950" />
            </div>
            <span className="text-slate-950 dark:text-white">PLOKU</span>
          </a>
        </div>

        {/* Zone 2: Navigation Links (single line, subtle hover) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          {navCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`whitespace-nowrap transition-colors relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-rose-600 dark:text-cyan-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {cat}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 dark:bg-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Search, Theme Toggle, Login / Account & Shopping Bag */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Live Search Input */}
          <div className="relative hidden sm:block w-36 md:w-44 lg:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search gadgets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/90 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-500/80 dark:focus:border-cyan-500/80 focus:ring-1 focus:ring-rose-500/30 dark:focus:ring-cyan-500/40 transition-all"
            />
          </div>

          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          {/* Login / Registration / User Account Trigger */}
          <button
            onClick={() => {
              if (currentUser && onOpenDashboard) {
                onOpenDashboard();
              } else {
                onOpenAuth();
              }
            }}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap border cursor-pointer ${
              currentUser?.role === 'admin'
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-700/60 dark:hover:bg-cyan-900/60'
                : currentUser
                ? 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:text-white dark:hover:bg-slate-800'
                : 'bg-white hover:bg-rose-50/80 text-slate-700 hover:text-rose-700 border-slate-200 hover:border-rose-200 dark:bg-slate-900/90 dark:text-slate-300 dark:border-slate-800 dark:hover:text-white dark:hover:bg-slate-800 dark:hover:border-slate-700'
            }`}
            aria-label={currentUser ? 'View Dashboard / Account' : 'Login / Register'}
          >
            {currentUser?.role === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
                <span className="hidden sm:inline">Admin Dashboard</span>
              </>
            ) : currentUser ? (
              <>
                <User className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
                <span className="hidden sm:inline max-w-[90px] truncate">Dashboard ({(currentUser.name || currentUser.email).split(' ')[0]})</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Login</span>
              </>
            )}
          </button>

          {/* Shopping Bag Trigger */}
          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-2 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 flex items-center gap-2 transition-all shadow-md shadow-rose-600/20 dark:shadow-cyan-500/20 active:scale-95 cursor-pointer"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline font-semibold">Bag</span>
            <span className="font-mono-numbers px-1.5 py-0.2 text-[11px] font-bold bg-white text-rose-700 dark:bg-slate-950 dark:text-cyan-400 rounded-full min-w-5 text-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="sm:hidden px-4 pb-3 pt-1 border-t border-rose-100 dark:border-slate-800/40 bg-white dark:bg-[#090d16]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search gadgets, specs, audio..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-500/80 dark:focus:border-cyan-500/80"
          />
        </div>
      </div>
    </header>
  );
};
