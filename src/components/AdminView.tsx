import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  FileText,
  Search,
  ExternalLink,
  Download,
  FolderOpen,
  RefreshCw,
  Lock,
  Eye,
  LogOut,
  X,
  Upload,
  CheckCircle2,
  Package
} from 'lucide-react';
import { UserAccount, UserFile, Product } from '../types';
import {
  fetchUsersFromFirestore,
  fetchUserFilesFromFirestore,
  uploadUserFileToFirestore,
  fileToBase64
} from '../services/firebase-config';
import { ThemeToggle } from './ThemeToggle';

interface AdminViewProps {
  currentUserId: string;
  onLogout: () => void;
  onSwitchToStore: () => void;
  products: Product[];
  onOpenProductManagement: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUserId,
  onLogout,
  onSwitchToStore,
  products,
  onOpenProductManagement,
}) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [userFiles, setUserFiles] = useState<UserFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [previewFile, setPreviewFile] = useState<UserFile | null>(null);

  // File upload state for admin adding file to a user
  const [isUploading, setIsUploading] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileDescription, setNewFileDescription] = useState('');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await fetchUsersFromFirestore();
      setUsers(data);
      if (data.length > 0 && !selectedUser) {
        handleSelectUser(data[0]);
      }
    } catch (err) {
      console.warn('Failed to load users from Firestore', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSelectUser = async (user: UserAccount) => {
    setSelectedUser(user);
    setLoadingFiles(true);
    try {
      const files = await fetchUserFilesFromFirestore(user.id);
      setUserFiles(files);
    } catch (err) {
      console.warn(`Failed to load files for ${user.id}`, err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedUser) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const base64Url = await fileToBase64(file);
      const uploaded = await uploadUserFileToFirestore(selectedUser.id, {
        name: newFileName.trim() || file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: base64Url,
        description: newFileDescription.trim() || 'Uploaded by Admin'
      });

      setUserFiles((prev) => [uploaded, ...prev]);
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, fileCount: (u.fileCount || 0) + 1 } : u))
      );
      setNewFileName('');
      setNewFileDescription('');
      setUploadMessage(`File "${uploaded.name}" saved to user storage.`);
      setTimeout(() => setUploadMessage(null), 3000);
    } catch (err) {
      console.error('File upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.email.toLowerCase().includes(q) ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      u.id.toLowerCase().includes(q)
    );
  });

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

  const totalUploadedFiles = users.reduce((acc, u) => acc + (u.fileCount || 0), 0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#070b13] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Banner / Navigation for Admin */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0a0f1e]/95 backdrop-blur-md border-b border-rose-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand + Official Admin Badge */}
          <div className="flex items-center gap-3">
            <span className="font-heading font-bold text-lg tracking-wider text-slate-950 dark:text-white">
              PLOKU
            </span>
            <span className="text-slate-300 dark:text-slate-600">/</span>

            {/* MANDATORY ADMIN BADGE / INDICATOR */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-cyan-950/90 border border-rose-200 dark:border-cyan-500/50 text-rose-700 dark:text-cyan-300 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-600 dark:bg-cyan-400 animate-pulse" />
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
              <span>ADMIN VIEW</span>
              <span className="text-[10px] text-rose-500 dark:text-cyan-500 font-mono hidden sm:inline">
                ({currentUserId.substring(0, 10)}...)
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />

            <button
              onClick={onOpenProductManagement}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Manage store inventory"
            >
              <Package className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
              <span className="hidden sm:inline">Product Catalog</span>
              <span className="font-mono text-[10px] bg-white border border-slate-200 dark:bg-slate-800 dark:border-transparent px-1.5 py-0.2 rounded text-slate-600 dark:text-slate-400">
                {products.length}
              </span>
            </button>

            <button
              onClick={onSwitchToStore}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 dark:border-rose-800/60 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign out and return to auth screen"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white dark:bg-[#0d1424] border border-rose-100 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Total Registered Users</span>
              <Users className="w-4 h-4 text-rose-600 dark:text-cyan-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-slate-950 dark:text-white">
              {loadingUsers ? '...' : users.length}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Firestore collection: `users`</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0d1424] border border-rose-100 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Total Uploaded Files</span>
              <FileText className="w-4 h-4 text-rose-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-slate-950 dark:text-white">
              {loadingUsers ? '...' : totalUploadedFiles}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Subcollection: `users/{'{userId}'}/files`</p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#0d1424] border border-rose-100 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Security Rules Access</span>
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Admin Read Access Active</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Rule ID `g0rDnAnuQjVj6A4ffob8sm4Y8rM2`</p>
          </div>
        </div>

        {/* User List & File Details Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: All Users from Firestore */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-[#0b101c] border border-rose-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
              <div className="p-4 sm:p-5 border-b border-rose-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/40 dark:bg-slate-900/40">
                <div>
                  <h2 className="text-base font-semibold text-slate-950 dark:text-white font-heading flex items-center gap-2">
                    <Users className="w-4 h-4 text-rose-600 dark:text-cyan-400" />
                    <span>Firestore Database Users</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click any user to view their uploaded documents and files
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                    />
                  </div>
                  <button
                    onClick={loadUsers}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    title="Refresh users"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Table of Users */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-rose-50/50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-rose-100 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5">User Email & Name</th>
                      <th className="p-3.5">Created Date</th>
                      <th className="p-3.5 text-center">Files Uploaded</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-100 dark:divide-slate-800/60 bg-white dark:bg-slate-950/30">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-600 dark:text-cyan-400" />
                          <span>Loading users...</span>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500">
                          No users found matching "{searchQuery}"
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const isSelected = selectedUser?.id === user.id;
                        return (
                          <tr
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-rose-50/80 border-l-2 border-rose-600 dark:bg-cyan-950/40 dark:border-cyan-400'
                                : 'hover:bg-rose-50/30 dark:hover:bg-slate-900/60'
                            }`}
                          >
                            <td className="p-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 flex items-center justify-center font-bold shrink-0">
                                  {user.name ? user.name[0].toUpperCase() : 'U'}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p className="font-semibold text-slate-950 dark:text-white truncate font-heading">
                                      {user.name}
                                    </p>
                                    {user.role === 'admin' && (
                                      <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-700 border border-rose-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800 rounded font-mono font-semibold">
                                        ADMIN
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-rose-600 dark:text-cyan-400/90 font-mono truncate">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                              {formatDate(user.createdAt)}
                            </td>

                            <td className="p-3.5 text-center">
                              <span className="inline-flex items-center gap-1 font-mono-numbers px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white">
                                <FileText className="w-3 h-3 text-rose-600 dark:text-cyan-400" />
                                <span>{user.fileCount || 0}</span>
                              </span>
                            </td>

                            <td className="p-3.5 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectUser(user);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-rose-600 text-white font-semibold dark:bg-cyan-500 dark:text-slate-950'
                                    : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700'
                                }`}
                              >
                                View Files
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Clicked User's Files Drawer / Panel */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#0b101c] border border-rose-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl sticky top-20">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-rose-100 dark:border-slate-800 bg-rose-50/40 dark:bg-slate-900/40 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-950 dark:text-white font-heading flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-rose-600 dark:text-cyan-400" />
                    <span>Uploaded User Files</span>
                  </h3>
                  {selectedUser ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[260px]">
                      Files for: <span className="text-rose-600 dark:text-cyan-300 font-mono font-medium">{selectedUser.email}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Select a user from the left list to inspect files
                    </p>
                  )}
                </div>

                {selectedUser && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 dark:bg-slate-800 dark:text-slate-300 dark:border-transparent font-medium">
                    {userFiles.length} file{userFiles.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 max-h-[70vh] overflow-y-auto space-y-4">
                {!selectedUser ? (
                  <div className="py-16 text-center text-slate-400 dark:text-slate-500">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-400">No user selected</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-1">
                      Click any user row to view their uploaded files.
                    </p>
                  </div>
                ) : loadingFiles ? (
                  <div className="py-16 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-600 dark:text-cyan-400" />
                    <p className="text-xs">Fetching files...</p>
                  </div>
                ) : userFiles.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 border border-dashed border-rose-200 dark:border-slate-800 rounded-xl p-4 bg-rose-50/20 dark:bg-transparent">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs text-slate-700 dark:text-slate-400">This user has not uploaded any files yet.</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-1">
                      You can attach a document to this user below.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-slate-700 transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 dark:bg-slate-800 dark:border-slate-700 dark:text-cyan-400 shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-950 dark:text-white truncate font-heading" title={file.name}>
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                <span>{formatFileSize(file.size)}</span>
                                <span aria-hidden="true">·</span>
                                <span>{formatDate(file.uploadedAt)}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setPreviewFile(file)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs shrink-0 cursor-pointer"
                            title="Preview file"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {file.description && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950/60 p-2 rounded border border-slate-200 dark:border-slate-800/80 leading-relaxed">
                            {file.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-[150px]">
                            Type: {file.type}
                          </span>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-rose-600 hover:text-rose-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium flex items-center gap-1"
                          >
                            <span>Open File</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload File on Behalf of Selected User */}
                {selectedUser && (
                  <div className="pt-4 border-t border-rose-100 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
                      <span>Upload File for this User</span>
                    </h4>

                    {uploadMessage && (
                      <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-cyan-950/70 border border-rose-200 dark:border-cyan-800 text-rose-800 dark:text-cyan-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 dark:text-cyan-400" />
                        <span>{uploadMessage}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Document label / Custom title (optional)"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 dark:focus:border-cyan-500"
                      />

                      <label className="cursor-pointer w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-rose-600/20 dark:shadow-none">
                        <Upload className="w-4 h-4" />
                        <span>{isUploading ? 'Saving...' : 'Choose File to Upload'}</span>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* File Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-white dark:bg-[#0b101c] border border-rose-200/80 dark:border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 text-slate-900 dark:text-slate-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-semibold text-slate-950 dark:text-white font-heading truncate max-w-xs">
                  {previewFile.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Size: {formatFileSize(previewFile.size)} · {previewFile.type}
                </p>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {previewFile.type.startsWith('image/') || previewFile.url.startsWith('data:image/') ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 max-h-72 flex items-center justify-center">
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  referrerPolicy="no-referrer"
                  className="max-h-72 object-contain"
                />
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <FileText className="w-12 h-12 text-rose-600 dark:text-cyan-400 mx-auto" />
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Document / Binary Asset</p>
                <p className="text-[11px] text-slate-500">{previewFile.description || 'User storage'}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-3.5 py-1.5 text-xs rounded-lg text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                Close
              </button>
              <a
                href={previewFile.url}
                download={previewFile.name}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-rose-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download / Open</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
