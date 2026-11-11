import React, { useState } from 'react';
import {
  Compass,
  CheckCircle,
  Star,
  Play,
  Award,
  Sparkles,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { GENERAL_LEARNING_UNITS } from '../../data/generalEnglish';
import { Exercise, GeneralLesson, Language, UserProfile } from '../../types';
import { storageService } from '../../services/storage';

interface Props {
  lang: Language;
  onStartExercises: (exercises: Exercise[], title: string) => void;
}

export const GeneralLearningPath: React.FC<Props> = ({ lang, onStartExercises }) => {
  const [user, setUser] = useState<UserProfile>(() => storageService.getCurrentUser());
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(user.currentLevel);

  const unitsForLevel = GENERAL_LEARNING_UNITS.filter(u => u.level === selectedLevel);

  const handleStartLesson = (lesson: GeneralLesson) => {
    onStartExercises(lesson.exercises, lang === 'ar' ? lesson.titleAr : lesson.titleEn);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-[#F5F0E8] border border-[#E6DFD5] rounded-3xl">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-stone-700" />
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {lang === 'ar' ? 'التعلم العام التفاعلي' : 'Interactive General English'}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] mb-2">
          {lang === 'ar' ? 'مسار تعلم متدرج وتفاعلي لجميع المستويات' : 'Progressive Interactive Learning Path'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          {lang === 'ar'
            ? 'دروس قصيرة ومركزة مع نقاط خبرة وأوسمة إنجاز، مصممة لبناء مهارات المحادثة والاستماع والقراءة والترجمة خطوة بخطوة.'
            : 'Bite-sized, focused lessons with XP, streaks, and milestones designed to build conversational fluency, listening, reading, and writing step-by-step.'}
        </p>
      </div>

      {/* Level Selector Tabs */}
      <div className="grid grid-cols-3 gap-3">
        {(['beginner', 'intermediate', 'advanced'] as const).map(lvl => {
          const isSelected = selectedLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`p-4 rounded-2xl border text-center transition ${
                isSelected
                  ? 'bg-[#EEE7DC] border-stone-800 text-[#1C1917] font-bold shadow-xs'
                  : 'bg-white border-[#E6DFD5] text-stone-700 hover:bg-[#F5F0E8] font-medium'
              }`}
            >
              <span className="text-xs sm:text-sm block">
                {lvl === 'beginner'
                  ? (lang === 'ar' ? 'المستوى المبتدئ (A1-A2)' : 'Beginner (A1-A2)')
                  : lvl === 'intermediate'
                  ? (lang === 'ar' ? 'المستوى المتوسط (B1-B2)' : 'Intermediate (B1-B2)')
                  : (lang === 'ar' ? 'المستوى المتقدم (C1-C2)' : 'Advanced (C1-C2)')}
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                {lvl === 'beginner'
                  ? (lang === 'ar' ? 'من الصفر والأساسيات' : 'Zero to Foundation')
                  : lvl === 'intermediate'
                  ? (lang === 'ar' ? 'المحادثة والسرد' : 'Narratives & Fluency')
                  : (lang === 'ar' ? 'المناظرة والدقة الأكاديمية' : 'Nuance & Academic')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Units & Learning Nodes */}
      <div className="space-y-6">
        {unitsForLevel.map(unit => (
          <div key={unit.id} className="p-6 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs space-y-4">
            <div className="flex items-start sm:items-center justify-between gap-4 border-b border-[#E6DFD5] pb-3">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  {lang === 'ar' ? `الوحدة التعليمية ${unit.unitNumber}` : `Unit ${unit.unitNumber}`}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#1C1917]">
                  {lang === 'ar' ? unit.titleAr : unit.titleEn}
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  {lang === 'ar' ? unit.descriptionAr : unit.descriptionEn}
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F0E8] border border-[#E6DFD5] text-xs font-semibold text-stone-700 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-stone-500" />
                <span>{unit.lessons.length} {lang === 'ar' ? 'دروس' : 'lessons'}</span>
              </div>
            </div>

            {/* Interactive Lesson Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {unit.lessons.map(lesson => {
                const isCompleted = user.completedLessons.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    onClick={() => handleStartLesson(lesson)}
                    className="p-4 rounded-2xl bg-[#F5F0E8] border border-[#E6DFD5] hover:border-stone-800 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white text-stone-800 border border-[#E6DFD5] group-hover:scale-105'
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-5 h-5 text-emerald-700" /> : <Play className="w-4 h-4 fill-current text-stone-800" />}
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#1C1917] group-hover:text-stone-900">
                          {lang === 'ar' ? lesson.titleAr : lesson.titleEn}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                          <span>{lesson.exercises.length} {lang === 'ar' ? 'تمارين تفاعلية' : 'exercises'}</span>
                          <span>·</span>
                          <span className="font-semibold text-amber-800">+{lesson.xpReward} XP</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 text-stone-400 group-hover:translate-x-1 transition ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
