import React from 'react';
import { Languages, User, Shield, Sparkles, BookOpen } from 'lucide-react';
import { Language, UserProfile } from '../../types';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  user: UserProfile;
  lang: Language;
  currentView: string;
  onNavigate: (view: 'dashboard' | 'own-content' | 'curriculum' | 'general' | 'srs' | 'admin') => void;
  onToggleLanguage: () => void;
  onOpenProfile: () => void;
  onOpenCatChat: () => void;
}

export const Header: React.FC<Props> = ({
  user,
  lang,
  currentView,
  onNavigate,
  onToggleLanguage,
  onOpenProfile,
  onOpenCatChat,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E6DFD5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F5F0E8] border border-[#E6DFD5] flex items-center justify-center text-[#1C1917] font-bold text-sm shadow-xs">
            إ
          </div>
          <div className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="text-lg font-extrabold tracking-tight text-[#1C1917]">
              ITQAN
            </span>
            <span className="text-xs font-bold text-stone-500">
              إتقان
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentView === 'dashboard' ? 'text-stone-900 border-b-2 border-stone-800' : 'hover:text-stone-900'
            }`}
          >
            {lang === 'ar' ? 'الرئيسية' : 'Dashboard'}
          </button>
          <button
            onClick={() => onNavigate('own-content')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentView === 'own-content' ? 'text-stone-900 border-b-2 border-stone-800' : 'hover:text-stone-900'
            }`}
          >
            {lang === 'ar' ? 'محتواي الخاص' : 'My Content'}
          </button>
          <button
            onClick={() => onNavigate('curriculum')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentView === 'curriculum' ? 'text-stone-900 border-b-2 border-stone-800' : 'hover:text-stone-900'
            }`}
          >
            {lang === 'ar' ? 'المناهج المدرسية' : 'School Curricula'}
          </button>
          <button
            onClick={() => onNavigate('general')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentView === 'general' ? 'text-stone-900 border-b-2 border-stone-800' : 'hover:text-stone-900'
            }`}
          >
            {lang === 'ar' ? 'التعلم العام' : 'General English'}
          </button>
          <button
            onClick={() => onNavigate('srs')}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentView === 'srs' ? 'text-stone-900 border-b-2 border-stone-800' : 'hover:text-stone-900'
            }`}
          >
            {lang === 'ar' ? 'المراجعة الذكية' : 'SRS Review'}
          </button>
          {user.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1 ${
                currentView === 'admin' ? 'text-stone-900 border-b-2 border-stone-800' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-stone-600" />
              <span>{lang === 'ar' ? 'الإدارة' : 'Admin'}</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions Group */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <PWAInstallButton lang={lang} />

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E6DFD5] hover:bg-[#F5F0E8] text-xs font-semibold text-stone-700 transition"
            title={lang === 'ar' ? 'التحويل إلى الإنجليزية' : 'Switch to Arabic'}
          >
            <Languages className="w-3.5 h-3.5 text-stone-500" />
            <span className="whitespace-nowrap">{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* User Profile */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-[#E6DFD5] hover:bg-[#F5F0E8] transition"
            title={lang === 'ar' ? 'الملف الشخصي والإعدادات' : 'Profile & Settings'}
          >
            <div className="w-6 h-6 rounded-lg bg-[#EEE7DC] flex items-center justify-center text-xs font-bold text-stone-800">
              {user.name.charAt(0)}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-stone-800 max-w-[100px] truncate">
              {user.name}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#E6DFD5] py-2 px-2 bg-[#FAFAF8] text-[11px] font-semibold text-stone-600 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`px-2 py-1 rounded-md ${currentView === 'dashboard' ? 'bg-[#EEE7DC] text-[#1C1917]' : ''}`}
        >
          {lang === 'ar' ? 'الرئيسية' : 'Home'}
        </button>
        <button
          onClick={() => onNavigate('own-content')}
          className={`px-2 py-1 rounded-md ${currentView === 'own-content' ? 'bg-[#EEE7DC] text-[#1C1917]' : ''}`}
        >
          {lang === 'ar' ? 'محتواي' : 'My Content'}
        </button>
        <button
          onClick={() => onNavigate('curriculum')}
          className={`px-2 py-1 rounded-md ${currentView === 'curriculum' ? 'bg-[#EEE7DC] text-[#1C1917]' : ''}`}
        >
          {lang === 'ar' ? 'المناهج' : 'Curricula'}
        </button>
        <button
          onClick={() => onNavigate('general')}
          className={`px-2 py-1 rounded-md ${currentView === 'general' ? 'bg-[#EEE7DC] text-[#1C1917]' : ''}`}
        >
          {lang === 'ar' ? 'التعلم العام' : 'General'}
        </button>
        <button
          onClick={() => onNavigate('srs')}
          className={`px-2 py-1 rounded-md ${currentView === 'srs' ? 'bg-[#EEE7DC] text-[#1C1917]' : ''}`}
        >
          {lang === 'ar' ? 'المراجعة' : 'Review'}
        </button>
        {user.role === 'admin' && (
          <button
            onClick={() => onNavigate('admin')}
            className={`px-2 py-1 rounded-md ${currentView === 'admin' ? 'bg-[#EEE7DC] text-[#1C1917]' : ''}`}
          >
            {lang === 'ar' ? 'الإدارة' : 'Admin'}
          </button>
        )}
      </div>
    </header>
  );
};
