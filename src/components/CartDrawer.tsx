import React, { useState } from 'react';
import { X, Trash2, MessageCircle, ArrowRight, ShoppingBag, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { CartItem, UserAccount } from '../types';
import { createWhatsAppCheckoutLink, generateWhatsAppOrderMessage } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  whatsappNumber: string;
  storeName: string;
  currentUser?: UserAccount | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  whatsappNumber,
  storeName,
  currentUser,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [showMessagePreview, setShowMessagePreview] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync user info into checkout fields if available
  React.useEffect(() => {
    if (currentUser) {
      if (!customerName && currentUser.name) {
        setCustomerName(currentUser.name);
      }
      if (!deliveryAddress && currentUser.address) {
        setDeliveryAddress(currentUser.address);
      }
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const checkoutDetails = {
    customerName,
    deliveryAddress,
    notes,
  };

  const formattedMessage = generateWhatsAppOrderMessage(storeName, items, checkoutDetails);

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;
    const url = createWhatsAppCheckoutLink(whatsappNumber, storeName, items, checkoutDetails);
    window.open(url, '_blank');
  };

  const handleCopyOrderText = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard write failed', e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 dark:bg-slate-950/70 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-white dark:bg-[#0b101c] border-l border-rose-100 dark:border-slate-800 shadow-2xl flex flex-col justify-between text-slate-900 dark:text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-rose-100 dark:border-slate-800/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-600 dark:text-cyan-400" />
              <h2 className="text-base font-semibold text-slate-950 dark:text-white font-heading">
                Shopping Bag
              </h2>
              <span className="font-mono-numbers text-xs px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 dark:bg-slate-800 dark:text-slate-300 dark:border-transparent rounded-full font-semibold">
                {totalCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors px-2 py-1 cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-slate-400">
                <ShoppingBag className="w-12 h-12 text-rose-300 dark:text-slate-700 mb-3" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-300 font-heading">
                  Your bag is empty
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Discover our flagship electronic gadgets and add precision tech to your bag.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 transition-all cursor-pointer shadow-sm shadow-rose-600/20"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <>
                <div className="divide-y divide-rose-100 dark:divide-slate-800/80">
                  {items.map((item) => (
                    <div key={item.product.id} className="py-3.5 flex gap-3 items-center">
                      {/* Thumbnail */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shrink-0"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs font-semibold text-slate-950 dark:text-white truncate font-heading">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] text-rose-600 dark:text-cyan-400/90 font-medium mt-0.5">
                          {item.product.category}
                        </p>

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-md">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 text-xs font-mono-numbers font-semibold text-slate-950 dark:text-white min-w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-xs font-bold text-slate-950 dark:text-white font-mono-numbers">
                            ${(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Optional Customer Information for WhatsApp Message */}
                <div className="pt-4 border-t border-rose-100 dark:border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                    Customer Info (Optional)
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Full Name (e.g., Alex Reed)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      placeholder="Delivery City / Address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      placeholder="Order Notes / Color / Preference"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* WhatsApp Message Preview Toggle */}
                <div className="border border-rose-100 dark:border-slate-800/80 rounded-lg p-3 bg-rose-50/30 dark:bg-slate-900/40">
                  <button
                    onClick={() => setShowMessagePreview(!showMessagePreview)}
                    className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Preview WhatsApp Order Text
                    </span>
                    {showMessagePreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showMessagePreview && (
                    <div className="mt-2.5 pt-2.5 border-t border-rose-100 dark:border-slate-800">
                      <pre className="text-[11px] text-slate-800 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto bg-white dark:bg-slate-950 p-2.5 rounded border border-rose-200 dark:border-slate-800/80">
                        {formattedMessage}
                      </pre>
                      <button
                        onClick={handleCopyOrderText}
                        className="mt-2 text-xs text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied to clipboard' : 'Copy order message'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer & WhatsApp Checkout Button */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-rose-100 dark:border-slate-800/90 bg-rose-50/50 dark:bg-[#090d16] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono-numbers text-slate-900 dark:text-slate-200">${totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Tracked Express Shipping</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-slate-950 dark:text-white font-semibold text-sm pt-2 border-t border-rose-200/80 dark:border-slate-800/80">
                  <span>Total Amount</span>
                  <span className="font-mono-numbers text-base text-rose-600 dark:text-cyan-400 font-bold">
                    ${totalAmount.toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Primary "Checkout via WhatsApp" Button */}
              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 dark:shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white dark:fill-slate-950" />
                <span>Checkout via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-slate-500">
                Pre-populates an encrypted order message with item names, prices, and totals directly to PLOKU support.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
