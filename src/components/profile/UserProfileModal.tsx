import React, { useState } from 'react';
import { X, User, Shield, Download, Upload, Check, Settings, Sparkles } from 'lucide-react';
import { Language, UserProfile } from '../../types';
import { storageService } from '../../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onUserChanged: (user: UserProfile) => void;
  onLanguageChanged: (lang: Language) => void;
}

export const UserProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lang,
  onUserChanged,
  onLanguageChanged
}) => {
  const [user, setUser] = useState<UserProfile>(() => storageService.getCurrentUser());
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => storageService.getAllUsers());
  const [isRegistering, setIsRegistering] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'student' | 'admin'>('student');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoalChange = (minutes: number) => {
    const updated = { ...user, dailyGoalMinutes: minutes, dailyGoalXP: minutes * 3 };
    setUser(updated);
    storageService.saveCurrentUser(updated);
    onUserChanged(updated);
  };

  const handleRoleToggle = () => {
    const nextRole: 'student' | 'admin' = user.role === 'admin' ? 'student' : 'admin';
    const updated: UserProfile = { ...user, role: nextRole };
    setUser(updated);
    storageService.saveCurrentUser(updated);
    onUserChanged(updated);
  };

  const handleSwitchUser = (userId: string) => {
    const switched = storageService.switchUser(userId);
    setUser(switched);
    onUserChanged(switched);
  };

  const handleRegisterNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const created = storageService.registerUser(newName.trim(), newEmail.trim(), newRole);
    setUser(created);
    setAllUsers(storageService.getAllUsers());
    onUserChanged(created);
    setIsRegistering(false);
    setNewName('');
    setNewEmail('');
  };

  const handleExportData = () => {
    const jsonStr = storageService.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `itqan_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = storageService.importData(content);
        if (success) {
          setImportStatus(lang === 'ar' ? 'تم استرجاع البيانات بنجاح!' : 'Data restored successfully!');
          setUser(storageService.getCurrentUser());
          setAllUsers(storageService.getAllUsers());
          onUserChanged(storageService.getCurrentUser());
        } else {
          setImportStatus(lang === 'ar' ? 'فشل استيراد الملف. تأكد من صحة تنسيق JSON.' : 'Failed to import JSON file.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white max-w-lg w-full rounded-3xl border border-[#E6DFD5] shadow-2xl p-6 overflow-y-auto max-h-[90vh] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F5F0E8] border border-[#E6DFD5] flex items-center justify-center text-stone-800 font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1C1917]">{user.name}</h3>
              <span className="text-[11px] text-stone-500">{user.email}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-[#F5F0E8] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Switcher */}
        <div className="p-4 bg-[#F5F0E8] border border-[#E6DFD5] rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-stone-700" />
            <div>
              <span className="text-xs font-bold text-[#1C1917] block">
                {lang === 'ar' ? 'صلاحيات الحساب' : 'Account Role'}
              </span>
              <span className="text-[11px] text-stone-500">
                {user.role === 'admin'
                  ? (lang === 'ar' ? 'مدير نظام (Admin CMS)' : 'Administrator')
                  : (lang === 'ar' ? 'طالب (Student)' : 'Student')}
              </span>
            </div>
          </div>

          <button
            onClick={handleRoleToggle}
            className="px-3 py-1.5 bg-white border border-[#E6DFD5] rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#EEE7DC] transition"
          >
            {user.role === 'admin'
              ? (lang === 'ar' ? 'التحويل لطالب' : 'Switch to Student')
              : (lang === 'ar' ? 'التحويل لمدير' : 'Switch to Admin')}
          </button>
        </div>

        {/* Daily Goal Settings */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-600">
            {lang === 'ar' ? 'هدف التعلم اليومي:' : 'Daily Learning Goal:'}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 15, 20, 30].map(mins => (
              <button
                key={mins}
                onClick={() => handleGoalChange(mins)}
                className={`py-2 rounded-xl text-xs font-semibold border transition ${
                  user.dailyGoalMinutes === mins
                    ? 'bg-[#EEE7DC] border-stone-800 text-[#1C1917]'
                    : 'bg-white border-[#E6DFD5] text-stone-600 hover:bg-[#F5F0E8]'
                }`}
              >
                {mins} {lang === 'ar' ? 'دقيقة' : 'min'}
              </button>
            ))}
          </div>
        </div>

        {/* Language Preference */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-600">
            {lang === 'ar' ? 'لغة واجهة المنصة:' : 'Interface Language:'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onLanguageChanged('ar')}
              className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                lang === 'ar'
                  ? 'bg-[#EEE7DC] border-stone-800 text-[#1C1917]'
                  : 'bg-white border-[#E6DFD5] text-stone-600 hover:bg-[#F5F0E8]'
              }`}
            >
              العربية (RTL)
            </button>
            <button
              onClick={() => onLanguageChanged('en')}
              className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                lang === 'en'
                  ? 'bg-[#EEE7DC] border-stone-800 text-[#1C1917]'
                  : 'bg-white border-[#E6DFD5] text-stone-600 hover:bg-[#F5F0E8]'
              }`}
            >
              English (LTR)
            </button>
          </div>
        </div>

        {/* Multi-User Switcher & Registration */}
        <div className="pt-2 border-t border-[#E6DFD5] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600">
              {lang === 'ar' ? 'الحسابات المسجلة على هذا الجهاز' : 'Profiles on this device'}
            </span>
            <button
              onClick={() => setIsRegistering(prev => !prev)}
              className="text-xs font-semibold text-stone-700 hover:underline"
            >
              {isRegistering
                ? (lang === 'ar' ? 'إلغاء' : 'Cancel')
                : (lang === 'ar' ? '+ إضافة طالب جديد' : '+ Add New Student')}
            </button>
          </div>

          {isRegistering ? (
            <form onSubmit={handleRegisterNew} className="p-3 bg-[#F5F0E8] border border-[#E6DFD5] rounded-xl space-y-2.5">
              <div>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder={lang === 'ar' ? 'اسم الطالب الكامل' : 'Student Full Name'}
                  className="w-full p-2 bg-white border border-[#E6DFD5] rounded-lg text-xs text-[#1C1917]"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full p-2 bg-white border border-[#E6DFD5] rounded-lg text-xs text-[#1C1917]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#EEE7DC] hover:bg-[#E5DFD5] text-[#1C1917] rounded-lg text-xs font-bold transition"
              >
                {lang === 'ar' ? 'إنشاء الحساب' : 'Create Profile'}
              </button>
            </form>
          ) : (
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {allUsers.map(u => (
                <div
                  key={u.id}
                  onClick={() => handleSwitchUser(u.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    user.id === u.id
                      ? 'bg-[#EEE7DC] border-stone-800'
                      : 'bg-white border-[#E6DFD5] hover:bg-[#F5F0E8]'
                  }`}
                >
                  <div className="text-xs">
                    <span className="font-bold text-[#1C1917] block">{u.name}</span>
                    <span className="text-[10px] text-stone-500">{u.email}</span>
                  </div>
                  {user.id === u.id && (
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {lang === 'ar' ? 'الحالي' : 'Active'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Backup & Restore */}
        <div className="pt-2 border-t border-[#E6DFD5] space-y-2">
          <label className="block text-xs font-bold text-stone-600">
            {lang === 'ar' ? 'النسخ الاحتياطي واسترجاع البيانات:' : 'Data Backup & Restore:'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportData}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-[#E6DFD5] hover:bg-[#F5F0E8] rounded-xl text-xs font-semibold text-stone-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تصدير نسخة JSON' : 'Export JSON'}</span>
            </button>
            <label className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-[#E6DFD5] hover:bg-[#F5F0E8] rounded-xl text-xs font-semibold text-stone-700 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'استيراد نسخة' : 'Import JSON'}</span>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </div>
          {importStatus && (
            <p className="text-[11px] text-stone-600 text-center font-medium mt-1">{importStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
};
