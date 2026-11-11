import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exercise, Language, UserProfile } from '../../types';
import { speechService } from '../../services/speech';
import { CatCompanion } from '../cat/CatCompanion';
import { catEngine } from '../../services/catEngine';
import { storageService } from '../../services/storage';

interface Props {
  exercises: Exercise[];
  lessonTitle: string;
  lang: Language;
  onFinish: (score: { correct: number; total: number; xp: number }) => void;
  onExit: () => void;
}

export const ExerciseRunner: React.FC<Props> = ({
  exercises,
  lessonTitle,
  lang,
  onFinish,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<{ id: string; correct: boolean }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Mode specific states
  // Word matching
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  // Word ordering
  const [selectedWordOrder, setSelectedWordOrder] = useState<string[]>([]);
  // Pronunciation
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [pronunciationFeedback, setPronunciationFeedback] = useState<string>('');
  // Cat hint
  const [showHint, setShowHint] = useState(false);

  const currentExercise = exercises[currentIndex];

  useEffect(() => {
    // Reset state for next exercise
    setUserAnswer('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setSelectedLeft(null);
    setMatchedPairs([]);
    setSelectedWordOrder([]);
    setIsRecording(false);
    setPronunciationScore(null);
    setPronunciationFeedback('');
    setShowHint(false);

    // Auto play audio for listening exercise
    if (currentExercise && currentExercise.type === 'listening' && currentExercise.audioText) {
      speechService.speak(currentExercise.audioText, 0.9);
    }
  }, [currentIndex]);

  if (!currentExercise && !isFinished) {
    return null;
  }

  // Audio Play helper
  const handlePlayAudio = (rate: number = 0.9) => {
    const textToSpeak = currentExercise?.audioText || currentExercise?.targetWord || currentExercise?.correctAnswer;
    if (textToSpeak && typeof textToSpeak === 'string') {
      speechService.speak(textToSpeak, rate);
    }
  };

  // Submit Answer Check
  const handleSubmit = () => {
    if (isSubmitted) return;

    let correct = false;

    switch (currentExercise.type) {
      case 'listening':
      case 'sentence_selection':
      case 'fill_in_blank':
      case 'underline_word':
      case 'translation':
        correct = userAnswer.trim().toLowerCase() === (currentExercise.correctAnswer as string).trim().toLowerCase();
        break;

      case 'spelling':
        correct = userAnswer.trim().toLowerCase() === (currentExercise.correctAnswer as string).trim().toLowerCase();
        break;

      case 'word_matching':
        correct = matchedPairs.length === (currentExercise.matchingPairs?.length || 0);
        break;

      case 'word_ordering': {
        const assembled = selectedWordOrder.join(' ').trim().toLowerCase();
        const expected = (currentExercise.correctAnswer as string).trim().toLowerCase();
        correct = assembled === expected;
        break;
      }

      case 'pronunciation':
        correct = (pronunciationScore || 0) >= 65;
        break;

      case 'writing': {
        const written = (userAnswer as string).trim().toLowerCase();
        const requiredWords = Array.isArray(currentExercise.correctAnswer)
          ? currentExercise.correctAnswer
          : [currentExercise.correctAnswer];
        // Must contain required vocabulary and be at least 3 words
        const containsRequired = requiredWords.some(rw => written.includes(rw.toLowerCase()));
        correct = containsRequired && written.split(/\s+/).length >= 3;
        break;
      }
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    // Save in session history
    setScoreHistory(prev => [...prev, { id: currentExercise.id, correct }]);

    // Update Spaced Repetition if target word is known
    if (currentExercise.targetWord) {
      const vocabList = storageService.getVocabularyList();
      const matched = vocabList.find(v => v.word.toLowerCase() === currentExercise.targetWord?.toLowerCase());
      if (matched) {
        storageService.recordWordReview(matched.id, correct);
      }
    }

    // Play subtle audio confirmation
    if (correct) {
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
      } catch (_) {}
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed all exercises!
      setIsFinished(true);
      const totalCorrect = scoreHistory.filter(s => s.correct).length + (isCorrect ? 1 : 0);
      const earnedXP = totalCorrect * 10;
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (_) {}
      onFinish({
        correct: totalCorrect,
        total: exercises.length,
        xp: earnedXP,
      });
    }
  };

  // Word Matching click handler
  const handleMatchClick = (side: 'left' | 'right', text: string) => {
    if (isSubmitted) return;

    if (side === 'left') {
      setSelectedLeft(text);
    } else if (side === 'right' && selectedLeft) {
      // Check if pair matches
      const targetPair = currentExercise.matchingPairs?.find(p => p.left === selectedLeft && p.right === text);
      if (targetPair) {
        setMatchedPairs(prev => [...prev, selectedLeft]);
        setSelectedLeft(null);
      } else {
        // Mismatch feedback
        setSelectedLeft(null);
      }
    }
  };

  // Pronunciation handler
  const handleStartRecording = async () => {
    if (isRecording) return;
    setIsRecording(true);
    setPronunciationFeedback(lang === 'ar' ? 'جارٍ الاستماع لنطقك...' : 'Listening to your speech...');

    const result = await speechService.listenForPronunciation(currentExercise.targetWord || 'hello');
    setIsRecording(false);
    setPronunciationScore(result.accuracy);
    setPronunciationFeedback(lang === 'ar' ? result.feedbackAr : result.feedbackEn);
    setUserAnswer(result.transcript);
  };

  // If session finished, show summary view
  if (isFinished) {
    const totalCorrect = scoreHistory.filter(s => s.correct).length;
    const accuracy = Math.round((totalCorrect / exercises.length) * 100);

    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl border border-[#E6DFD5] shadow-lg text-center my-8">
        <CatCompanion size={110} mood="celebrating" bubbleText={lang === 'ar' ? 'أحسنت صنعاً! 🎉' : 'Awesome job! 🎉'} />
        <h2 className="text-2xl font-bold text-[#1C1917] mt-4 mb-1">
          {lang === 'ar' ? 'اكتملت الجلسة التعليمية بنجاح!' : 'Lesson Completed!'}
        </h2>
        <p className="text-sm text-stone-600 mb-6">{lessonTitle}</p>

        <div className="grid grid-cols-3 gap-3 p-4 bg-[#F5F0E8] rounded-2xl mb-6">
          <div className="p-3 bg-white rounded-xl border border-[#E6DFD5]">
            <span className="text-xs text-stone-500 block mb-1">{lang === 'ar' ? 'الإجابات الصحيحة' : 'Correct'}</span>
            <span className="text-lg font-bold text-emerald-700">{totalCorrect} / {exercises.length}</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E6DFD5]">
            <span className="text-xs text-stone-500 block mb-1">{lang === 'ar' ? 'نسبة الدقة' : 'Accuracy'}</span>
            <span className="text-lg font-bold text-stone-900">{accuracy}%</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E6DFD5]">
            <span className="text-xs text-stone-500 block mb-1">{lang === 'ar' ? 'نقاط الخبرة' : 'XP Earned'}</span>
            <span className="text-lg font-bold text-amber-700">+{totalCorrect * 10} XP</span>
          </div>
        </div>

        <button
          onClick={onExit}
          className="w-full py-3.5 bg-[#EEE7DC] text-[#1C1917] hover:bg-[#E5DFD5] rounded-xl font-bold text-sm shadow-xs transition"
        >
          {lang === 'ar' ? 'العودة إلى لوحة التحكم' : 'Return to Dashboard'}
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex) / exercises.length) * 100);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-3xl border border-[#E6DFD5] shadow-xs my-4">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          onClick={onExit}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 px-2 py-1 rounded-lg hover:bg-[#F5F0E8]"
        >
          {lang === 'ar' ? 'خروج' : 'Exit'}
        </button>

        {/* Progress Bar */}
        <div className="flex-1 max-w-xs bg-[#F5F0E8] h-2.5 rounded-full overflow-hidden border border-[#E6DFD5]">
          <div
            className="bg-[#D5CCC0] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className="text-xs font-semibold text-stone-600 tabular-nums">
          {currentIndex + 1} / {exercises.length}
        </span>
      </div>

      {/* Cat Companion & Contextual Hint */}
      <div className="flex items-center justify-between mb-4 p-3 bg-[#F5F0E8] rounded-2xl border border-[#E6DFD5]">
        <div className="flex items-center gap-3">
          <CatCompanion
            size={46}
            mood={isSubmitted ? (isCorrect ? 'happy' : 'sad') : 'idle'}
            interactive={false}
          />
          <div>
            <span className="text-xs font-bold text-[#1C1917] block">
              {lang === 'ar' ? 'القط رفيقك التعليمي' : 'AI Cat Companion'}
            </span>
            <span className="text-[11px] text-stone-500">
              {catEngine.getContextualHint(currentExercise.type, lang)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowHint(prev => !prev)}
          className="p-1.5 rounded-lg text-stone-600 hover:bg-[#EEE7DC] transition"
          title={lang === 'ar' ? 'تلميح' : 'Hint'}
        >
          <Lightbulb className="w-4 h-4" />
        </button>
      </div>

      {showHint && (
        <div className="mb-4 p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-900 leading-relaxed">
          {lang === 'ar' ? currentExercise.explanationAr : currentExercise.explanationEn}
        </div>
      )}

      {/* Exercise Prompt */}
      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-bold text-[#1C1917] mb-1">
          {lang === 'ar' ? currentExercise.promptAr : currentExercise.promptEn}
        </h3>
        {currentExercise.sentenceContext && currentExercise.type !== 'fill_in_blank' && (
          <p className="text-sm text-stone-600 bg-[#FAFAF8] p-3 rounded-xl border border-stone-200 mt-2">
            {currentExercise.sentenceContext}
          </p>
        )}
      </div>

      {/* MODE SPECIFIC RENDERERS */}

      {/* 1. Listening Mode */}
      {currentExercise.type === 'listening' && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 py-6 bg-[#F5F0E8] rounded-2xl border border-[#E6DFD5]">
            <button
              onClick={() => handlePlayAudio(0.9)}
              className="p-4 bg-white hover:bg-[#EEE7DC] border border-[#E6DFD5] text-stone-900 rounded-full shadow-xs transition"
              title={lang === 'ar' ? 'تشغيل الصوت بالسرعة العادية' : 'Play audio'}
            >
              <Volume2 className="w-6 h-6 text-stone-800" />
            </button>
            <button
              onClick={() => handlePlayAudio(0.7)}
              className="px-3 py-1.5 bg-white hover:bg-[#EEE7DC] border border-[#E6DFD5] text-xs font-semibold rounded-lg text-stone-700"
              title={lang === 'ar' ? 'تشغيل الصوت ببطء' : 'Play slowly'}
            >
              0.7x {lang === 'ar' ? 'بطيء' : 'Slow'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentExercise.options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => setUserAnswer(opt)}
                disabled={isSubmitted}
                className={`p-3.5 rounded-xl text-sm font-medium border text-left transition ${
                  userAnswer === opt
                    ? 'border-stone-900 bg-[#EEE7DC] text-[#1C1917]'
                    : 'border-[#E6DFD5] bg-white text-stone-800 hover:bg-[#F5F0E8]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Spelling Mode */}
      {currentExercise.type === 'spelling' && (
        <div className="space-y-4">
          <div className="flex items-center justify-center py-4 bg-[#F5F0E8] rounded-2xl border border-[#E6DFD5]">
            <button
              onClick={() => handlePlayAudio(0.85)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#EEE7DC] border border-[#E6DFD5] text-xs font-bold text-stone-800 rounded-xl"
            >
              <Volume2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'استمع إلى الكلمة مجدداً' : 'Replay Word'}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">
              {lang === 'ar' ? 'اكتب الكلمة الإنجليزية بالتهجئة الصحيحة:' : 'Type the correct spelling in English:'}
            </label>
            <input
              type="text"
              autoFocus
              disabled={isSubmitted}
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              placeholder="e.g. beautiful"
              className="w-full text-center tracking-widest text-lg font-mono p-3 bg-white border border-[#E6DFD5] rounded-xl focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>
      )}

      {/* 3. Sentence Selection / Translation Mode */}
      {(currentExercise.type === 'sentence_selection' || currentExercise.type === 'translation') && (
        <div className="space-y-2.5">
          {currentExercise.options?.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setUserAnswer(opt)}
              disabled={isSubmitted}
              className={`w-full p-4 rounded-xl text-sm font-medium text-left border transition ${
                userAnswer === opt
                  ? 'border-stone-900 bg-[#EEE7DC] text-[#1C1917]'
                  : 'border-[#E6DFD5] bg-white text-stone-800 hover:bg-[#F5F0E8]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* 4. Word Matching Mode */}
      {currentExercise.type === 'word_matching' && (
        <div className="space-y-4">
          <p className="text-xs text-stone-500">
            {lang === 'ar'
              ? 'اضغط على كلمة بالإنجليزية ثم اضغط على ترجمتها الصحيحة بالعربية:'
              : 'Tap an English word, then tap its Arabic match:'}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Left side (English) */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-400 block px-1">English</span>
              {currentExercise.matchingPairs?.map(pair => {
                const isMatched = matchedPairs.includes(pair.left);
                const isSelected = selectedLeft === pair.left;
                return (
                  <button
                    key={pair.id}
                    disabled={isMatched || isSubmitted}
                    onClick={() => handleMatchClick('left', pair.left)}
                    className={`w-full p-3 rounded-xl text-xs font-semibold border text-center transition ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 opacity-60'
                        : isSelected
                        ? 'bg-[#EEE7DC] border-stone-900 text-[#1C1917]'
                        : 'bg-white border-[#E6DFD5] text-stone-800 hover:bg-[#F5F0E8]'
                    }`}
                  >
                    {pair.left}
                  </button>
                );
              })}
            </div>

            {/* Right side (Arabic) */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-400 block px-1">العربية</span>
              {currentExercise.matchingPairs?.map(pair => {
                const isMatched = matchedPairs.includes(pair.left);
                return (
                  <button
                    key={`ar_${pair.id}`}
                    disabled={isMatched || isSubmitted}
                    onClick={() => handleMatchClick('right', pair.right)}
                    className={`w-full p-3 rounded-xl text-xs font-semibold border text-center transition ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 opacity-60'
                        : 'bg-white border-[#E6DFD5] text-stone-800 hover:bg-[#F5F0E8]'
                    }`}
                  >
                    {pair.right}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. Fill in the Blanks Mode */}
      {currentExercise.type === 'fill_in_blank' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#F5F0E8] rounded-2xl border border-[#E6DFD5] text-center text-base font-medium text-[#1C1917]">
            {currentExercise.sentenceContext?.replace('_____', `[ ${userAnswer || '______'} ]`)}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {currentExercise.options?.map((opt, idx) => (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => setUserAnswer(opt)}
                className={`p-3 rounded-xl text-xs font-semibold border transition ${
                  userAnswer === opt
                    ? 'border-stone-900 bg-[#EEE7DC] text-[#1C1917]'
                    : 'border-[#E6DFD5] bg-white text-stone-800 hover:bg-[#F5F0E8]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. Underline the Correct Word Mode */}
      {currentExercise.type === 'underline_word' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#F5F0E8] rounded-2xl border border-[#E6DFD5] text-sm text-[#1C1917]">
            {currentExercise.sentenceContext}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {currentExercise.optionsContext?.map((wordOpt, i) => (
              <button
                key={i}
                disabled={isSubmitted}
                onClick={() => setUserAnswer(wordOpt)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                  userAnswer === wordOpt
                    ? 'border-stone-900 bg-[#EEE7DC] text-[#1C1917] underline'
                    : 'border-[#E6DFD5] bg-white text-stone-800 hover:bg-[#F5F0E8]'
                }`}
              >
                {wordOpt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 7. Pronunciation Mode */}
      {currentExercise.type === 'pronunciation' && (
        <div className="space-y-4 text-center">
          <div className="p-6 bg-[#F5F0E8] rounded-2xl border border-[#E6DFD5]">
            <span className="text-2xl font-bold text-[#1C1917] block mb-1">
              {currentExercise.targetWord}
            </span>
            <button
              onClick={() => handlePlayAudio(0.85)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E6DFD5] rounded-lg text-xs text-stone-700 hover:bg-[#EEE7DC] transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'استمع إلى النطق النموذجي' : 'Listen to model pronunciation'}</span>
            </button>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleStartRecording}
              disabled={isRecording || isSubmitted}
              className={`p-5 rounded-full shadow-md transition-transform duration-200 ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse scale-110'
                  : 'bg-[#EEE7DC] hover:bg-[#E5DFD5] text-[#1C1917]'
              }`}
            >
              {isRecording ? <Mic className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
            <span className="text-xs text-stone-500 font-medium">
              {isRecording
                ? (lang === 'ar' ? 'جارٍ التسجيل... تكلم الآن' : 'Recording... Speak now')
                : (lang === 'ar' ? 'اضغط وتحدث بوضوح في الميكروفون' : 'Tap to speak into microphone')}
            </span>
          </div>

          {pronunciationFeedback && (
            <div className="p-3 bg-white border border-[#E6DFD5] rounded-xl text-xs leading-relaxed text-stone-800">
              {pronunciationScore !== null && (
                <div className="font-bold text-sm mb-1 text-stone-900">
                  {lang === 'ar' ? `درجة النطق: ${pronunciationScore}%` : `Pronunciation Score: ${pronunciationScore}%`}
                </div>
              )}
              {pronunciationFeedback}
            </div>
          )}
        </div>
      )}

      {/* 8. Word Ordering Mode */}
      {currentExercise.type === 'word_ordering' && (
        <div className="space-y-4">
          {/* Output Sentence Line */}
          <div className="min-h-[56px] p-3.5 bg-[#F5F0E8] border border-[#E6DFD5] rounded-2xl flex flex-wrap gap-2 items-center">
            {selectedWordOrder.length === 0 ? (
              <span className="text-xs text-stone-400">
                {lang === 'ar' ? 'اضغط على الكلمات المبعثرة بالترتيب الصحيح...' : 'Tap the words below in order...'}
              </span>
            ) : (
              selectedWordOrder.map((word, idx) => (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => {
                    setSelectedWordOrder(prev => prev.filter((_, i) => i !== idx));
                  }}
                  className="px-3 py-1.5 bg-white border border-[#E6DFD5] rounded-lg text-xs font-semibold text-stone-800 hover:border-rose-300"
                >
                  {word}
                </button>
              ))
            )}
          </div>

          {/* Word Pool */}
          <div className="flex flex-wrap gap-2 justify-center">
            {currentExercise.scrambledWords?.map((word, idx) => {
              const isUsed = selectedWordOrder.filter(w => w === word).length >=
                (currentExercise.scrambledWords?.filter(w => w === word).length || 1);
              return (
                <button
                  key={idx}
                  disabled={isUsed || isSubmitted}
                  onClick={() => {
                    setSelectedWordOrder(prev => [...prev, word]);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                    isUsed
                      ? 'opacity-30 border-dashed border-stone-300 bg-stone-100'
                      : 'bg-white border-[#E6DFD5] text-stone-800 hover:bg-[#F5F0E8]'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {selectedWordOrder.length > 0 && !isSubmitted && (
            <button
              onClick={() => setSelectedWordOrder([])}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إعادة تعيين الكلمات' : 'Reset words'}</span>
            </button>
          )}
        </div>
      )}

      {/* 9. Writing Practice Mode */}
      {currentExercise.type === 'writing' && (
        <div className="space-y-4">
          <p className="text-xs text-stone-600">
            {lang === 'ar'
              ? 'اكتب جملة باللغة الإنجليزية في المربع أدناه:'
              : 'Write a sentence in English in the box below:'}
          </p>

          <textarea
            rows={3}
            disabled={isSubmitted}
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Type your sentence here..."
            className="w-full p-3.5 bg-white border border-[#E6DFD5] rounded-xl text-sm text-[#1C1917] focus:outline-none focus:border-stone-900"
          />
        </div>
      )}

      {/* Bottom Action / Feedback Bar */}
      <div className="mt-6 pt-4 border-t border-[#E6DFD5]">
        {isSubmitted ? (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-2xl flex items-start gap-3 ${
                isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm">
                <div className="font-bold mb-1">
                  {isCorrect
                    ? (lang === 'ar' ? 'إجابة صحيحة ومتقنة! 🎉' : 'Correct! Great job! 🎉')
                    : (lang === 'ar' ? 'إجابة غير دقيقة' : 'Not quite right')}
                </div>
                <div>{lang === 'ar' ? currentExercise.explanationAr : currentExercise.explanationEn}</div>
                {!isCorrect && currentExercise.correctAnswer && typeof currentExercise.correctAnswer === 'string' && (
                  <div className="mt-1 font-semibold text-stone-800">
                    {lang === 'ar' ? 'الإجابة النموذجية: ' : 'Correct answer: '}
                    <span className="font-mono">{currentExercise.correctAnswer}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-[#EEE7DC] text-[#1C1917] hover:bg-[#E5DFD5] rounded-xl font-bold text-sm shadow-xs transition flex items-center justify-center gap-2"
            >
              <span>{currentIndex + 1 < exercises.length ? (lang === 'ar' ? 'التالي' : 'Next') : (lang === 'ar' ? 'عرض النتيجة' : 'See Results')}</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={
              currentExercise.type === 'word_matching'
                ? matchedPairs.length === 0
                : currentExercise.type === 'word_ordering'
                ? selectedWordOrder.length === 0
                : currentExercise.type === 'pronunciation'
                ? pronunciationScore === null
                : !userAnswer
            }
            className="w-full py-3.5 bg-[#EEE7DC] disabled:opacity-40 disabled:cursor-not-allowed text-[#1C1917] hover:bg-[#E5DFD5] rounded-xl font-bold text-sm shadow-xs transition"
          >
            {lang === 'ar' ? 'تحقق من الإجابة' : 'Check Answer'}
          </button>
        )}
      </div>
    </div>
  );
};
