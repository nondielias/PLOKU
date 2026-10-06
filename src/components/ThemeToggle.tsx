import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
        isDark
          ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border-slate-800 hover:border-cyan-500/40 shadow-sm'
          : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-rose-200/80 hover:border-rose-300 shadow-sm shadow-rose-900/5'
      } ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode (Crimson & White)' : 'Switch to dark mode'}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 stroke-[2.2] animate-fadeIn" />
          {showLabel && <span className="hidden sm:inline">Light</span>}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-rose-600 stroke-[2.2] animate-fadeIn" />
          {showLabel && <span className="hidden sm:inline">Dark</span>}
        </>
      )}
    </button>
  );
};
