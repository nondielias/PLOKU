import React, { useState, useEffect } from 'react';
import {
  User,
  FileText,
  Upload,
  Calendar,
  ShoppingBag,
  Download,
  Trash2,
  CheckCircle2,
  RefreshCw,
  LogOut,
  FolderOpen,
  ArrowRight
} from 'lucide-react';
import { UserAccount, UserFile } from '../types';
import {
  fetchUserFilesFromFirestore,
  uploadUserFileToFirestore,
  deleteUserFileFromFirestore,
  fileToBase64
} from '../services/firebase-config';
import { ThemeToggle } from './ThemeToggle';

interface PersonalDashboardProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onGoToStore: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  currentUser,
  onLogout,
  onGoToStore,
  onOpenCart,
  cartCount,
}) => {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [fileLabel, setFileLabel] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadFiles = async () => {
    setLoadingFiles(true);
    try {
      const data = await fetchUserFilesFromFirestore(currentUser.id);
      setFiles(data);
    } catch (err) {
      console.warn('Failed to fetch personal files', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [currentUser.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const base64Url = await fileToBase64(file);
      const newFile = await uploadUserFileToFirestore(currentUser.id, {
        name: fileLabel.trim() || file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: base64Url,
        description: fileDescription.trim() || 'Uploaded by user'
      });

      setFiles((prev) => [newFile, ...prev]);
      setFileLabel('');
      setFileDescription('');
      setStatusMessage(`File "${newFile.name}" saved to your documents vault.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error('File upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    await deleteUserFileFromFirestore(currentUser.id, fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setStatusMessage('File removed from your account.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const formatDate = (dateStr: string | number | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      const d = typeof dateStr === 'number' ? new Date(dateStr) : new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return String(dateStr);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070b13] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0a0f1e]/95 backdrop-blur-md border-b border-rose-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-heading font-bold text-lg tracking-wider text-slate-950 dark:text-white">
              PLOKU
            </span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-xs font-semibold text-rose-600 dark:text-slate-300">
              Personal Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />

            <button
              onClick={onOpenCart}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800 flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
              <span>Bag ({cartCount})</span>
            </button>

            <button
              onClick={onGoToStore}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 flex items-center gap-1.5 transition-all shadow-sm shadow-rose-600/20 dark:shadow-cyan-500/20 cursor-pointer"
            >
              <span>Explore Gadgets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 dark:border-rose-800/60 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign out and return to auth screen"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Status Message */}
        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-cyan-950/80 border border-rose-200 dark:border-cyan-800 text-rose-800 dark:text-cyan-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-cyan-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* User Profile Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0b101c] border border-rose-200/80 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-cyan-500/15 border border-rose-200 dark:border-cyan-500/30 text-rose-700 dark:text-cyan-400 flex items-center justify-center font-bold text-xl font-heading">
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-950 dark:text-white font-heading">
                  {currentUser.name || currentUser.email}
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 font-mono">
                  Verified Client
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
                  <span>Member since: {formatDate(currentUser.createdAt)}</span>
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
                  <span>{files.length} document{files.length !== 1 ? 's' : ''} saved</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onGoToStore}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Browse Electronics Store
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 dark:border-rose-800/60 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign out of account"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Uploaded Files Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Files List */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0b101c] border border-rose-200/80 dark:border-slate-800 rounded-2xl overflow-hidden p-5 sm:p-6 space-y-4 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between border-b border-rose-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-950 dark:text-white font-heading flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-rose-600 dark:text-cyan-400" />
                  <span>My Saved Files & Documents</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Securely stored under your isolated user account
                </p>
              </div>

              <button
                onClick={loadFiles}
                className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-950 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 cursor-pointer"
                title="Refresh list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingFiles ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loadingFiles ? (
              <div className="py-12 text-center text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-600 dark:text-cyan-400" />
                <p className="text-xs">Fetching your documents...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="py-12 text-center text-slate-500 border border-dashed border-rose-200 dark:border-slate-800 rounded-xl p-6 bg-rose-50/20 dark:bg-transparent">
                <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-medium text-slate-700 dark:text-slate-400">You haven't uploaded any files yet.</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-600 mt-1 max-w-sm mx-auto">
                  Upload warranties, invoices, receipts, or custom technical specifications below to access them anytime.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 dark:bg-slate-800 dark:border-slate-700 dark:text-cyan-400 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-semibold text-slate-950 dark:text-white truncate font-heading" title={file.name}>
                          {file.name}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          <span>{formatFileSize(file.size)}</span>
                          <span aria-hidden="true">·</span>
                          <span>Uploaded: {formatDate(file.uploadedAt)}</span>
                        </div>
                        {file.description && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                            {file.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-cyan-300 dark:border-transparent flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>View / Download</span>
                      </a>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-500 dark:hover:text-rose-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Upload Box */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0b101c] border border-rose-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 sticky top-20 shadow-sm dark:shadow-none">
            <div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white font-heading flex items-center gap-2">
                <Upload className="w-4 h-4 text-rose-600 dark:text-cyan-400" />
                <span>Upload New File</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Attach technical schematics, receipts, or gadget warranty certificates
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  File Title / Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Headphones Warranty Pass"
                  value={fileLabel}
                  onChange={(e) => setFileLabel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Notes / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional order or specification notes..."
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                />
              </div>

              <label className="cursor-pointer w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/20 dark:shadow-cyan-500/20 active:scale-95">
                <Upload className="w-4 h-4 stroke-[2.5]" />
                <span>{isUploading ? 'Saving Document...' : 'Select File from Computer'}</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
                Supports PDF, images, CAD, ZIP, text, and documents.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
