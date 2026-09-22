import React, { useState, useEffect, useCallback } from 'react';
import { 
  HardDrive, 
  Upload, 
  Download, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  FolderPlus, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Search,
  LogOut,
  ShieldAlert,
  Save
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  signInWithGoogleDrive, 
  signOutGoogleDrive, 
  getDriveAccessToken, 
  listDriveFiles, 
  uploadBackupToGoogleDrive, 
  downloadBackupFromGoogleDrive, 
  deleteFileFromGoogleDrive, 
  DriveFileItem 
} from '../services/googleDriveService';
import { CompanyInfo, Language } from '../types';

interface GoogleDriveViewProps {
  language: Language;
  company: CompanyInfo;
  currentBackupData: any;
  onRestoreData: (restoredData: any) => void;
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
}

export const GoogleDriveView: React.FC<GoogleDriveViewProps> = ({
  language,
  company,
  currentBackupData,
  onRestoreData,
  currentUser,
  onUserChange,
}) => {
  const isBn = language === 'bn';

  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Destructive action confirmation state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  // Load files from Google Drive
  const loadFiles = useCallback(async () => {
    const token = getDriveAccessToken();
    if (!token) return;

    setLoading(true);
    setStatusMessage(null);
    try {
      const driveFiles = await listDriveFiles(token, searchQuery);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Error loading Drive files:', err);
      setStatusMessage({
        type: 'error',
        text: isBn 
          ? `ফাইল লোড করতে ব্যর্থ হয়েছে: ${err.message || 'অনুগ্রহ করে পুনরায় সাইন-ইন করুন'}` 
          : `Failed to load Drive files: ${err.message || 'Please sign in again'}`
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, isBn]);

  useEffect(() => {
    if (currentUser) {
      loadFiles();
    }
  }, [currentUser, loadFiles]);

  // Handle Google Sign In
  const handleSignIn = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const { user } = await signInWithGoogleDrive();
      onUserChange(user);
      setStatusMessage({
        type: 'success',
        text: isBn ? 'গুগল ড্রাইভে সফলভাবে সাইন-ইন হয়েছে!' : 'Signed in with Google Drive successfully!'
      });
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setStatusMessage({
        type: 'error',
        text: isBn ? `সাইন-ইন ব্যর্থ: ${err.message || 'অনুমতি দিন'}` : `Sign-in failed: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    await signOutGoogleDrive();
    onUserChange(null);
    setFiles([]);
    setStatusMessage({
      type: 'success',
      text: isBn ? 'গুগল ড্রাইভ থেকে সাইন-আউট করা হয়েছে।' : 'Signed out from Google Drive.'
    });
  };

  // Upload Current Software Data to Google Drive
  const handleUploadBackup = async () => {
    const token = getDriveAccessToken();
    if (!token) {
      setStatusMessage({
        type: 'error',
        text: isBn ? 'আগে গুগল দিয়ে সাইন-ইন করুন' : 'Please sign in first'
      });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: isBn ? 'গুগল ড্রাইভে সম্পূর্ণ ডেটা ব্যাকআপ সংরক্ষণ' : 'Save Full Backup to Google Drive',
      description: isBn 
        ? `আপনার বর্তমান সকল টিকিট, বুকিং, বাস/জাহাজের সিট এবং ক্যাশ একাউন্টসের একটি নিরাপদ ব্যাকআপ ফাইল আপনার গুগল ড্রাইভের "Dwipachal Enterprise Backups" ফোল্ডারে সেভ করা হবে। আপনি কি এগিয়ে যেতে চান?`
        : `A secure backup JSON containing all current bookings, tickets, and cash records will be uploaded to your "Dwipachal Enterprise Backups" Google Drive folder. Do you want to proceed?`,
      actionLabel: isBn ? 'ব্যাকআপ আপলোড করুন' : 'Upload Backup',
      onConfirm: async () => {
        setLoading(true);
        try {
          const res = await uploadBackupToGoogleDrive(token, currentBackupData);
          setStatusMessage({
            type: 'success',
            text: isBn 
              ? `ব্যাকআপ ফাইল সফলভাবে ড্রাইভে সংরক্ষিত হয়েছে (${res.name})!` 
              : `Backup saved to Google Drive successfully (${res.name})!`
          });
          loadFiles();
        } catch (err: any) {
          setStatusMessage({
            type: 'error',
            text: isBn ? `আপলোড করতে সমস্যা হয়েছে: ${err.message}` : `Upload failed: ${err.message}`
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Restore backup from Google Drive
  const handleRestoreFile = (file: DriveFileItem) => {
    const token = getDriveAccessToken();
    if (!token) return;

    setConfirmDialog({
      isOpen: true,
      title: isBn ? 'গুগল ড্রাইভ থেকে ডেটা রিস্টোর' : 'Restore Data from Google Drive',
      description: isBn
        ? `সতর্কতা: "${file.name}" ফাইলটি থেকে ডেটা রিস্টোর করলে বর্তমান সফটওয়্যারের ডেটা এই ব্যাকআপ ফাইলটির তথ্যে প্রতিস্থাপিত হবে। আপনি কি নিশ্চিত?`
        : `Warning: Restoring from "${file.name}" will update the current software state with data from this snapshot. Are you sure?`,
      actionLabel: isBn ? 'হ্যাঁ, রিস্টোর করুন' : 'Confirm & Restore',
      onConfirm: async () => {
        setLoading(true);
        try {
          const restored = await downloadBackupFromGoogleDrive(token, file.id);
          onRestoreData(restored);
          setStatusMessage({
            type: 'success',
            text: isBn ? `"${file.name}" সফলভাবে রিস্টোর হয়েছে!` : `"${file.name}" restored successfully!`
          });
        } catch (err: any) {
          setStatusMessage({
            type: 'error',
            text: isBn ? `রিস্টোর ব্যর্থ: ${err.message}` : `Restore failed: ${err.message}`
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Delete file with required user confirmation dialog
  const handleDeleteFile = (file: DriveFileItem) => {
    const token = getDriveAccessToken();
    if (!token) return;

    setConfirmDialog({
      isOpen: true,
      title: isBn ? 'গুগল ড্রাইভ ফাইল মুছে ফেলা' : 'Delete File from Google Drive',
      description: isBn 
        ? `আপনি কি নিশ্চিতভাবে "${file.name}" ফাইলটি গুগল ড্রাইভ থেকে ডিলিট করতে চান? এই কাজটি আর পূর্বাবস্থায় ফেরানো যাবে না।`
        : `Are you sure you want to permanently delete "${file.name}" from your Google Drive? This action cannot be undone.`,
      actionLabel: isBn ? 'ফাইল মুছুন' : 'Delete Permanently',
      onConfirm: async () => {
        setLoading(true);
        try {
          await deleteFileFromGoogleDrive(token, file.id);
          setStatusMessage({
            type: 'success',
            text: isBn ? `"${file.name}" মুছে ফেলা হয়েছে।` : `"${file.name}" deleted from Drive.`
          });
          loadFiles();
        } catch (err: any) {
          setStatusMessage({
            type: 'error',
            text: isBn ? `ডিলিট করতে সমস্যা হয়েছে: ${err.message}` : `Failed to delete: ${err.message}`
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>{isBn ? 'গুগল ড্রাইভ ইন্টিগ্রেশন ও ক্লাউড ব্যাকআপ' : 'Google Drive Integration & Backup'}</span>
                <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  Google Workspace
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {isBn 
                  ? 'আপনার গুগল ড্রাইভের সাথে সফটওয়্যারটি সরাসরি সংযুক্ত করে সকল বুকিং ও হিসাব আজীবনের জন্য ক্লাউডে সংরক্ষণ করুন।'
                  : 'Connect your personal Google Drive to safely store snapshots of all bookings, fleet manifests, and accounts.'}
              </p>
            </div>
          </div>

          {/* User Auth state / Google Sign in button */}
          <div>
            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'Google User'} 
                    className="w-9 h-9 rounded-full border border-slate-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {currentUser.email?.charAt(0).toUpperCase() || 'G'}
                  </div>
                )}
                <div className="text-xs pr-2">
                  <span className="font-bold text-slate-900 block truncate max-w-[180px]">
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <span className="text-slate-500 block truncate max-w-[180px]">
                    {currentUser.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                  title={isBn ? 'সাইন-আউট' : 'Sign out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Google Sign In standard button */
              <button 
                onClick={handleSignIn}
                disabled={loading}
                className="flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl shadow-xs font-semibold text-xs transition-all cursor-pointer hover:border-slate-400"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>{isBn ? 'Google দিয়ে সাইন-ইন করুন' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Status notice */}
        {statusMessage && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleUploadBackup}
              disabled={!currentUser || loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isBn ? 'সফটওয়্যার ব্যাকআপ ড্রাইভে সেভ করুন' : 'Save Full Backup to Drive'}</span>
            </button>

            <button
              onClick={loadFiles}
              disabled={!currentUser || loading}
              className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{isBn ? 'রিফ্রেশ' : 'Refresh Files'}</span>
            </button>
          </div>

          {/* Search bar for drive files */}
          {currentUser && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isBn ? 'ড্রাইভ ফাইল খুঁজুন...' : 'Search Drive files...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 bg-slate-50 focus:bg-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Files List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">
              {isBn ? 'গুগল ড্রাইভ ফাইল ও সংরক্ষিত ব্যাকআপ সমূহ' : 'Google Drive Files & Backups'}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {files.length} {isBn ? 'টি ফাইল পাওয়া গেছে' : 'files found'}
          </span>
        </div>

        {!currentUser ? (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <HardDrive className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-medium">
              {isBn 
                ? 'আপনার গুগল ড্রাইভের ব্যাকআপ ফাইল দেখতে ও সংরক্ষণ করতে উপরে গুগল দিয়ে সাইন-ইন করুন।'
                : 'Sign in with your Google account above to view and save files to Google Drive.'}
            </p>
            <button
              onClick={handleSignIn}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              <span>{isBn ? 'গুগল দিয়ে সাইন-ইন করুন' : 'Sign in with Google'}</span>
            </button>
          </div>
        ) : loading && files.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs">{isBn ? 'গুগল ড্রাইভ ফাইল লোড হচ্ছে...' : 'Loading Drive files...'}</p>
          </div>
        ) : files.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <FileText className="w-10 h-10 text-slate-200 mx-auto" />
            <p className="text-xs">
              {isBn 
                ? 'এখনও কোনো ব্যাকআপ ফাইল পাওয়া যায়নি। উপরের বাটনে ক্লিক করে বর্তমান সফটওয়্যারের একটি ব্যাকআপ ড্রাইভে সেভ করুন।'
                : 'No files found in Google Drive matching the query. Click above to save a backup now.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {files.map((file) => {
              const isJson = file.name.endsWith('.json');
              return (
                <div 
                  key={file.id} 
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isJson ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 hover:underline">
                          {file.name}
                        </span>
                        {isJson && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            Backup
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        {file.modifiedTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(file.modifiedTime).toLocaleString(isBn ? 'bn-BD' : 'en-US', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </span>
                        )}
                        {file.size && (
                          <span>• {(Number(file.size) / 1024).toFixed(1)} KB</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {isJson && (
                      <button
                        onClick={() => handleRestoreFile(file)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200 cursor-pointer"
                        title={isBn ? 'এই ব্যাকআপটি সফটওয়্যারে রিস্টোর করুন' : 'Restore this backup into software'}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isBn ? 'রিস্টোর' : 'Restore'}</span>
                      </button>
                    )}

                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                        title={isBn ? 'গুগল ড্রাইভে দেখুন' : 'View in Google Drive'}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => handleDeleteFile(file)}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title={isBn ? 'ড্রাইভ থেকে মুছে ফেলুন' : 'Delete file'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Explicit User Confirmation Modal for Destructive / Mutating Actions (MANDATORY WORKSPACE REQUIREMENT) */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {confirmDialog.title}
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {confirmDialog.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const action = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  await action();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
              >
                {confirmDialog.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
