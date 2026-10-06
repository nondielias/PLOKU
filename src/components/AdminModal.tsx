import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Upload,
  Database,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Product, ProductSpec, StoreSettings } from '../types';
import { fileToBase64 } from '../services/firebase-config';
import { ThemeToggle } from './ThemeToggle';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
  products: Product[];
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onResetCatalog: () => Promise<void>;
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  dataSource: 'firestore' | 'local';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAuthenticated,
  onLogin,
  onLogout,
  products,
  onSaveProduct,
  onDeleteProduct,
  onResetCatalog,
  settings,
  onUpdateSettings,
  dataSource,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');

  // Product Edit State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Product['category']>('Audio');
  const [formPrice, setFormPrice] = useState<number>(199);
  const [formStock, setFormStock] = useState<number>(15);
  const [formTag, setFormTag] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSpecs, setFormSpecs] = useState<ProductSpec[]>([
    { key: 'Material', value: 'Aerospace Titanium' },
    { key: 'Connectivity', value: 'Bluetooth 5.4' }
  ]);

  // Settings State
  const [storeNameInput, setStoreNameInput] = useState(settings.storeName);
  const [whatsappInput, setWhatsappInput] = useState(settings.whatsappNumber);
  const [fbApiKey, setFbApiKey] = useState(settings.firebaseConfig?.apiKey || '');
  const [fbProjectId, setFbProjectId] = useState(settings.firebaseConfig?.projectId || '');
  const [fbAuthDomain, setFbAuthDomain] = useState(settings.firebaseConfig?.authDomain || '');
  const [fbStorageBucket, setFbStorageBucket] = useState(settings.firebaseConfig?.storageBucket || '');
  const [fbAppId, setFbAppId] = useState(settings.firebaseConfig?.appId || '');

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(passwordInput);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
      setPasswordInput('');
    }
  };

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Audio');
    setFormPrice(199);
    setFormStock(20);
    setFormTag('New Release');
    setFormImage('https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80');
    setFormDescription('Engineered with premium acoustic precision and low-latency audio transmission.');
    setFormSpecs([
      { key: 'Driver', value: '40mm Titanium Dynamic' },
      { key: 'Battery', value: '38 Hours continuous playback' },
      { key: 'Weight', value: '240g lightweight' }
    ]);
  };

  const handleStartEdit = (p: Product) => {
    setIsCreatingNew(false);
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormStock(p.stock);
    setFormTag(p.tag || '');
    setFormImage(p.image);
    setFormDescription(p.description);
    setFormSpecs(p.specs && p.specs.length > 0 ? [...p.specs] : [{ key: 'Feature', value: 'Flagship' }]);
  };

  const handleAddSpecRow = () => {
    setFormSpecs([...formSpecs, { key: '', value: '' }]);
  };

  const handleUpdateSpecRow = (index: number, key: string, value: string) => {
    const updated = [...formSpecs];
    updated[index] = { key, value };
    setFormSpecs(updated);
  };

  const handleRemoveSpecRow = (index: number) => {
    setFormSpecs(formSpecs.filter((_, idx) => idx !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setFormImage(base64);
        showStatus('Image uploaded and optimized successfully.');
      } catch (err) {
        console.error('File reading failed', err);
      }
    }
  };

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const cleanedSpecs = formSpecs.filter((s) => s.key.trim() && s.value.trim());

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `plk-${Date.now().toString(36)}`,
      name: formName.trim(),
      category: formCategory,
      price: Number(formPrice) || 0,
      stock: Number(formStock) || 0,
      tag: formTag.trim() || undefined,
      image: formImage.trim() || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
      description: formDescription.trim(),
      specs: cleanedSpecs,
      featured: editingProduct ? editingProduct.featured : false,
    };

    await onSaveProduct(productPayload);
    setIsCreatingNew(false);
    setEditingProduct(null);
    showStatus(`Product "${productPayload.name}" saved.`);
  };

  const handleConfirmDelete = async (id: string) => {
    await onDeleteProduct(id);
    setDeleteConfirmId(null);
    showStatus('Product removed from catalog.');
  };

  const handleSaveSettings = () => {
    const newSettings: StoreSettings = {
      ...settings,
      storeName: storeNameInput.trim() || 'PLOKU',
      whatsappNumber: whatsappInput.trim() || '15557565800',
      firebaseConfig: {
        apiKey: fbApiKey.trim(),
        authDomain: fbAuthDomain.trim(),
        projectId: fbProjectId.trim(),
        storageBucket: fbStorageBucket.trim(),
        messagingSenderId: '',
        appId: fbAppId.trim(),
      }
    };
    onUpdateSettings(newSettings);
    showStatus('Store & Firebase configuration saved.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden bg-white dark:bg-[#0a0f1d] border border-rose-200/80 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-rose-100 dark:border-slate-800/90 flex items-center justify-between bg-rose-50/50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 dark:bg-cyan-500/20 dark:text-cyan-400 border border-rose-200 dark:border-cyan-500/30 flex items-center justify-center">
              {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-slate-950 dark:text-white font-heading">
                PLOKU Admin Dashboard
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Access: {isAuthenticated ? 'Authenticated' : 'Locked'}</span>
                <span aria-hidden="true">·</span>
                <span className={dataSource === 'firestore' ? 'text-rose-600 dark:text-cyan-400' : 'text-amber-600 dark:text-amber-400'}>
                  Storage: {dataSource === 'firestore' ? 'Firebase Firestore' : 'Local Storage Cache'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && (
              <button
                onClick={onLogout}
                className="px-2.5 py-1.5 text-xs text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Lock Session
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/80 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* Notification status bar */}
          {statusMessage && (
            <div className="mb-4 p-3 rounded-lg bg-cyan-950/70 border border-cyan-800/70 text-cyan-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* PASSWORD GATE IF NOT AUTHENTICATED */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-5">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white font-heading">
                  Admin Access Authentication
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Authenticate with your Admin User ID to manage inventory, update WhatsApp routing, and configure Firebase.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Admin User ID / Passcode
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Admin User ID..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setLoginError(false);
                    }}
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  {loginError && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 pt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Invalid Admin User ID. Please check and try again.</span>
                    </p>
                  )}
                </div>

                {/* Password hint & quick fill */}
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-left text-xs text-slate-400 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500">Authorized Admin User ID:</span>
                    <button
                      type="button"
                      onClick={() => setPasswordInput('g0rDnAnuQjVj6A4ffob8sm4Y8rM2')}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium underline"
                    >
                      Fill ID
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/90 px-2.5 py-1.5 rounded border border-slate-800">
                    <code className="text-cyan-300 font-mono text-[11px] break-all select-all">
                      g0rDnAnuQjVj6A4ffob8sm4Y8rM2
                    </code>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
                >
                  Unlock Admin Dashboard
                </button>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED ADMIN PANEL */
            <div className="space-y-6">
              {/* Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setIsCreatingNew(false);
                      setEditingProduct(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      activeTab === 'products'
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-white bg-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Product Catalog ({products.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      activeTab === 'settings'
                        ? 'bg-cyan-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-white bg-slate-900'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Store & Firebase Settings</span>
                  </button>
                </div>

                {activeTab === 'products' && !isCreatingNew && !editingProduct && (
                  <button
                    onClick={handleStartCreate}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 shadow-sm shadow-cyan-500/20 active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Product</span>
                  </button>
                )}
              </div>

              {/* TAB 1: PRODUCT MANAGEMENT */}
              {activeTab === 'products' && (
                <>
                  {/* EDIT OR CREATE FORM */}
                  {(isCreatingNew || editingProduct) ? (
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-5 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h3 className="text-sm font-semibold text-white font-heading">
                          {isCreatingNew ? 'Add New Electronic Gadget' : `Edit Product: ${editingProduct?.name}`}
                        </h3>
                        <button
                          onClick={() => {
                            setIsCreatingNew(false);
                            setEditingProduct(null);
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveForm} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-medium">Product Name *</label>
                            <input
                              type="text"
                              required
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              placeholder="e.g. PLOKU Quantum ANC Earbuds"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-medium">Category</label>
                            <select
                              value={formCategory}
                              onChange={(e) => setFormCategory(e.target.value as Product['category'])}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                            >
                              <option value="Audio">Audio</option>
                              <option value="Wearables">Wearables</option>
                              <option value="Workstation">Workstation</option>
                              <option value="Power & Docks">Power & Docks</option>
                              <option value="Vision & Optics">Vision & Optics</option>
                              <option value="Accessories">Accessories</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-medium">Price (USD) *</label>
                            <input
                              type="number"
                              required
                              min="0"
                              value={formPrice}
                              onChange={(e) => setFormPrice(Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono-numbers"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-medium">Stock Count</label>
                            <input
                              type="number"
                              min="0"
                              value={formStock}
                              onChange={(e) => setFormStock(Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono-numbers"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs text-slate-400 font-medium">Badge Tag (Optional)</label>
                            <input
                              type="text"
                              value={formTag}
                              onChange={(e) => setFormTag(e.target.value)}
                              placeholder="e.g. Flagship, New Release"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        </div>

                        {/* Image URL or File Upload */}
                        <div className="space-y-2 border-t border-slate-800 pt-3">
                          <label className="text-xs text-slate-400 font-medium">Product Image Source</label>
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            <div className="sm:col-span-8">
                              <input
                                type="text"
                                placeholder="Paste Image URL or upload below..."
                                value={formImage}
                                onChange={(e) => setFormImage(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <div className="sm:col-span-4 flex items-center gap-2">
                              <label className="cursor-pointer w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors">
                                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Upload File</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          {/* Image preview thumbnail */}
                          {formImage && (
                            <div className="flex items-center gap-3 pt-1">
                              <img
                                src={formImage}
                                alt="Preview"
                                referrerPolicy="no-referrer"
                                className="w-16 h-12 object-cover rounded-md border border-slate-700 bg-slate-900"
                              />
                              <span className="text-[11px] text-slate-500">Live preview active</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div className="space-y-1 border-t border-slate-800 pt-3">
                          <label className="text-xs text-slate-400 font-medium">Full Description</label>
                          <textarea
                            rows={3}
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Detailed product features, materials, acoustic tuning..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        {/* Specifications List Builder */}
                        <div className="space-y-2 border-t border-slate-800 pt-3">
                          <div className="flex justify-between items-center">
                            <label className="text-xs text-slate-400 font-medium">Specifications List</label>
                            <button
                              type="button"
                              onClick={handleAddSpecRow}
                              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Specification Row</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {formSpecs.map((spec, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="Spec Key (e.g. Battery)"
                                  value={spec.key}
                                  onChange={(e) => handleUpdateSpecRow(idx, e.target.value, spec.value)}
                                  className="w-1/3 bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Value (e.g. 42 Hours)"
                                  value={spec.value}
                                  onChange={(e) => handleUpdateSpecRow(idx, spec.key, e.target.value)}
                                  className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSpecRow(idx)}
                                  className="p-1.5 text-slate-500 hover:text-rose-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingNew(false);
                              setEditingProduct(null);
                            }}
                            className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Product</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* PRODUCT LIST TABLE */
                    <div className="space-y-4">
                      <div className="overflow-x-auto rounded-xl border border-slate-800">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                            <tr>
                              <th className="p-3">Product</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Price</th>
                              <th className="p-3">Stock</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                            {products.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                                <td className="p-3 flex items-center gap-3">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    referrerPolicy="no-referrer"
                                    className="w-10 h-10 rounded object-cover bg-slate-900 border border-slate-800 shrink-0"
                                  />
                                  <div>
                                    <p className="font-semibold text-white">{p.name}</p>
                                    <p className="text-[11px] text-slate-500 font-mono">ID: {p.id}</p>
                                  </div>
                                </td>
                                <td className="p-3 text-slate-300">{p.category}</td>
                                <td className="p-3 font-mono-numbers font-semibold text-white">
                                  ${p.price.toLocaleString()}
                                </td>
                                <td className="p-3">
                                  <span className={p.stock > 0 ? 'text-emerald-400 font-mono-numbers' : 'text-rose-400'}>
                                    {p.stock}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleStartEdit(p)}
                                      className="p-1.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                                      title="Edit Product"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmId(p.id)}
                                      className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Delete Confirmation Modal */}
                      {deleteConfirmId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-sm w-full text-center space-y-4">
                            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
                            <h4 className="text-sm font-semibold text-white">Confirm Removal</h4>
                            <p className="text-xs text-slate-400">
                              Are you sure you want to delete this gadget from the store?
                            </p>
                            <div className="flex justify-center gap-2 pt-2">
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-4 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleConfirmDelete(deleteConfirmId)}
                                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Factory Catalog Reset */}
                      <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                        <span>Need to restore initial demonstration products?</span>
                        <button
                          onClick={async () => {
                            if (window.confirm('Restore default gadget catalog?')) {
                              await onResetCatalog();
                              showStatus('Factory default catalog restored.');
                            }
                          }}
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset Factory Catalog</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: STORE & FIREBASE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  {/* WhatsApp Order Routing */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-semibold text-white font-heading">
                        WhatsApp Checkout Routing
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">Store Display Name</label>
                        <input
                          type="text"
                          value={storeNameInput}
                          onChange={(e) => setStoreNameInput(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">WhatsApp Phone Number</label>
                        <input
                          type="text"
                          value={whatsappInput}
                          onChange={(e) => setWhatsappInput(e.target.value)}
                          placeholder="e.g. 15557565800 (country code + number)"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                        />
                        <p className="text-[10px] text-slate-500">
                          Incoming customer order messages will open this WhatsApp number.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Firebase Firestore Connection */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-sm font-semibold text-white font-heading">
                          Firebase Firestore Integration
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                        Collection: `products`
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      PLOKU is equipped with real-time Firestore SDK connectors. When Firebase keys are provided below, all additions, edits, and deletions persist directly into your cloud Firestore database. In the absence of keys, the app safely defaults to persistent browser local cache.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400">Firebase API Key</label>
                        <input
                          type="password"
                          value={fbApiKey}
                          onChange={(e) => setFbApiKey(e.target.value)}
                          placeholder="AIzaSy..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400">Project ID</label>
                        <input
                          type="text"
                          value={fbProjectId}
                          onChange={(e) => setFbProjectId(e.target.value)}
                          placeholder="ploku-store-123"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400">Auth Domain</label>
                        <input
                          type="text"
                          value={fbAuthDomain}
                          onChange={(e) => setFbAuthDomain(e.target.value)}
                          placeholder="ploku-store-123.firebaseapp.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400">Storage Bucket</label>
                        <input
                          type="text"
                          value={fbStorageBucket}
                          onChange={(e) => setFbStorageBucket(e.target.value)}
                          placeholder="ploku-store-123.appspot.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Settings */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveSettings}
                      className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
