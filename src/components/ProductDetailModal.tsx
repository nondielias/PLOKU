import React, { useState } from 'react';
import { X, ShoppingBag, MessageCircle, Check, Zap, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Product, UserAccount } from '../types';
import { createWhatsAppCheckoutLink } from '../utils/whatsapp';
import { ProductReviews } from './ProductReviews';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  whatsappNumber: string;
  storeName: string;
  currentUser?: UserAccount | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  whatsappNumber,
  storeName,
  currentUser = null,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleDirectWhatsApp = () => {
    const singleItemCart = [{ product, quantity }];
    const url = createWhatsAppCheckoutLink(whatsappNumber, storeName, singleItemCart);
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0b101c] border border-rose-200/80 dark:border-slate-800 rounded-2xl shadow-2xl text-slate-900 dark:text-slate-100 p-5 sm:p-7 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-900/80 dark:hover:bg-slate-800 transition-colors z-10 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Left Column: Image Showcase */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
              {imgError ? (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                  <Zap className="w-10 h-10 text-rose-500 dark:text-cyan-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{product.name}</p>
                </div>
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              )}
              {product.tag && (
                <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 bg-white/90 text-rose-700 border border-rose-300 shadow-xs dark:bg-slate-950/90 dark:text-cyan-300 dark:border-cyan-800/40 rounded">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 pt-2">
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 dark:bg-slate-900/60 dark:border-slate-800/80 flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-600 dark:text-cyan-400 shrink-0" />
                <span>Express Insured Shipping</span>
              </div>
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 dark:bg-slate-900/60 dark:border-slate-800/80 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-cyan-400 shrink-0" />
                <span>2-Year Hardware Warranty</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Details */}
          <div className="md:col-span-6 space-y-5">
            <div>
              {/* Category & Stock (Unboxed) */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <span className="font-semibold text-rose-600 dark:text-cyan-400">{product.category}</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span className={product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-rose-600 dark:text-rose-400 font-medium'}>
                  {product.stock > 0 ? `${product.stock} units currently in stock` : 'Out of stock'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white font-heading tracking-tight">
                {product.name}
              </h2>

              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white font-mono-numbers">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">USD · Tax Included</span>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-2 border-t border-rose-100 dark:border-slate-800/80 pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Product Overview
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Technical Specifications List */}
            {product.specs && product.specs.length > 0 && (
              <div className="space-y-2.5 border-t border-rose-100 dark:border-slate-800/80 pt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Technical Specifications
                </h4>
                <div className="divide-y divide-rose-100 dark:divide-slate-800/60 rounded-lg border border-rose-200/80 dark:border-slate-800/90 bg-rose-50/20 dark:bg-slate-900/50 text-xs overflow-hidden">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between p-2.5 hover:bg-rose-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{spec.key}</span>
                      <span className="text-slate-950 dark:text-slate-200 text-right font-medium max-w-[60%] font-mono-numbers">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Actions */}
            <div className="space-y-3 border-t border-rose-100 dark:border-slate-800/80 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Quantity</span>
                <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-semibold font-mono-numbers text-slate-950 dark:text-white min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-numbers">
                  Subtotal: ${(product.price * quantity).toLocaleString()}
                </span>
              </div>

              {/* Main CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleAdd}
                  disabled={product.stock <= 0}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                    justAdded
                      ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950'
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 dark:shadow-cyan-500/20'
                  } disabled:opacity-50`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDirectWhatsApp}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 dark:text-emerald-300 border border-emerald-500 dark:border-emerald-700/60 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm shadow-emerald-900/10"
                >
                  <MessageCircle className="w-4 h-4 text-white dark:text-emerald-400" />
                  <span>WhatsApp Fast Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Star Ratings & Reviews Sub-Collection */}
        <ProductReviews
          productId={product.id}
          productName={product.name}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};
