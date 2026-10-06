import React from 'react';
import { Cpu, MessageCircle, Lock, ShieldCheck, User } from 'lucide-react';
import { UserAccount } from '../types';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  currentUser: UserAccount | null;
  onSelectCategory: (cat: string) => void;
  onWhatsAppInquiry: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenAuth,
  currentUser,
  onSelectCategory,
  onWhatsAppInquiry,
}) => {
  return (
    <footer className="border-t border-rose-100 dark:border-slate-800/80 bg-rose-50/40 dark:bg-[#070b13] text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-950 dark:text-white font-bold text-base font-heading">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-rose-600 to-red-700 dark:from-cyan-500 dark:to-blue-600 flex items-center justify-center text-white dark:text-slate-950 shadow-xs">
                <Cpu className="w-3.5 h-3.5 text-white dark:text-slate-950" />
              </div>
              <span>PLOKU</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Curated hardware interfaces, precision audio components, and rapid GaN charging technology for modern workspaces.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
              <span>Encrypted WhatsApp Checkout</span>
              <span aria-hidden="true">·</span>
              <span>Global Dispatch</span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="space-y-2.5">
            <h4 className="text-slate-950 dark:text-white font-semibold uppercase tracking-wider text-[11px]">
              Categories
            </h4>
            <ul className="space-y-1.5">
              {['Audio', 'Wearables', 'Workstation', 'Power & Docks', 'Vision & Optics'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-rose-600 dark:hover:text-cyan-400 transition-colors text-left cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer & Orders */}
          <div className="space-y-2.5">
            <h4 className="text-slate-950 dark:text-white font-semibold uppercase tracking-wider text-[11px]">
              Support & Orders
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={onWhatsAppInquiry}
                  className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>WhatsApp Concierge</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500">2-Year Hardware Coverage</span>
              </li>
              <li>
                <span className="text-slate-500">Tracked Express Courier</span>
              </li>
              <li>
                <span className="text-slate-500">7-Day Return Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Admin & System */}
          <div className="space-y-2.5">
            <h4 className="text-slate-950 dark:text-white font-semibold uppercase tracking-wider text-[11px]">
              Store Administration
            </h4>
            <p className="text-slate-500 text-xs">
              Password-protected dashboard for inventory catalog management and WhatsApp routing.
            </p>
            <button
              onClick={() => {
                if (currentUser?.role === 'admin') {
                  onOpenAdmin();
                } else {
                  onOpenAuth();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-600 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            >
              {currentUser?.role === 'admin' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
                  <span>Admin Mode Active</span>
                </>
              ) : currentUser ? (
                <>
                  <User className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
                  <span>Account ({(currentUser.name || currentUser.email).split(' ')[0]})</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Login / Register</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-rose-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 dark:text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} PLOKU Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Precision Electronics</span>
            <span aria-hidden="true">·</span>
            <span>Crimson & White Edition</span>
            <span aria-hidden="true">·</span>
            <span>Secure WhatsApp Gateway</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
