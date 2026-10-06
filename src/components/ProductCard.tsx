import React, { useState } from 'react';
import { ShoppingBag, Eye, Zap } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onAddToCart,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, e);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1200);
  };

  return (
    <article
      onClick={() => onOpenDetails(product)}
      className="group relative rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0e1422] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:border-rose-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-rose-900/5 dark:hover:shadow-cyan-950/20 cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-500 p-4 text-center">
            <Zap className="w-8 h-8 text-rose-500/60 dark:text-cyan-400/60 mb-1" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-400">{product.name}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Quick View Overlay Badge */}
        <div className="absolute inset-0 bg-slate-950/20 dark:bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-white/95 text-slate-900 dark:bg-slate-900/90 dark:text-white text-xs font-medium flex items-center gap-1.5 shadow-md border border-slate-200 dark:border-slate-700">
            <Eye className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
            <span>View Specs</span>
          </span>
        </div>

        {/* Stock or Tag Unboxed Indicator */}
        {product.tag && (
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-rose-700 bg-white/90 border border-rose-300 shadow-xs dark:text-cyan-300 dark:bg-slate-950/80 dark:border-cyan-800/40 px-2 py-0.5 rounded">
              {product.tag}
            </span>
          </div>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div className="space-y-1.5">
          {/* Metadata: Category · In Stock (Unboxed Zero-Pill) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">{product.category}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
            <span className={product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-rose-600 dark:text-rose-400'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-semibold text-slate-950 group-hover:text-rose-600 dark:text-white dark:group-hover:text-cyan-300 transition-colors line-clamp-1 font-heading">
            {product.name}
          </h3>

          {/* Short description preview */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Bag Action */}
        <div className="pt-4 mt-3 border-t border-rose-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Price</span>
            <span className="text-base sm:text-lg font-bold text-slate-950 dark:text-white font-mono-numbers">
              ${product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
              isAddedRecently
                ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 dark:shadow-cyan-500/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Add to Shopping Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isAddedRecently ? 'Added!' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
