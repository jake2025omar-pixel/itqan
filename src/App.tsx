import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { CatCompanion } from './components/cat/CatCompanion';
import { CatChatModal } from './components/cat/CatChatModal';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { OwnContentManager } from './components/own-content/OwnContentManager';
import { CurriculumBrowser } from './components/curriculum/CurriculumBrowser';
import { GeneralLearningPath } from './components/general/GeneralLearningPath';
import { SRSReviewQueue } from './components/srs/SRSReviewQueue';
import { AdminPanel } from './components/admin/AdminPanel';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { ExerciseRunner } from './components/exercises/ExerciseRunner';
import { Exercise, Language, UserProfile } from './types';
import { storageService } from './services/storage';

export function App() {
  const [lang, setLang] = useState<Language>(() => storageService.getLanguage());
  const [user, setUser] = useState<UserProfile>(() => storageService.getCurrentUser());
  const [currentView, setCurrentView] = useState<'dashboard' | 'own-content' | 'curriculum' | 'general' | 'srs' | 'admin'>('dashboard');

  // Modals
  const [isCatChatOpen, setIsCatChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Active Exercise Runner
  const [activeExercises, setActiveExercises] = useState<Exercise[] | null>(null);
  const [activeLessonTitle, setActiveLessonTitle] = useState<string>('');

  // Spaced Repetition Due Count
  const [dueSRSCount, setDueSRSCount] = useState<number>(() => storageService.getDueSRSWords().length);

  // Sync document language & direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const handleToggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    storageService.setLanguage(nextLang);
  };

  const handleStartExercises = (exercises: Exercise[], title: string) => {
    if (exercises.length === 0) return;
    setActiveExercises(exercises);
    setActiveLessonTitle(title);
  };

  const handleFinishExercises = (score: { correct: number; total: number; xp: number }) => {
    storageService.recordLessonCompletion(`session_${Date.now()}`, score.xp);
    setUser(storageService.getCurrentUser());
    setDueSRSCount(storageService.getDueSRSWords().length);
  };

  const handleExitExercises = () => {
    setActiveExercises(null);
    setActiveLessonTitle('');
    setUser(storageService.getCurrentUser());
    setDueSRSCount(storageService.getDueSRSWords().length);
  };

  return (
    <div className="min-h-screen bg-white text-[#1C1917] flex flex-col font-sans selection:bg-[#EEE7DC]">
      {/* Top Bar Header */}
      <Header
        user={user}
        lang={lang}
        currentView={currentView}
        onNavigate={(view) => {
          setActiveExercises(null);
          setCurrentView(view);
        }}
        onToggleLanguage={handleToggleLanguage}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCatChat={() => setIsCatChatOpen(true)}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeExercises ? (
          /* Exercise Runner Mode */
          <ExerciseRunner
            exercises={activeExercises}
            lessonTitle={activeLessonTitle}
            lang={lang}
            onFinish={handleFinishExercises}
            onExit={handleExitExercises}
          />
        ) : (
          /* Page Views */
          <>
            {currentView === 'dashboard' && (
              <DashboardHome
                user={user}
                lang={lang}
                dueSRSCount={dueSRSCount}
                onSelectMethod={(method) => {
                  if (method === 'srs') setCurrentView('srs');
                  else setCurrentView(method);
                }}
                onOpenCatChat={() => setIsCatChatOpen(true)}
              />
            )}

            {currentView === 'own-content' && (
              <OwnContentManager
                lang={lang}
                onStartExercises={handleStartExercises}
              />
            )}

            {currentView === 'curriculum' && (
              <CurriculumBrowser
                lang={lang}
                onStartExercises={handleStartExercises}
              />
            )}

            {currentView === 'general' && (
              <GeneralLearningPath
                lang={lang}
                onStartExercises={handleStartExercises}
              />
            )}

            {currentView === 'srs' && (
              <SRSReviewQueue
                lang={lang}
                onClose={() => setCurrentView('dashboard')}
                onRefreshStats={() => {
                  setUser(storageService.getCurrentUser());
                  setDueSRSCount(storageService.getDueSRSWords().length);
                }}
              />
            )}

            {currentView === 'admin' && (
              <AdminPanel
                lang={lang}
                onClose={() => setCurrentView('dashboard')}
              />
            )}
          </>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-[#E6DFD5] py-8 bg-[#FAFAF8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">ITQAN (إتقان)</span>
            <span>·</span>
            <span>
              {lang === 'ar'
                ? 'المنصة الذكية الشاملة لتعليم الإنجليزية — مخصصة لطلاب الجمهورية اليمنية والعالم العربي'
                : 'Intelligent English Learning Platform — Dedicated to Yemeni & Arab students'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCatChatOpen(true)}
              className="hover:text-stone-900 transition font-medium"
            >
              {lang === 'ar' ? 'الرفيق الذكي إتقان' : 'AI Cat Companion'}
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setActiveExercises(null);
                setCurrentView('curriculum');
              }}
              className="hover:text-stone-900 transition font-medium"
            >
              {lang === 'ar' ? 'مناهج حضرموت وعدن' : 'Hadramout & Aden Curricula'}
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Cat Companion Action Button */}
      {!activeExercises && (
        <div className={`fixed bottom-5 z-40 ${lang === 'ar' ? 'left-5' : 'right-5'}`}>
          <CatCompanion
            size={68}
            mood="idle"
            interactive={true}
            onClick={() => setIsCatChatOpen(true)}
            bubbleText={lang === 'ar' ? 'اسألني أي شيء! 🐾' : 'Ask me anything! 🐾'}
          />
        </div>
      )}

      {/* Cat Chat Modal */}
      <CatChatModal
        isOpen={isCatChatOpen}
        onClose={() => setIsCatChatOpen(false)}
        lang={lang}
      />

      {/* Profile & Settings Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        lang={lang}
        onUserChanged={(updated) => setUser(updated)}
        onLanguageChanged={(newLang) => {
          setLang(newLang);
          storageService.setLanguage(newLang);
        }}
      />

      {/* Offline Indicator Toast */}
      <OfflineIndicator lang={lang} />
    </div>
  );
}

export default App;
