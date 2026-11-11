import React, { useState } from 'react';
import {
  Plus,
  BookOpen,
  FileText,
  Upload,
  Sparkles,
  Trash2,
  Play,
  CheckCircle,
  FolderPlus,
  ListFilter,
  Volume2
} from 'lucide-react';
import { CustomLesson, Exercise, Language, VocabularyItem } from '../../types';
import { storageService } from '../../services/storage';
import { contentAnalyzer } from '../../services/contentAnalyzer';
import { catEngine } from '../../services/catEngine';
import { speechService } from '../../services/speech';

interface Props {
  lang: Language;
  onStartExercises: (exercises: Exercise[], title: string) => void;
}

export const OwnContentManager: React.FC<Props> = ({ lang, onStartExercises }) => {
  const [lessons, setLessons] = useState<CustomLesson[]>(() => storageService.getCustomLessons());
  const [isCreating, setIsCreating] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<CustomLesson | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('General English');
  const [unit, setUnit] = useState('Unit 1');
  const [rawText, setRawText] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'single' | 'file'>('text');

  // Single word entry helpers
  const [singleWord, setSingleWord] = useState('');
  const [singleTranslation, setSingleTranslation] = useState('');
  const [singleSentence, setSingleSentence] = useState('');

  // Handle Save New Custom Lesson
  const handleSaveLesson = () => {
    let textToAnalyze = rawText.trim();

    if (activeTab === 'single') {
      if (!singleWord.trim()) return;
      textToAnalyze = `${singleWord.trim()} - ${singleTranslation.trim()}.\n${singleSentence.trim()}`;
    }

    if (!title.trim() || !textToAnalyze) return;

    // Run real linguistic analysis
    const analysis = contentAnalyzer.analyzeText(textToAnalyze);

    // If single entry mode had explicit translation, attach it
    if (activeTab === 'single' && singleTranslation.trim() && analysis.vocabulary.length > 0) {
      analysis.vocabulary[0].translation = singleTranslation.trim();
      if (singleSentence.trim()) {
        analysis.vocabulary[0].exampleSentence = singleSentence.trim();
      }
    }

    const newLesson: CustomLesson = {
      id: `lesson_${Date.now()}`,
      title: title.trim(),
      subject: subject.trim(),
      unit: unit.trim(),
      rawText: textToAnalyze,
      vocabulary: analysis.vocabulary,
      sentences: analysis.sentences,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveCustomLesson(newLesson);
    catEngine.registerCustomVocabulary(newLesson.vocabulary);
    setLessons(storageService.getCustomLessons());

    // Reset Form
    setTitle('');
    setRawText('');
    setSingleWord('');
    setSingleTranslation('');
    setSingleSentence('');
    setIsCreating(false);
    setSelectedLesson(newLesson);
  };

  // Handle File Upload (TXT / Text based)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
        setActiveTab('text');
      }
    };
    reader.readAsText(file);
  };

  const handleDelete = (lessonId: string) => {
    storageService.deleteCustomLesson(lessonId);
    setLessons(storageService.getCustomLessons());
    if (selectedLesson?.id === lessonId) {
      setSelectedLesson(null);
    }
  };

  const handleLaunchSession = (lesson: CustomLesson) => {
    const generatedExercises = contentAnalyzer.generateExercises(lesson.vocabulary, lesson.sentences);
    onStartExercises(generatedExercises, lesson.title);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-[#F5F0E8] border border-[#E6DFD5] rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-[#1C1917] mb-1">
            {lang === 'ar' ? 'دراسة محتواي الخاص' : 'Learn My Own Content'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
            {lang === 'ar'
              ? 'أنشئ مكتبتك الشخصية للاختبارات والمذاكرة. أضف نصوصاً، مقالات، أو قوائم كلمات، وسيقوم النظام بتحليلها وتوليد 10 أنماط تفاعلية للتدريب!'
              : 'Create your personalized study library. Import text, exam prep notes, or word lists—the engine analyzes content and generates 10 interactive study modes!'}
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setSelectedLesson(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EEE7DC] text-[#1C1917] hover:bg-[#E5DFD5] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إضافة محتوى جديد' : 'New Content'}</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Lesson Library / List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {lang === 'ar' ? 'محتوياتي المحفوظة' : 'My Saved Materials'} ({lessons.length})
            </span>
          </div>

          {lessons.length === 0 ? (
            <div className="p-8 bg-white border border-dashed border-[#E6DFD5] rounded-2xl text-center space-y-3">
              <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-xs text-stone-500">
                {lang === 'ar'
                  ? 'لم تقم بإضافة أي محتوى دراسي خاص بك بعد. اضغط على "إضافة محتوى جديد" للبدء.'
                  : 'No custom study lessons saved yet. Click "New Content" to get started.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {lessons.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setIsCreating(false);
                  }}
                  className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                    selectedLesson?.id === lesson.id
                      ? 'bg-[#EEE7DC] border-stone-800 shadow-xs'
                      : 'bg-white border-[#E6DFD5] hover:bg-[#F5F0E8]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-[#1C1917] line-clamp-1">{lesson.title}</h4>
                    <span className="text-[10px] text-stone-500 bg-white/70 px-2 py-0.5 rounded-full border border-stone-200 shrink-0">
                      {lesson.vocabulary.length} {lang === 'ar' ? 'كلمات' : 'words'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-500">
                    <span>{lesson.subject}</span>
                    <span>·</span>
                    <span>{lesson.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Create Form or Selected Lesson View */}
        <div className="lg:col-span-2">
          {isCreating ? (
            /* Creation Form */
            <div className="p-6 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-3">
                <h3 className="text-base font-bold text-[#1C1917]">
                  {lang === 'ar' ? 'إضافة محتوى تعليمي جديد' : 'Add New Study Material'}
                </h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-stone-500 hover:text-stone-900"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>

              {/* Title & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {lang === 'ar' ? 'عنوان الدرس / الموضوع' : 'Lesson Title'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: كلمات الوحدة الثالثة' : 'e.g. Unit 3 Vocabulary'}
                    className="w-full p-2.5 bg-white border border-[#E6DFD5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {lang === 'ar' ? 'المادة / المرجع' : 'Subject / Source'}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. School Exam Prep"
                    className="w-full p-2.5 bg-white border border-[#E6DFD5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {lang === 'ar' ? 'الوحدة / الفصل' : 'Unit / Chapter'}
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="e.g. Chapter 2"
                    className="w-full p-2.5 bg-white border border-[#E6DFD5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Tabs for Input Method */}
              <div className="flex gap-2 border-b border-[#E6DFD5] pt-2 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'text'
                      ? 'bg-[#EEE7DC] text-[#1C1917]'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {lang === 'ar' ? 'محرر النصوص / لصق نص' : 'Text Editor / Paste'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('single')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'single'
                      ? 'bg-[#EEE7DC] text-[#1C1917]'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {lang === 'ar' ? 'إدخال كلمة مفردة' : 'Single Word Entry'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('file')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'file'
                      ? 'bg-[#EEE7DC] text-[#1C1917]'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {lang === 'ar' ? 'رفع ملف (TXT / مستند)' : 'Upload File (TXT)'}
                </button>
              </div>

              {/* Tab 1: Text Editor */}
              {activeTab === 'text' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    {lang === 'ar'
                      ? 'الصق النص الإنجليزي هنا (فقرات، حوارات، أو ملاحظات دراسية):'
                      : 'Paste your English study text here (paragraphs, dialogues, or notes):'}
                  </label>
                  <textarea
                    rows={8}
                    value={rawText}
                    onChange={e => setRawText(e.target.value)}
                    placeholder="e.g. In Hadramout, students work hard to acquire knowledge and develop practical language skills. Learning English is necessary to comprehend global opportunities..."
                    className="w-full p-3.5 bg-[#FAFAF8] border border-[#E6DFD5] rounded-2xl text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:border-stone-900 leading-relaxed font-mono"
                  />
                </div>
              )}

              {/* Tab 2: Single Word Entry */}
              {activeTab === 'single' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">
                        {lang === 'ar' ? 'الكلمة بالإنجليزية' : 'English Word'}
                      </label>
                      <input
                        type="text"
                        value={singleWord}
                        onChange={e => setSingleWord(e.target.value)}
                        placeholder="e.g. accomplishment"
                        className="w-full p-2.5 bg-white border border-[#E6DFD5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">
                        {lang === 'ar' ? 'الترجمة بالعربية' : 'Arabic Translation'}
                      </label>
                      <input
                        type="text"
                        value={singleTranslation}
                        onChange={e => setSingleTranslation(e.target.value)}
                        placeholder="مثال: إنجاز / تحقيق هدف"
                        className="w-full p-2.5 bg-white border border-[#E6DFD5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      {lang === 'ar' ? 'جملة توضيحية (اختياري)' : 'Example Sentence (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={singleSentence}
                      onChange={e => setSingleSentence(e.target.value)}
                      placeholder="e.g. Graduating with honors was a great accomplishment."
                      className="w-full p-2.5 bg-white border border-[#E6DFD5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: File Upload */}
              {activeTab === 'file' && (
                <div className="p-8 border-2 border-dashed border-[#E6DFD5] rounded-2xl text-center space-y-3">
                  <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#EEE7DC] hover:bg-[#E5DFD5] rounded-xl text-xs font-bold text-[#1C1917] transition">
                      <span>{lang === 'ar' ? 'اختيار ملف من جهازك' : 'Choose File from Device'}</span>
                      <input
                        type="file"
                        accept=".txt,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {lang === 'ar' ? 'يدعم ملفات النصوص والمذكرات الدراسية.' : 'Supports text files and study notes.'}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleSaveLesson}
                disabled={!title.trim() || (activeTab === 'text' ? !rawText.trim() : !singleWord.trim())}
                className="w-full py-3 bg-[#EEE7DC] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E5DFD5] text-[#1C1917] rounded-xl font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-stone-700" />
                <span>{lang === 'ar' ? 'تحليل المحتوى وتوليد التمارين' : 'Analyze Content & Generate Exercises'}</span>
              </button>
            </div>
          ) : selectedLesson ? (
            /* Selected Lesson Detail & Exercise Launcher */
            <div className="p-6 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-[#E6DFD5] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                    <span>{selectedLesson.subject}</span>
                    <span>·</span>
                    <span>{selectedLesson.unit}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1C1917]">{selectedLesson.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(selectedLesson.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title={lang === 'ar' ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleLaunchSession(selectedLesson)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#EEE7DC] hover:bg-[#E5DFD5] text-[#1C1917] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{lang === 'ar' ? 'بدء التمارين التفاعلية (10 أنماط)' : 'Start 10-Mode Session'}</span>
                  </button>
                </div>
              </div>

              {/* Automatic Content Analysis Summary */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {lang === 'ar' ? 'المفردات المستخرجة تلقائياً' : 'Extracted Vocabulary'} ({selectedLesson.vocabulary.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {selectedLesson.vocabulary.map((vocab, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#F5F0E8] border border-[#E6DFD5] rounded-2xl flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#1C1917]">{vocab.word}</span>
                          {vocab.ipa && <span className="text-[10px] text-stone-500 font-mono">{vocab.ipa}</span>}
                        </div>
                        <span className="text-xs text-stone-700 font-medium block mt-0.5">{vocab.translation}</span>
                        {vocab.exampleSentence && (
                          <p className="text-[11px] text-stone-500 italic mt-1 line-clamp-1">
                            "{vocab.exampleSentence}"
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => speechService.speak(vocab.word)}
                        className="p-1.5 rounded-lg text-stone-600 hover:bg-[#EEE7DC] transition shrink-0"
                        title={lang === 'ar' ? 'استمع إلى النطق' : 'Listen'}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Original Content Excerpt */}
              <div className="pt-4 border-t border-[#E6DFD5]">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  {lang === 'ar' ? 'النص الأصلي المحفوظ' : 'Original Study Text'}
                </h4>
                <div className="p-4 bg-[#FAFAF8] border border-stone-200 rounded-2xl text-xs text-stone-700 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedLesson.rawText}
                </div>
              </div>
            </div>
          ) : (
            /* Empty selection state */
            <div className="p-12 bg-white border border-[#E6DFD5] rounded-3xl text-center space-y-3">
              <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-[#1C1917]">
                {lang === 'ar' ? 'حدد درساً من القائمة أو أضف محتوى جديداً' : 'Select a lesson or add new content'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {lang === 'ar'
                  ? 'يمكنك ممارسة المفردات بـ 10 أنماط تدريبية: الاستماع، التهجئة، التوصيل، ملء الفراغات، النطق، وغيرها.'
                  : 'Practice your vocabulary with 10 interactive modes: Listening, Spelling, Matching, Fill-in-blanks, Pronunciation, and more.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
