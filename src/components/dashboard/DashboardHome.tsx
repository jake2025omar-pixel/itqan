import React from 'react';
import {
  FileEdit,
  GraduationCap,
  Compass,
  Flame,
  Target,
  BookOpen,
  Award,
  ArrowRight,
  ArrowLeft,
  Brain,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Language, UserProfile } from '../../types';
import { CatCompanion } from '../cat/CatCompanion';

interface Props {
  user: UserProfile;
  lang: Language;
  dueSRSCount: number;
  onSelectMethod: (method: 'own-content' | 'curriculum' | 'general' | 'srs') => void;
  onOpenCatChat: () => void;
}

export const DashboardHome: React.FC<Props> = ({
  user,
  lang,
  dueSRSCount,
  onSelectMethod,
  onOpenCatChat,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome & Stats Strip */}
      <div className="p-6 sm:p-8 bg-[#F5F0E8] border border-[#E6DFD5] rounded-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600 bg-white/80 px-2.5 py-1 rounded-full border border-[#E6DFD5]">
                {lang === 'ar' ? 'منصة إتقان الذكية' : 'ITQAN Learning Ecosystem'}
              </span>
              <span className="text-xs text-stone-500">
                {lang === 'ar' ? 'مرحباً بعودتك،' : 'Welcome back,'} <strong className="text-stone-900">{user.name}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">
              {lang === 'ar'
                ? 'طريقك لإتقان اللغة الإنجليزية بثقة واقتدار'
                : 'Master English with Precision, Fluency & Confidence'}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {lang === 'ar'
                ? 'تعلم من خلال المناهج المدرسية اليمنية والعربية، أو ارفع محتواك الدراسي الخاص، أو انطلق في مسارات تفاعلية متدرجة.'
                : 'Learn through official Yemeni and Arab curricula, study your custom examination content, or follow interactive structured paths.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectMethod('curriculum')}
                className="px-5 py-2.5 bg-[#EEE7DC] hover:bg-[#E5DFD5] text-[#1C1917] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-2"
              >
                <span>{lang === 'ar' ? 'متابعة التعلم اليومي' : 'Continue Learning'}</span>
                {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                onClick={onOpenCatChat}
                className="px-4 py-2.5 bg-white hover:bg-[#F5F0E8] border border-[#E6DFD5] text-stone-800 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-stone-600" />
                <span>{lang === 'ar' ? 'استشر القط الرمادي' : 'Ask Gray Cat'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Cat Mascot in Hero */}
          <div className="flex flex-col items-center gap-2 shrink-0 self-center md:self-auto">
            <CatCompanion
              size={96}
              mood="idle"
              interactive={true}
              onClick={onOpenCatChat}
              bubbleText={lang === 'ar' ? 'جاهز لمساعدتك! 🐾' : 'Ready to help! 🐾'}
            />
            <span className="text-[11px] font-semibold text-stone-500">
              {lang === 'ar' ? 'انقر للدردشة مع الرفيق الذكي' : 'Tap to chat with companion'}
            </span>
          </div>
        </div>

        {/* Learning Progress Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#E6DFD5]">
          <div className="p-3.5 bg-white/80 rounded-2xl border border-[#E6DFD5]">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'ar' ? 'أيام الاستمرار' : 'Daily Streak'}</span>
            </div>
            <span className="text-xl font-extrabold text-[#1C1917] tabular-nums">
              {user.streak} {lang === 'ar' ? 'أيام' : 'days'}
            </span>
          </div>

          <div className="p-3.5 bg-white/80 rounded-2xl border border-[#E6DFD5]">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
              <Award className="w-3.5 h-3.5 text-stone-600" />
              <span>{lang === 'ar' ? 'مجموع النقاط' : 'Total XP'}</span>
            </div>
            <span className="text-xl font-extrabold text-[#1C1917] tabular-nums">
              {user.xp} XP
            </span>
          </div>

          <div className="p-3.5 bg-white/80 rounded-2xl border border-[#E6DFD5]">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-stone-600" />
              <span>{lang === 'ar' ? 'الكلمات المتقنة' : 'Mastered Words'}</span>
            </div>
            <span className="text-xl font-extrabold text-[#1C1917] tabular-nums">
              {user.wordsMastered} {lang === 'ar' ? 'كلمة' : 'words'}
            </span>
          </div>

          <div className="p-3.5 bg-white/80 rounded-2xl border border-[#E6DFD5]">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-stone-600" />
              <span>{lang === 'ar' ? 'هدف اليوم' : 'Daily Goal'}</span>
            </div>
            <span className="text-xl font-extrabold text-[#1C1917] tabular-nums">
              {user.dailyGoalMinutes} {lang === 'ar' ? 'دقيقة' : 'min'}
            </span>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Notification Banner if words due */}
      {dueSRSCount > 0 && (
        <div className="p-4 bg-white border border-[#E6DFD5] rounded-2xl shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F0E8] border border-[#E6DFD5] flex items-center justify-center text-stone-700">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1917]">
                {lang === 'ar'
                  ? `لديك ${dueSRSCount} كلمات مستحقة للمراجعة الذكية (SRS)!`
                  : `You have ${dueSRSCount} words due for spaced repetition review!`}
              </h4>
              <p className="text-xs text-stone-500">
                {lang === 'ar'
                  ? 'المراجعة المنتظمة تنقل المفردات من الذاكرة اللحظية إلى الذاكرة الدائمة.'
                  : 'Regular spaced review transfers vocabulary into long-term memory.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectMethod('srs')}
            className="px-4 py-2 bg-[#EEE7DC] hover:bg-[#E5DFD5] text-[#1C1917] text-xs font-bold rounded-xl transition shrink-0"
          >
            {lang === 'ar' ? 'ابدأ المراجعة' : 'Review Now'}
          </button>
        </div>
      )}

      {/* The Three Main Learning Method Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-[#1C1917]">
            {lang === 'ar' ? 'أنظمة التعلم الثلاثة الرئيسية' : 'Three Core Learning Systems'}
          </h2>
          <span className="text-xs text-stone-500">
            {lang === 'ar' ? 'اختر النظام المناسب لأهدافك' : 'Choose a method that fits your goal'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Learn My Own Content */}
          <div
            onClick={() => onSelectMethod('own-content')}
            className="group p-6 bg-white border border-[#E6DFD5] hover:border-stone-800 rounded-3xl shadow-xs transition duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F5F0E8] border border-[#E6DFD5] flex items-center justify-center text-stone-800 group-hover:scale-105 transition">
                <FileEdit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917]">
                {lang === 'ar' ? '١. دراسة محتواي الخاص' : '1. Learn My Own Content'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {lang === 'ar'
                  ? 'أنشئ مكتبتك الخاصة للاختبارات والمذاكرة. الصق نصوصك ومذكراتك، وسيقوم النظام بتحليل المفردات والقواعد تلقائياً مع 10 أنماط تدريبية.'
                  : 'Build your personal library. Paste your exam notes, articles, or vocabulary lists. Our engine automatically analyzes grammar and generates 10 exercise modes.'}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-[#E6DFD5] flex items-center justify-between text-xs font-bold text-[#1C1917]">
              <span>{lang === 'ar' ? 'فتح المحتوى الخاص' : 'Open My Library'}</span>
              {lang === 'ar' ? (
                <ArrowLeft className="w-4 h-4 text-stone-500 group-hover:-translate-x-1 transition" />
              ) : (
                <ArrowRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 transition" />
              )}
            </div>
          </div>

          {/* Card 2: School Curricula */}
          <div
            onClick={() => onSelectMethod('curriculum')}
            className="group p-6 bg-white border border-[#E6DFD5] hover:border-stone-800 rounded-3xl shadow-xs transition duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F5F0E8] border border-[#E6DFD5] flex items-center justify-center text-stone-800 group-hover:scale-105 transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917]">
                {lang === 'ar' ? '٢. المناهج المدرسية والوزارية' : '2. School Curricula'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {lang === 'ar'
                  ? 'مناهج منظمة حسب الهيكل الرسمي المعتمد. أولوية لليمن (حضرموت، عدن، وغيرها) مع كتب كريسنت الرسمية وامتحانات الثانوية والجامعة.'
                  : 'Curricula structured according to national frameworks. Priority for Yemen (Hadramout, Aden) with Crescent textbooks and ministerial exams.'}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-[#E6DFD5] flex items-center justify-between text-xs font-bold text-[#1C1917]">
              <span>{lang === 'ar' ? 'تصفح المناهج' : 'Browse Curricula'}</span>
              {lang === 'ar' ? (
                <ArrowLeft className="w-4 h-4 text-stone-500 group-hover:-translate-x-1 transition" />
              ) : (
                <ArrowRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 transition" />
              )}
            </div>
          </div>

          {/* Card 3: Interactive General English */}
          <div
            onClick={() => onSelectMethod('general')}
            className="group p-6 bg-white border border-[#E6DFD5] hover:border-stone-800 rounded-3xl shadow-xs transition duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F5F0E8] border border-[#E6DFD5] flex items-center justify-center text-stone-800 group-hover:scale-105 transition">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917]">
                {lang === 'ar' ? '٣. التعلم العام التفاعلي' : '3. Interactive General English'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {lang === 'ar'
                  ? 'مسار متدرج وممتع من الصفر حتى الإتقان. ثلاثة مستويات (مبتدئ، متوسط، متقدم) مع نقاط خبرة وأوسمة وتمارين تفاعلية سريعة.'
                  : 'Engaging, progressive paths from zero to fluency. Three levels (Beginner, Intermediate, Advanced) with XP, achievements, and bite-sized exercises.'}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-[#E6DFD5] flex items-center justify-between text-xs font-bold text-[#1C1917]">
              <span>{lang === 'ar' ? 'بدء المسار التفاعلي' : 'Start General Path'}</span>
              {lang === 'ar' ? (
                <ArrowLeft className="w-4 h-4 text-stone-500 group-hover:-translate-x-1 transition" />
              ) : (
                <ArrowRight className="w-4 h-4 text-stone-500 group-hover:translate-x-1 transition" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
