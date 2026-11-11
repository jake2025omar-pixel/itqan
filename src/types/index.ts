export type Language = 'ar' | 'en';

export type UserRole = 'student' | 'admin';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  selectedCountry: string;
  selectedRegion?: string;
  xp: number;
  streak: number;
  lastActiveDate: string; // ISO date
  wordsLearned: number;
  wordsMastered: number;
  completedLessons: string[]; // lesson IDs
  dailyGoalMinutes: number;
  dailyGoalXP: number;
  hearts: number; // For configurable gamification
  heartsEnabled: boolean;
  preferredLanguage: Language;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  definition: string;
  arabicExplanation?: string;
  ipa?: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'phrase';
  difficulty: DifficultyLevel;
  cefr: CEFRLevel;
  exampleSentence: string;
  exampleTranslation?: string;
  synonyms?: string[];
  antonyms?: string[];
  category: string;
  source?: string;
  verified: boolean;
  // Spaced Repetition (SRS)
  srsStage: number; // 0: new, 1: learning, 2: review 1, 3: review 2, 4: mastered
  nextReviewDate: string; // ISO date
  lastReviewedDate?: string;
  correctCount: number;
  incorrectCount: number;
}

export interface SentenceItem {
  id: string;
  english: string;
  arabic?: string;
  explanation?: string;
  grammarFocus?: string;
}

export interface CustomLesson {
  id: string;
  title: string;
  subject: string;
  unit: string;
  rawText: string;
  vocabulary: VocabularyItem[];
  sentences: SentenceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GrammarNote {
  id: string;
  titleEn: string;
  titleAr: string;
  ruleEn: string;
  ruleAr: string;
  examples: { en: string; ar: string }[];
}

export interface CurriculumLesson {
  id: string;
  unitId: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  textbookName: string;
  pageReference?: string;
  vocabulary: VocabularyItem[];
  grammarNotes: GrammarNote[];
  dialogue?: { speaker: string; text: string; translationAr?: string }[];
  readingPassage?: { title: string; text: string; translationAr?: string };
  verified: boolean;
  source: string;
  version: string;
}

export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  titleEn: string;
  titleAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  textbookName: string;
  lessons: CurriculumLesson[];
}

export interface CurriculumSemester {
  id: string;
  semesterNumber: 1 | 2 | 3;
  nameEn: string;
  nameAr: string;
  units: CurriculumUnit[];
}

export interface CurriculumGrade {
  id: string;
  gradeNumber: number | string;
  nameEn: string;
  nameAr: string;
  semesters: CurriculumSemester[];
}

export interface CurriculumStage {
  id: 'primary' | 'middle' | 'secondary' | 'university';
  nameEn: string;
  nameAr: string;
  grades: CurriculumGrade[];
}

export interface CurriculumCountry {
  id: string;
  nameEn: string;
  nameAr: string;
  flag: string;
  governorates?: { id: string; nameEn: string; nameAr: string }[];
  stages: CurriculumStage[];
  verified: boolean;
  lastUpdated: string;
}

export type ExerciseType =
  | 'listening'
  | 'spelling'
  | 'sentence_selection'
  | 'word_matching'
  | 'fill_in_blank'
  | 'underline_word'
  | 'pronunciation'
  | 'word_ordering'
  | 'translation'
  | 'writing';

export interface Exercise {
  id: string;
  type: ExerciseType;
  promptEn: string;
  promptAr: string;
  audioText?: string;
  targetWord?: string;
  options?: string[];
  correctAnswer: string | string[]; // Single string or array of acceptable answers
  matchingPairs?: { id: string; left: string; right: string }[]; // left: English, right: Arabic
  scrambledWords?: string[]; // for word ordering
  sentenceContext?: string; // with blank like "She ___ to school every day."
  optionsContext?: string[]; // for underline or fill in blank
  explanationEn?: string;
  explanationAr?: string;
}

export interface GeneralLesson {
  id: string;
  unitId: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  xpReward: number;
  exercises: Exercise[];
  completed?: boolean;
}

export interface GeneralUnit {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  unitNumber: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  lessons: GeneralLesson[];
}

export interface CatKnowledgeItem {
  id: string;
  category: string;
  keywords: string[];
  intent: string;
  queryPatterns: string[];
  answerEn: string;
  answerAr: string;
  examples: string[];
  relatedWords?: string[];
}
