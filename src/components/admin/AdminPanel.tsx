import React, { useState } from 'react';
import {
  ShieldAlert,
  Database,
  Plus,
  BookOpen,
  Users,
  CheckCircle,
  FileText,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Trash2,
  Edit3
} from 'lucide-react';
import { CurriculumCountry, Language, UserProfile, VocabularyItem } from '../../types';
import { storageService } from '../../services/storage';

interface Props {
  lang: Language;
  onClose: () => void;
}

export const AdminPanel: React.FC<Props> = ({ lang, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'vocabulary' | 'users'>('overview');
  const [curricula, setCurricula] = useState<CurriculumCountry[]>(() => storageService.getCurricula());
  const [vocabList, setVocabList] = useState<VocabularyItem[]>(() => storageService.getVocabularyList());
  const [users, setUsers] = useState<UserProfile[]>(() => storageService.getAllUsers());

  // Form states for adding new curriculum textbook/lesson
  const [newCountryNameAr, setNewCountryNameAr] = useState('');
  const [newCountryNameEn, setNewCountryNameEn] = useState('');
  const [newFlag, setNewFlag] = useState('');

  // Vocabulary Form
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newCategory, setNewCategory] = useState('School Vocabulary');

  const handleAddVocabulary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newTranslation.trim()) return;

    const item: VocabularyItem = {
      id: `v_admin_${Date.now()}`,
      word: newWord.trim().toLowerCase(),
      translation: newTranslation.trim(),
      definition: newDefinition.trim() || `Verified educational vocabulary.`,
      partOfSpeech: 'noun',
      difficulty: 'medium',
      cefr: 'B1',
      exampleSentence: newExample.trim() || `The student learned the word "${newWord.trim()}".`,
      category: newCategory,
      source: 'ITQAN Ministerial Verification Board',
      verified: true,
      srsStage: 0,
      nextReviewDate: new Date().toISOString(),
      correctCount: 0,
      incorrectCount: 0,
    };

    const updated = [item, ...vocabList];
    setVocabList(updated);
    storageService.saveCustomLesson({
      id: `admin_lesson_${Date.now()}`,
      title: `Admin Verified: ${item.word}`,
      subject: item.category,
      unit: 'Ministerial Updates',
      rawText: `${item.word} - ${item.translation}\n${item.exampleSentence}`,
      vocabulary: [item],
      sentences: [{ id: 's1', english: item.exampleSentence }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setNewWord('');
    setNewTranslation('');
    setNewDefinition('');
    setNewExample('');
  };

  const handleToggleVerification = (countryId: string) => {
    const updated = curricula.map(c => {
      if (c.id === countryId) {
        return { ...c, verified: !c.verified };
      }
      return c;
    });
    setCurricula(updated);
    storageService.saveCurricula(updated);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 my-4">
      {/* Top Banner */}
      <div className="p-6 bg-[#F5F0E8] border border-[#E6DFD5] rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-stone-700" />
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {lang === 'ar' ? 'لوحة إدارة المنصة والاعتماد الأكاديمي' : 'Curriculum & Database Administration'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917]">
            {lang === 'ar' ? 'إدارة المناهج وقواعد البيانات التعليمية' : 'Platform Content Management System'}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-white hover:bg-[#EEE7DC] border border-[#E6DFD5] rounded-xl text-xs font-bold text-stone-700 transition"
        >
          {lang === 'ar' ? 'الرجوع إلى المنصة' : 'Exit Admin'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E6DFD5] pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-[#EEE7DC] text-[#1C1917]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{lang === 'ar' ? 'الإحصائيات والتحليلات' : 'Analytics & Stats'}</span>
        </button>
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'curriculum'
              ? 'bg-[#EEE7DC] text-[#1C1917]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'ar' ? 'اعتماد المناهج الدراسية' : 'Curriculum Accreditation'}</span>
        </button>
        <button
          onClick={() => setActiveTab('vocabulary')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'vocabulary'
              ? 'bg-[#EEE7DC] text-[#1C1917]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>{lang === 'ar' ? 'قاعدة المفردات الموثقة' : 'Verified Vocabulary'}</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-[#EEE7DC] text-[#1C1917]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{lang === 'ar' ? 'حسابات الطلاب والمعلمين' : 'Student Profiles'}</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">{lang === 'ar' ? 'إجمالي المفردات المفهرسة' : 'Indexed Vocabulary'}</span>
              <span className="text-2xl font-bold text-[#1C1917] tabular-nums">{vocabList.length}</span>
              <span className="text-[10px] text-emerald-700 block mt-1">{lang === 'ar' ? 'قابلة للبحث الفوري' : 'Search-ready'}</span>
            </div>
            <div className="p-5 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">{lang === 'ar' ? 'الدول والمناهج المعتمدة' : 'Official Curricula'}</span>
              <span className="text-2xl font-bold text-[#1C1917] tabular-nums">{curricula.length}</span>
              <span className="text-[10px] text-stone-500 block mt-1">{lang === 'ar' ? 'أولوية خاصة لليمن' : 'Yemen prioritized'}</span>
            </div>
            <div className="p-5 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">{lang === 'ar' ? 'الحسابات النشطة' : 'Active Students'}</span>
              <span className="text-2xl font-bold text-[#1C1917] tabular-nums">{users.length}</span>
              <span className="text-[10px] text-stone-500 block mt-1">{lang === 'ar' ? 'تتبع تقدم فردي' : 'Isolated profiles'}</span>
            </div>
            <div className="p-5 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">{lang === 'ar' ? 'حالة محرك القط الذكي' : 'AI Cat Engine'}</span>
              <span className="text-base font-bold text-emerald-800 block mt-1">{lang === 'ar' ? 'جاهز ومنتظم' : 'Deterministic'}</span>
              <span className="text-[10px] text-stone-500 block">{lang === 'ar' ? 'بدون تكاليف أو واجهات خارجية' : 'Zero API cost'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Curriculum Management */}
      {activeTab === 'curriculum' && (
        <div className="p-6 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#1C1917]">
            {lang === 'ar' ? 'سجلات المناهج الدراسية وحالة التحقق الوزاري' : 'Curricula Records & Verification Status'}
          </h3>

          <div className="space-y-3">
            {curricula.map(c => (
              <div
                key={c.id}
                className="p-4 bg-[#F5F0E8] border border-[#E6DFD5] rounded-2xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#1C1917]">{c.nameAr} ({c.nameEn})</h4>
                    <span className="text-xs text-stone-500">
                      {c.stages.length} {lang === 'ar' ? 'مراحل تعليمية' : 'educational stages'} · {c.lastUpdated}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      c.verified
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {c.verified ? (lang === 'ar' ? 'معتمد رسمياً' : 'Verified') : (lang === 'ar' ? 'قيد المراجعة' : 'Unverified')}
                  </span>

                  <button
                    onClick={() => handleToggleVerification(c.id)}
                    className="text-xs px-3 py-1.5 bg-white border border-[#E6DFD5] rounded-xl hover:bg-[#EEE7DC] font-semibold text-stone-700"
                  >
                    {c.verified ? (lang === 'ar' ? 'إلغاء الاعتماد' : 'Unverify') : (lang === 'ar' ? 'اعتماد المنهج' : 'Verify')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Vocabulary Management */}
      {activeTab === 'vocabulary' && (
        <div className="space-y-6">
          {/* Add Word Form */}
          <form onSubmit={handleAddVocabulary} className="p-6 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
              <Plus className="w-4 h-4 text-stone-700" />
              <span>{lang === 'ar' ? 'إضافة كلمة جديدة إلى قاعدة البيانات التعليمية' : 'Add Verified Vocabulary Word'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  {lang === 'ar' ? 'الكلمة بالإنجليزية' : 'Word'}
                </label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={e => setNewWord(e.target.value)}
                  placeholder="e.g. perseverance"
                  className="w-full p-2.5 bg-white border border-[#E6DFD5] rounded-xl text-xs text-[#1C1917]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  {lang === 'ar' ? 'الترجمة المعتمدة بالعربية' : 'Translation'}
                </label>
                <input
                  type="text"
                  required
                  value={newTranslation}
                  onChange={e => setNewTranslation(e.target.value)}
                  placeholder="مثال: مثابرة / صمود"
                  className="w-full p-2.5 bg-white border border-[#E6DFD5] rounded-xl text-xs text-[#1C1917]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  {lang === 'ar' ? 'التعريف بالإنجليزية' : 'Definition'}
                </label>
                <input
                  type="text"
                  value={newDefinition}
                  onChange={e => setNewDefinition(e.target.value)}
                  placeholder="Persistence in doing something despite difficulty."
                  className="w-full p-2.5 bg-white border border-[#E6DFD5] rounded-xl text-xs text-[#1C1917]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  {lang === 'ar' ? 'جملة توضيحية من المنهج' : 'Example Sentence'}
                </label>
                <input
                  type="text"
                  value={newExample}
                  onChange={e => setNewExample(e.target.value)}
                  placeholder="Through perseverance, the Yemeni student passed the exam."
                  className="w-full p-2.5 bg-white border border-[#E6DFD5] rounded-xl text-xs text-[#1C1917]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#EEE7DC] hover:bg-[#E5DFD5] text-[#1C1917] rounded-xl text-xs font-bold transition shadow-xs"
            >
              {lang === 'ar' ? 'حفظ الكلمة في النظام' : 'Save Verified Word'}
            </button>
          </form>

          {/* List of Words */}
          <div className="p-6 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {lang === 'ar' ? 'المفردات المفهرسة حالياً' : 'Currently Indexed Words'} ({vocabList.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {vocabList.map(v => (
                <div key={v.id} className="p-3 bg-[#F5F0E8] border border-[#E6DFD5] rounded-xl text-xs">
                  <div className="font-bold text-[#1C1917]">{v.word}</div>
                  <div className="text-stone-600">{v.translation}</div>
                  <div className="text-[10px] text-stone-400 mt-1">{v.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="p-6 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#1C1917]">
            {lang === 'ar' ? 'سجلات الطلاب والمستخدمين' : 'Registered Students & Profiles'}
          </h3>

          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="p-4 bg-[#F5F0E8] border border-[#E6DFD5] rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#1C1917]">{u.name}</h4>
                  <span className="text-xs text-stone-500">{u.email} · {u.role === 'admin' ? 'مدير نظام (Admin)' : 'طالب (Student)'}</span>
                </div>

                <div className="text-right text-xs">
                  <span className="font-bold text-amber-800 block">{u.xp} XP</span>
                  <span className="text-stone-500">{u.wordsLearned} {lang === 'ar' ? 'كلمات متعلمة' : 'words'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
