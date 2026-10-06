import React from 'react';
import { ArrowRight, MessageCircle, ShieldCheck, Zap, Truck } from 'lucide-react';
import { heroImg } from '../data/defaultProducts';

interface HeroProps {
  onExploreClick: () => void;
  onWhatsAppInquiry: () => void;
  totalProductsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onWhatsAppInquiry,
  totalProductsCount,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-rose-100 dark:border-slate-800/80 bg-gradient-to-b from-rose-50/50 via-white to-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-[#0b101c] dark:to-[#090d16] transition-colors">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-rose-500/10 dark:bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean unboxed kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-cyan-400 tracking-wider uppercase">
              <span>PLOKU Flagship Electronics</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-slate-500 dark:text-slate-400">2026 Collection</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 dark:text-white font-heading leading-tight">
              Tactile Precision. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-500">
                Next-Gen Electronic Gadgets.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Curated audio monitors, biometric health rings, CNC mechanical interfaces, and GaNFast charging stations engineered for creators, engineers, and tech purists.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-5 py-3 rounded-lg text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-rose-600/25 dark:shadow-cyan-500/25 active:scale-95 cursor-pointer"
              >
                <span>Browse {totalProductsCount} Gadgets</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onWhatsAppInquiry}
                className="px-5 py-3 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 dark:text-emerald-300 border border-emerald-500 dark:border-emerald-700/60 transition-all flex items-center gap-2 active:scale-95 cursor-pointer shadow-sm shadow-emerald-900/10"
              >
                <MessageCircle className="w-4 h-4 text-white dark:text-emerald-400" />
                <span>WhatsApp Concierge</span>
              </button>
            </div>

            {/* Quantitative Proof Adjacency */}
            <div className="pt-6 border-t border-rose-100 dark:border-slate-800/80 grid grid-cols-3 gap-4 text-slate-600 dark:text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-600 dark:text-cyan-400 shrink-0" />
                <span>Same-Day Global Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-cyan-400 shrink-0" />
                <span>2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-600 dark:text-cyan-400 shrink-0" />
                <span>Instant WA Checkout</span>
              </div>
            </div>
          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-rose-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xl shadow-rose-900/5 dark:shadow-cyan-950/20 group">
              <img
                src={heroImg}
                alt="PLOKU flagship electronic gadgets showcase"
                referrerPolicy="no-referrer"
                className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">PLOKU Labs Hardware</p>
                  <p className="text-slate-300">Titanium · GaN IV · OLED 4K</p>
                </div>
                <span className="font-mono-numbers px-2.5 py-1 bg-rose-600/90 dark:bg-cyan-950/80 border border-rose-400/40 dark:border-cyan-800/60 text-white dark:text-cyan-300 rounded font-semibold text-[11px] shadow-sm">
                  NEW ARRIVALS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
