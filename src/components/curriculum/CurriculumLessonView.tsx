import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Volume2,
  CheckCircle2,
  ShieldCheck,
  Play,
  Layers,
  Sparkles
} from 'lucide-react';
import { CurriculumLesson, Exercise, Language } from '../../types';
import { speechService } from '../../services/speech';
import { contentAnalyzer } from '../../services/contentAnalyzer';

interface Props {
  lesson: CurriculumLesson;
  lang: Language;
  onBack: () => void;
  onStartExercises: (exercises: Exercise[], title: string) => void;
}

export const CurriculumLessonView: React.FC<Props> = ({
  lesson,
  lang,
  onBack,
  onStartExercises,
}) => {
  const handleStartPractice = () => {
    // Generate exercises based on lesson vocabulary and reading sentences
    const sentences = lesson.readingPassage
      ? [{ id: 'sent_rp', english: lesson.readingPassage.text }]
      : lesson.dialogue
      ? lesson.dialogue.map((d, i) => ({ id: `d_${i}`, english: `${d.speaker}: ${d.text}` }))
      : [];

    const generated = contentAnalyzer.generateExercises(lesson.vocabulary, sentences);
    onStartExercises(generated, lang === 'ar' ? lesson.titleAr : lesson.titleEn);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-4">
      {/* Top Navigation & Verification Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E6DFD5]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-1.5 bg-[#F5F0E8] hover:bg-[#EEE7DC] rounded-xl transition"
        >
          {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{lang === 'ar' ? 'الرجوع إلى قائمة الدروس' : 'Back to Lessons'}</span>
        </button>

        <div className="flex items-center gap-3">
          {lesson.verified && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'منهج مدرسي رسمي موثق' : 'Verified Official Curriculum'}</span>
            </div>
          )}

          <button
            onClick={handleStartPractice}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#EEE7DC] hover:bg-[#E5DFD5] text-[#1C1917] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{lang === 'ar' ? 'بدء تدريبات الدرس' : 'Practice Lesson'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Header Information */}
      <div className="p-6 bg-[#F5F0E8] border border-[#E6DFD5] rounded-3xl">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
          {lesson.textbookName} · {lesson.pageReference || lesson.version}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] mb-2">
          {lang === 'ar' ? lesson.titleAr : lesson.titleEn}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {lang === 'ar' ? lesson.descriptionAr : lesson.descriptionEn}
        </p>
        <div className="mt-3 text-[11px] text-stone-500">
          <span className="font-semibold">{lang === 'ar' ? 'المرجع والجهة المصدرة: ' : 'Official Source: '}</span>
          {lesson.source}
        </div>
      </div>

      {/* Section 1: Lesson Vocabulary */}
      <div className="p-6 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-stone-700" />
            <span>{lang === 'ar' ? 'مفردات الدرس المعتمدة' : 'Lesson Vocabulary'} ({lesson.vocabulary.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lesson.vocabulary.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#F5F0E8] border border-[#E6DFD5] rounded-2xl flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#1C1917]">{item.word}</span>
                  {item.ipa && <span className="text-xs font-mono text-stone-500">{item.ipa}</span>}
                </div>
                <span className="text-xs font-semibold text-stone-800 block">{item.translation}</span>
                <p className="text-[11px] text-stone-600 italic">{item.definition}</p>
                {item.exampleSentence && (
                  <p className="text-[11px] text-stone-700 font-medium mt-1 bg-white/60 p-2 rounded-lg border border-[#E6DFD5]">
                    "{item.exampleSentence}"
                  </p>
                )}
              </div>

              <button
                onClick={() => speechService.speak(item.word)}
                className="p-2 rounded-xl bg-white border border-[#E6DFD5] text-stone-800 hover:bg-[#EEE7DC] transition shrink-0"
                title={lang === 'ar' ? 'استمع إلى النطق' : 'Listen'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Grammar Notes */}
      {lesson.grammarNotes.length > 0 && (
        <div className="p-6 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
            <Layers className="w-4 h-4 text-stone-700" />
            <span>{lang === 'ar' ? 'القواعد اللغوية والشرح' : 'Grammar Structures & Rules'}</span>
          </h3>

          <div className="space-y-4">
            {lesson.grammarNotes.map((note, idx) => (
              <div key={idx} className="p-4 bg-[#FAFAF8] border border-[#E6DFD5] rounded-2xl space-y-2">
                <h4 className="text-sm font-bold text-[#1C1917]">
                  {lang === 'ar' ? note.titleAr : note.titleEn}
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {lang === 'ar' ? note.ruleAr : note.ruleEn}
                </p>

                {note.examples.length > 0 && (
                  <div className="pt-2 border-t border-stone-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-stone-500 uppercase">
                      {lang === 'ar' ? 'أمثلة توضيحية:' : 'Examples:'}
                    </span>
                    {note.examples.map((ex, exIdx) => (
                      <div key={exIdx} className="text-xs text-stone-800 flex items-center justify-between p-2 bg-white rounded-lg border border-stone-200">
                        <span className="font-medium">{ex.en}</span>
                        <span className="text-stone-500">{ex.ar}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Dialogues / Reading Passage */}
      {lesson.dialogue && lesson.dialogue.length > 0 && (
        <div className="p-6 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#1C1917]">
            {lang === 'ar' ? 'المحادثة الصفية' : 'Classroom Dialogue'}
          </h3>

          <div className="space-y-2.5">
            {lesson.dialogue.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#F5F0E8] border border-[#E6DFD5] rounded-xl flex items-start gap-3">
                <span className="text-xs font-bold text-[#1C1917] bg-white px-2 py-0.5 rounded-md border border-[#E6DFD5] shrink-0">
                  {item.speaker}
                </span>
                <div className="flex-1 text-xs">
                  <div className="font-medium text-stone-900">{item.text}</div>
                  {item.translationAr && <div className="text-stone-500 mt-0.5">{item.translationAr}</div>}
                </div>
                <button
                  onClick={() => speechService.speak(item.text)}
                  className="p-1 text-stone-500 hover:text-stone-900"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
