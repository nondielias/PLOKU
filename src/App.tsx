/**
 * PLOKU - Electronic Gadget Store
 * Main Application Component
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminModal } from './components/AdminModal';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import { AdminView } from './components/AdminView';
import { PersonalDashboard } from './components/PersonalDashboard';
import { Footer } from './components/Footer';
import { Product, CartItem, StoreSettings, UserAccount } from './types';
import {
  fetchProducts,
  saveProduct,
  deleteProduct,
  resetToDefaultCatalog,
  loadStoreSettings,
  saveStoreSettings,
} from './services/firebase-config';
import {
  getCurrentUser,
  logoutUser,
  setCurrentUser as persistCurrentUser,
  onAuthChange,
  ADMIN_USER_ID,
} from './services/auth-service';
import { createWhatsAppCheckoutLink } from './utils/whatsapp';
import { SlidersHorizontal, CheckCircle2, ShoppingBag, ShieldAlert, ArrowLeft } from 'lucide-react';

const STORAGE_KEY_CART = 'ploku_shopping_cart_v1';
const STORAGE_KEY_AUTH = 'ploku_admin_auth_v1';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(loadStoreSettings());
  const [dataSource, setDataSource] = useState<'firestore' | 'local'>('local');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // View routing: Admin View vs Personal Dashboard vs Storefront vs Auth Screen
  const [currentView, setCurrentView] = useState<'admin' | 'dashboard' | 'storefront' | 'auth'>(() => {
    const user = getCurrentUser();
    if (user?.id === ADMIN_USER_ID || user?.role === 'admin') return 'admin';
    if (user) return 'dashboard';
    return 'storefront';
  });

  // UI Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Admin Auth State (synced with currentUser role or session)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const user = getCurrentUser();
    if (user?.role === 'admin') return true;
    return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const catalogRef = useRef<HTMLDivElement>(null);

  // Initial load & Auth Listener
  useEffect(() => {
    // Subscribe to Firebase Authentication state
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setCurrentUser(user);
        if (user.id === ADMIN_USER_ID || user.role === 'admin') {
          setIsAdminAuthenticated(true);
        }
      }
    });

    // Load products
    fetchProducts().then(({ products: loaded, source }) => {
      setProducts(loaded);
      setDataSource(source);
    });

    // Load cart from localStorage
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY_CART);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.warn('Failed to load cart from storage', e);
    }

    return () => unsubscribe();
  }, []);

  // Save cart changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Auth Operations - Flow: redirect to dashboard on login, return to auth screen on logout
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    persistCurrentUser(user);
    if (user.id === ADMIN_USER_ID || user.role === 'admin') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      setCurrentView('admin');
      showToast('Admin authenticated: Redirected to Admin Dashboard.');
    } else {
      setCurrentView('dashboard');
      showToast(`Welcome! Redirected to your dashboard.`);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
    // Flow: returns to the auth screen
    setCurrentView('auth');
    showToast('Signed out successfully. Returned to auth screen.');
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity}x "${product.name}" to shopping bag.`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Admin Auth
  const handleAdminLogin = (password: string): boolean => {
    const input = password.trim();
    // Admin credentials: user ID g0rDnAnuQjVj6A4ffob8sm4Y8rM2 (or Georges)
    if (input === 'g0rDnAnuQjVj6A4ffob8sm4Y8rM2' || input.toLowerCase() === 'georges') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
  };

  // Product CRUD
  const handleSaveProduct = async (productToSave: Product) => {
    const saved = await saveProduct(productToSave);
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    // If currently selected, update modal
    if (selectedProduct?.id === saved.id) {
      setSelectedProduct(saved);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
    // Also remove from cart if present
    handleRemoveCartItem(productId);
  };

  const handleResetCatalog = async () => {
    const defaults = await resetToDefaultCatalog();
    setProducts(defaults);
  };

  const handleUpdateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    saveStoreSettings(newSettings);
  };

  // WhatsApp concierge quick inquiry
  const handleWhatsAppGeneralInquiry = () => {
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${settings.storeName}! I am browsing your electronic gadgets store and would like to inquire about product recommendations and ordering.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;

        // Search query filter
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          (product.specs &&
            product.specs.some(
              (s) =>
                s.key.toLowerCase().includes(query) ||
                s.value.toLowerCase().includes(query)
            ));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        // Default: featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ['All', 'Audio', 'Wearables', 'Workstation', 'Power & Docks', 'Vision & Optics'];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-rose-500/20 selection:text-rose-700 dark:bg-[#090d16] dark:text-slate-100 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-white text-slate-900 border border-rose-200 shadow-2xl dark:bg-slate-900 dark:border-cyan-500/50 dark:text-white text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIEW 0: AUTH SCREEN (WHEN RETURNED TO AUTH SCREEN OR NAVIGATED TO LOGIN) */}
      {currentView === 'auth' ? (
        <AuthScreen
          onLoginSuccess={handleLoginSuccess}
          onExploreStore={() => setCurrentView('storefront')}
        />
      ) : currentView === 'admin' && (currentUser?.id === ADMIN_USER_ID || currentUser?.role === 'admin') ? (
        /* VIEW 1: DEDICATED ADMIN DASHBOARD VIEW (WHEN ADMIN LOGS IN) */
        <AdminView
          currentUserId={currentUser.id}
          onLogout={handleLogout}
          onSwitchToStore={() => setCurrentView('storefront')}
          products={products}
          onOpenProductManagement={() => setIsAdminOpen(true)}
        />
      ) : currentView === 'dashboard' && currentUser && currentUser.id !== ADMIN_USER_ID ? (
        /* VIEW 2: PERSONAL CLIENT DASHBOARD */
        <PersonalDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          onGoToStore={() => setCurrentView('storefront')}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={totalCartCount}
        />
      ) : (
        /* VIEW 3: STOREFRONT BROWSE EXPERIENCE */
        <>
          {/* Admin Banner if Admin is browsing Storefront */}
          {currentUser && (currentUser.id === ADMIN_USER_ID || currentUser.role === 'admin') && (
            <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-xs text-rose-800 dark:bg-cyan-950/90 dark:border-cyan-800/80 dark:text-cyan-300">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-cyan-400 animate-pulse" />
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
                  <span>Admin Session Active (ID: {currentUser.id.substring(0, 12)}...)</span>
                </span>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 font-semibold text-[11px] shadow-sm transition-all cursor-pointer"
                >
                  Return to Admin Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Client Banner if Client is browsing Storefront */}
          {currentUser && currentUser.role === 'client' && (
            <div className="bg-rose-50/60 border-b border-rose-100 px-4 py-2 text-xs text-slate-700 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-300">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <span>Signed in as <strong>{currentUser.name}</strong> ({currentUser.email})</span>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-3 py-1 rounded-md bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-cyan-300 dark:border-transparent text-[11px] transition-all cursor-pointer"
                >
                  Open Personal Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Main Top Header */}
          <Header
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            currentUser={currentUser}
            onOpenAuth={() => setCurrentView('auth')}
            onOpenDashboard={() =>
              setCurrentView(
                currentUser?.id === ADMIN_USER_ID || currentUser?.role === 'admin'
                  ? 'admin'
                  : 'dashboard'
              )
            }
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              scrollToCatalog();
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreClick={scrollToCatalog}
          onWhatsAppInquiry={handleWhatsAppGeneralInquiry}
          totalProductsCount={products.length}
        />

        {/* Product Catalog Section */}
        <section ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Controls Bar: Categories & Sorting */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 dark:border-slate-800/80 pb-6">
            {/* Interactive Segmented Filter Controls (Allowed buttons with active states) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-rose-600 text-white font-semibold shadow-sm shadow-rose-600/25 dark:bg-cyan-500 dark:text-slate-950 dark:shadow-cyan-500/20'
                        : 'text-slate-600 hover:text-slate-950 bg-slate-50 hover:bg-rose-50/60 border border-slate-200 hover:border-rose-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-900/60 dark:hover:bg-slate-800/80 dark:border-slate-800/60'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sorting & Item Count */}
            <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-mono-numbers">
                Showing {filteredProducts.length} of {products.length} items
              </span>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 rounded-lg px-2.5 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Featured</option>
                  <option value="price-asc" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Price: Low to High</option>
                  <option value="price-desc" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Price: High to Low</option>
                  <option value="name" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Search / Category Notification */}
          {(searchQuery || selectedCategory !== 'All') && (
            <div className="mt-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-rose-50/60 dark:bg-slate-900/40 p-3 rounded-lg border border-rose-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <span>Filtering by:</span>
                {selectedCategory !== 'All' && (
                  <span className="text-rose-600 dark:text-cyan-400 font-semibold">{selectedCategory}</span>
                )}
                {searchQuery && (
                  <span>matching "{searchQuery}"</span>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-rose-600 hover:text-rose-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* 3-Column / 2-Column Responsive Product Grid */}
          <div className="mt-8">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-rose-200 dark:border-slate-800 rounded-2xl p-8 bg-rose-50/20 dark:bg-slate-900/30">
                <ShoppingBag className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-white font-heading">
                  No gadgets found matching your criteria
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Try clearing the search query or selecting another category to view available electronic hardware.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Reset Catalog View
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={(p) => setSelectedProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

          {/* Semantic Footer */}
          <Footer
            onOpenAdmin={() => {
              if (currentUser?.id === ADMIN_USER_ID || currentUser?.role === 'admin') {
                setCurrentView('admin');
              } else {
                setCurrentView('auth');
              }
            }}
            onOpenAuth={() => setCurrentView('auth')}
            currentUser={currentUser}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              scrollToCatalog();
            }}
            onWhatsAppInquiry={handleWhatsAppGeneralInquiry}
          />
        </>
      )}

      {/* Global Modals (Accessible from Storefront and Dashboards) */}
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => {
          handleAddToCart(p, qty);
        }}
        whatsappNumber={settings.whatsappNumber}
        storeName={settings.storeName}
        currentUser={currentUser}
      />

      {/* Shopping Bag & WhatsApp Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        whatsappNumber={settings.whatsappNumber}
        storeName={settings.storeName}
        currentUser={currentUser}
      />

      {/* Login & Client Registration Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onOpenAdminDashboard={() => setCurrentView('admin')}
      />

      {/* Admin Dashboard Modal (Product CRUD & Store Settings) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isAuthenticated={isAdminAuthenticated}
        onLogin={handleAdminLogin}
        onLogout={() => {
          handleLogout();
          setIsAdminOpen(false);
        }}
        products={products}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetCatalog={handleResetCatalog}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        dataSource={dataSource}
      />
    </div>
  );
}
