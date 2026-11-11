import React, { useState } from 'react';
import { Volume2, RotateCcw, Check, X, ArrowLeft, ArrowRight, Brain, Sparkles } from 'lucide-react';
import { Language, VocabularyItem } from '../../types';
import { storageService } from '../../services/storage';
import { speechService } from '../../services/speech';
import { CatCompanion } from '../cat/CatCompanion';

interface Props {
  lang: Language;
  onClose: () => void;
  onRefreshStats: () => void;
}

export const SRSReviewQueue: React.FC<Props> = ({ lang, onClose, onRefreshStats }) => {
  const [words, setWords] = useState<VocabularyItem[]>(() => storageService.getDueSRSWords());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const currentWord = words[currentIndex];

  const handlePlayAudio = () => {
    if (currentWord) {
      speechService.speak(currentWord.word);
    }
  };

  const handleResult = (remembered: boolean) => {
    if (!currentWord) return;

    storageService.recordWordReview(currentWord.id, remembered);
    setReviewedCount(prev => prev + 1);

    if (currentIndex + 1 < words.length) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setSessionCompleted(true);
      onRefreshStats();
    }
  };

  if (words.length === 0 || sessionCompleted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-3xl border border-[#E6DFD5] shadow-xs text-center my-6">
        <CatCompanion size={84} mood="happy" bubbleText={lang === 'ar' ? 'ذاكرتك قوية جداً! 🧠' : 'Memory sharp! 🧠'} />
        <h3 className="text-lg font-bold text-[#1C1917] mt-4 mb-2">
          {lang === 'ar' ? 'لا توجد كلمات مستحقة للمراجعة حالياً!' : 'No reviews due right now!'}
        </h3>
        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
          {lang === 'ar'
            ? 'لقد راجعت جميع المفردات وفق نظام التكرار المتباعد (Spaced Repetition). ستظهر كلمات جديدة للمراجعة في مواعيدها المحددة علمياً.'
            : 'You have cleared all due flashcards using our Spaced Repetition System. Check back later as intervals progress!'}
        </p>
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#EEE7DC] text-[#1C1917] hover:bg-[#E5DFD5] rounded-xl text-xs font-bold transition"
        >
          {lang === 'ar' ? 'العودة' : 'Back'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-3xl border border-[#E6DFD5] shadow-xs my-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E6DFD5]">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-stone-700" />
          <span className="text-xs font-bold text-[#1C1917]">
            {lang === 'ar' ? 'التكرار المتباعد (SRS)' : 'Spaced Repetition'}
          </span>
        </div>
        <span className="text-xs font-semibold text-stone-500 tabular-nums">
          {currentIndex + 1} / {words.length}
        </span>
      </div>

      {/* Flashcard Area */}
      <div className="min-h-[220px] p-6 bg-[#F5F0E8] border border-[#E6DFD5] rounded-2xl flex flex-col items-center justify-center text-center relative mb-4">
        <span className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] mb-2 tracking-tight">
          {currentWord.word}
        </span>

        {currentWord.ipa && (
          <span className="text-xs font-mono text-stone-500 mb-3">{currentWord.ipa}</span>
        )}

        <button
          onClick={handlePlayAudio}
          className="p-2.5 bg-white border border-[#E6DFD5] rounded-full text-stone-800 hover:bg-[#EEE7DC] transition shadow-xs mb-3"
          title={lang === 'ar' ? 'استمع إلى النطق' : 'Listen'}
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {showAnswer ? (
          <div className="space-y-1.5 animate-fadeIn">
            <span className="text-base font-bold text-stone-900 block">{currentWord.translation}</span>
            <p className="text-xs text-stone-600 italic max-w-xs">{currentWord.definition}</p>
            {currentWord.exampleSentence && (
              <p className="text-xs text-stone-700 font-medium mt-2 bg-white/70 p-2 rounded-lg border border-[#E6DFD5]">
                "{currentWord.exampleSentence}"
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowAnswer(true)}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 bg-white/80 px-4 py-1.5 rounded-lg border border-[#E6DFD5] transition"
          >
            {lang === 'ar' ? 'اضغط لإظهار المعنى والتفاصيل' : 'Tap to reveal meaning'}
          </button>
        )}
      </div>

      {/* Action Buttons */}
      {showAnswer ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleResult(false)}
            className="flex items-center justify-center gap-1.5 py-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition"
          >
            <X className="w-4 h-4" />
            <span>{lang === 'ar' ? 'أحتاج مراجعة (قريب)' : 'Still Learning (1d)'}</span>
          </button>
          <button
            onClick={() => handleResult(true)}
            className="flex items-center justify-center gap-1.5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition"
          >
            <Check className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تذكرتها بوضوح' : 'Remembered!'}</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAnswer(true)}
          className="w-full py-3 bg-[#EEE7DC] hover:bg-[#E5DFD5] text-[#1C1917] rounded-xl text-xs font-bold transition"
        >
          {lang === 'ar' ? 'عرض الإجابة' : 'Show Answer'}
        </button>
      )}
    </div>
  );
};
