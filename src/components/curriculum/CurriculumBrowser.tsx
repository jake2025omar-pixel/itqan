import React, { useState } from 'react';
import {
  GraduationCap,
  MapPin,
  ChevronRight,
  BookOpen,
  CheckCircle,
  ShieldCheck,
  Building,
  School,
  Sparkles
} from 'lucide-react';
import { CurriculumCountry, CurriculumLesson, Exercise, Language } from '../../types';
import { storageService } from '../../services/storage';
import { CurriculumLessonView } from './CurriculumLessonView';

interface Props {
  lang: Language;
  onStartExercises: (exercises: Exercise[], title: string) => void;
}

export const CurriculumBrowser: React.FC<Props> = ({ lang, onStartExercises }) => {
  const [curricula] = useState<CurriculumCountry[]>(() => storageService.getCurricula());

  // Navigation steps state
  const [selectedCountryId, setSelectedCountryId] = useState<string>('yemen');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('hadramout');
  const [selectedStageId, setSelectedStageId] = useState<string>('primary');
  const [selectedGradeId, setSelectedGradeId] = useState<string>('grade_4');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('g4_sem1');
  const [selectedLesson, setSelectedLesson] = useState<CurriculumLesson | null>(null);

  const selectedCountry = curricula.find(c => c.id === selectedCountryId) || curricula[0];
  const selectedStage = selectedCountry?.stages.find(s => s.id === selectedStageId) || selectedCountry?.stages[0];
  const selectedGrade = selectedStage?.grades.find(g => g.id === selectedGradeId) || selectedStage?.grades[0];
  const selectedSemester = selectedGrade?.semesters.find(s => s.id === selectedSemesterId) || selectedGrade?.semesters[0];

  if (selectedLesson) {
    return (
      <CurriculumLessonView
        lesson={selectedLesson}
        lang={lang}
        onBack={() => setSelectedLesson(null)}
        onStartExercises={onStartExercises}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-[#F5F0E8] border border-[#E6DFD5] rounded-3xl">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5 text-stone-700" />
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            {lang === 'ar' ? 'المناهج المدرسية والوزارية' : 'National School Curricula'}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] mb-2">
          {lang === 'ar' ? 'المناهج الرسمية للجمهورية اليمنية والدول العربية' : 'Official Arab School Curricula'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          {lang === 'ar'
            ? 'مناهج منظمة حسب الهيكل التعليمي الرسمي المعتمد. أولوية خاصة لمتطلبات التعليم في محافظات حضرموت وعدن وبقية المحافظات وفق كتب كريسنت الرسمية وامتحانات الشهادة.'
            : 'Structured according to official ministerial syllabi. Special priority given to Yemen (Hadramout, Aden & other governorates) with Crescent English Course textbooks and national exam preparation.'}
        </p>
      </div>

      {/* Step 1: Country Selection (with special visual priority for Yemen) */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
          {lang === 'ar' ? '1. اختر الدولة' : '1. Select Country'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {curricula.map(c => {
            const isSelected = selectedCountryId === c.id;
            const isYemen = c.id === 'yemen';
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCountryId(c.id);
                  const firstStage = c.stages[0];
                  setSelectedStageId(firstStage?.id || '');
                  const firstGrade = firstStage?.grades[0];
                  setSelectedGradeId(firstGrade?.id || '');
                  const firstSem = firstGrade?.semesters[0];
                  setSelectedSemesterId(firstSem?.id || '');
                }}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#EEE7DC] border-stone-800 shadow-xs'
                    : 'bg-white border-[#E6DFD5] hover:bg-[#F5F0E8]'
                } ${isYemen ? 'ring-1 ring-[#D5CCC0]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#1C1917]">
                      {lang === 'ar' ? c.nameAr : c.nameEn}
                    </h4>
                    {isYemen && (
                      <span className="text-[10px] text-stone-600 font-medium">
                        {lang === 'ar' ? 'حضرموت · عدن · صنعاء · تعز' : 'Hadramout · Aden · Sana\'a'}
                      </span>
                    )}
                  </div>
                </div>

                {c.verified && (
                  <span title="Verified">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Governorate / Region Selection if Yemen */}
      {selectedCountryId === 'yemen' && selectedCountry?.governorates && (
        <div className="p-4 bg-white border border-[#E6DFD5] rounded-2xl space-y-2">
          <label className="block text-xs font-bold text-stone-600 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            <span>{lang === 'ar' ? 'المحافظة / النطاق التعليمي في اليمن:' : 'Educational Governorate in Yemen:'}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedCountry.governorates.map(gov => (
              <button
                key={gov.id}
                onClick={() => setSelectedGovernorate(gov.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  selectedGovernorate === gov.id
                    ? 'bg-[#EEE7DC] border-stone-900 text-[#1C1917]'
                    : 'bg-white border-[#E6DFD5] text-stone-600 hover:bg-[#F5F0E8]'
                }`}
              >
                {lang === 'ar' ? gov.nameAr : gov.nameEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Educational Stage Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
          {lang === 'ar' ? '2. المرحلة التعليمية' : '2. Educational Stage'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {selectedCountry?.stages.map(st => (
            <button
              key={st.id}
              onClick={() => {
                setSelectedStageId(st.id);
                const firstGrade = st.grades[0];
                setSelectedGradeId(firstGrade?.id || '');
                const firstSem = firstGrade?.semesters[0];
                setSelectedSemesterId(firstSem?.id || '');
              }}
              className={`p-3 rounded-xl border text-center transition ${
                selectedStageId === st.id
                  ? 'bg-[#EEE7DC] border-stone-800 text-[#1C1917] font-bold shadow-xs'
                  : 'bg-white border-[#E6DFD5] text-stone-700 hover:bg-[#F5F0E8] font-medium'
              }`}
            >
              <span className="text-xs block">{lang === 'ar' ? st.nameAr : st.nameEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Grade Selection */}
      {selectedStage && (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
            {lang === 'ar' ? '3. الصف الدراسي / التخصص' : '3. Grade / Specialization'}
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedStage.grades.map(gr => (
              <button
                key={gr.id}
                onClick={() => {
                  setSelectedGradeId(gr.id);
                  const firstSem = gr.semesters[0];
                  setSelectedSemesterId(firstSem?.id || '');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  selectedGradeId === gr.id
                    ? 'bg-[#EEE7DC] border-stone-900 text-[#1C1917]'
                    : 'bg-white border-[#E6DFD5] text-stone-700 hover:bg-[#F5F0E8]'
                }`}
              >
                {lang === 'ar' ? gr.nameAr : gr.nameEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Semester Selection */}
      {selectedGrade && (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
            {lang === 'ar' ? '4. الفصل الدراسي' : '4. Semester / Term'}
          </label>
          <div className="flex gap-2">
            {selectedGrade.semesters.map(sem => (
              <button
                key={sem.id}
                onClick={() => setSelectedSemesterId(sem.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  selectedSemesterId === sem.id
                    ? 'bg-[#EEE7DC] border-stone-900 text-[#1C1917]'
                    : 'bg-white border-[#E6DFD5] text-stone-700 hover:bg-[#F5F0E8]'
                }`}
              >
                {lang === 'ar' ? sem.nameAr : sem.nameEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Units & Lessons List */}
      {selectedSemester && (
        <div className="space-y-4 pt-4 border-t border-[#E6DFD5]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1C1917]">
              {lang === 'ar' ? 'الوحدات والدروس الدراسية المعتمدة' : 'Official Units & Lessons'}
            </h3>
            <span className="text-xs text-stone-500">
              {selectedSemester.units.reduce((acc, u) => acc + u.lessons.length, 0)} {lang === 'ar' ? 'دروس متوفرة' : 'lessons available'}
            </span>
          </div>

          <div className="space-y-4">
            {selectedSemester.units.map(unit => (
              <div key={unit.id} className="p-5 bg-white border border-[#E6DFD5] rounded-3xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 block uppercase">
                      {unit.textbookName}
                    </span>
                    <h4 className="text-base font-bold text-[#1C1917]">
                      {lang === 'ar' ? unit.titleAr : unit.titleEn}
                    </h4>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F5F0E8] text-stone-700 border border-[#E6DFD5]">
                    {lang === 'ar' ? `الوحدة ${unit.unitNumber}` : `Unit ${unit.unitNumber}`}
                  </span>
                </div>

                {unit.descriptionAr && (
                  <p className="text-xs text-stone-600">
                    {lang === 'ar' ? unit.descriptionAr : unit.descriptionEn}
                  </p>
                )}

                {/* Lessons in Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {unit.lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className="p-4 rounded-2xl bg-[#F5F0E8] border border-[#E6DFD5] hover:border-stone-800 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <h5 className="text-xs sm:text-sm font-bold text-[#1C1917] group-hover:text-stone-900">
                          {lang === 'ar' ? lesson.titleAr : lesson.titleEn}
                        </h5>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span>{lesson.vocabulary.length} {lang === 'ar' ? 'مفردات' : 'words'}</span>
                          <span>·</span>
                          <span>{lesson.grammarNotes.length} {lang === 'ar' ? 'قواعد' : 'grammar'}</span>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 text-stone-500 group-hover:translate-x-1 transition ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
