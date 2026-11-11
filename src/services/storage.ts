import { INITIAL_CURRICULA } from '../data/initialCurriculum';
import { INITIAL_VOCABULARY_DATABASE } from '../data/knowledgeBase';
import { CurriculumCountry, CustomLesson, Language, UserProfile, VocabularyItem } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'itqan_current_user_v1',
  USERS_LIST: 'itqan_users_list_v1',
  CUSTOM_LESSONS: 'itqan_custom_lessons_v1',
  VOCABULARY_LIST: 'itqan_vocabulary_list_v1',
  CURRICULA: 'itqan_curricula_v1',
  LANGUAGE: 'itqan_language_v1',
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_default',
  name: 'طالب إتقان (Hadramout)',
  email: 'student@itqan.edu.ye',
  role: 'student',
  currentLevel: 'beginner',
  selectedCountry: 'yemen',
  selectedRegion: 'hadramout',
  xp: 180,
  streak: 3,
  lastActiveDate: new Date().toISOString(),
  wordsLearned: 24,
  wordsMastered: 16,
  completedLessons: ['gen_b1_l1', 'g4_s1_u1_l1'],
  dailyGoalMinutes: 15,
  dailyGoalXP: 50,
  hearts: 5,
  heartsEnabled: false,
  preferredLanguage: 'ar',
};

class StorageService {
  // Current active user
  public getCurrentUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_) {}
    this.saveCurrentUser(DEFAULT_USER);
    return DEFAULT_USER;
  }

  public saveCurrentUser(user: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      // Also update in all users list
      const users = this.getAllUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx >= 0) {
        users[idx] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
    } catch (_) {}
  }

  public getAllUsers(): UserProfile[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [DEFAULT_USER];
  }

  public switchUser(userId: string): UserProfile {
    const users = this.getAllUsers();
    const found = users.find(u => u.id === userId);
    if (found) {
      this.saveCurrentUser(found);
      return found;
    }
    return this.getCurrentUser();
  }

  public registerUser(name: string, email: string, role: 'student' | 'admin' = 'student'): UserProfile {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
      xp: 0,
      streak: 1,
      wordsLearned: 0,
      wordsMastered: 0,
      completedLessons: [],
      lastActiveDate: new Date().toISOString(),
    };
    const users = this.getAllUsers();
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
    this.saveCurrentUser(newUser);
    return newUser;
  }

  // Language setting
  public getLanguage(): Language {
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
      if (lang === 'ar' || lang === 'en') return lang;
    } catch (_) {}
    return 'ar';
  }

  public setLanguage(lang: Language) {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
      const user = this.getCurrentUser();
      user.preferredLanguage = lang;
      this.saveCurrentUser(user);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      }
    } catch (_) {}
  }

  // Custom Lessons (Learning Method 1)
  public getCustomLessons(): CustomLesson[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_LESSONS);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [];
  }

  public saveCustomLesson(lesson: CustomLesson) {
    const lessons = this.getCustomLessons();
    const idx = lessons.findIndex(l => l.id === lesson.id);
    if (idx >= 0) {
      lessons[idx] = lesson;
    } else {
      lessons.unshift(lesson);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(lessons));

    // Also register its vocabulary into global vocab list
    const vocabList = this.getVocabularyList();
    for (const v of lesson.vocabulary) {
      if (!vocabList.some(item => item.word.toLowerCase() === v.word.toLowerCase())) {
        vocabList.push(v);
      }
    }
    localStorage.setItem(STORAGE_KEYS.VOCABULARY_LIST, JSON.stringify(vocabList));
  }

  public deleteCustomLesson(lessonId: string) {
    const lessons = this.getCustomLessons().filter(l => l.id !== lessonId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(lessons));
  }

  // Vocabulary List & Spaced Repetition System (SRS)
  public getVocabularyList(): VocabularyItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VOCABULARY_LIST);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    const initial = [...INITIAL_VOCABULARY_DATABASE];
    localStorage.setItem(STORAGE_KEYS.VOCABULARY_LIST, JSON.stringify(initial));
    return initial;
  }

  public recordWordReview(wordId: string, isCorrect: boolean) {
    const list = this.getVocabularyList();
    const item = list.find(v => v.id === wordId);
    if (!item) return;

    if (isCorrect) {
      item.correctCount += 1;
      item.srsStage = Math.min(4, item.srsStage + 1);
    } else {
      item.incorrectCount += 1;
      item.srsStage = Math.max(1, item.srsStage - 1);
    }

    item.lastReviewedDate = new Date().toISOString();

    // Spaced repetition interval in days based on stage: [1, 3, 7, 14, 30]
    const intervals = [1, 3, 7, 14, 30];
    const daysToAdd = isCorrect ? (intervals[item.srsStage] || 30) : 1;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    item.nextReviewDate = nextDate.toISOString();

    localStorage.setItem(STORAGE_KEYS.VOCABULARY_LIST, JSON.stringify(list));

    // Update user stats
    const user = this.getCurrentUser();
    const masteredCount = list.filter(v => v.srsStage >= 3).length;
    user.wordsMastered = masteredCount;
    user.wordsLearned = list.filter(v => v.correctCount > 0).length;
    this.saveCurrentUser(user);
  }

  public getDueSRSWords(): VocabularyItem[] {
    const list = this.getVocabularyList();
    const now = new Date();
    return list.filter(v => new Date(v.nextReviewDate) <= now || v.correctCount === 0);
  }

  // Curricula Storage
  public getCurricula(): CurriculumCountry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRICULA);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    localStorage.setItem(STORAGE_KEYS.CURRICULA, JSON.stringify(INITIAL_CURRICULA));
    return INITIAL_CURRICULA;
  }

  public saveCurricula(curricula: CurriculumCountry[]) {
    localStorage.setItem(STORAGE_KEYS.CURRICULA, JSON.stringify(curricula));
  }

  // Record completed lesson & award XP
  public recordLessonCompletion(lessonId: string, earnedXP: number) {
    const user = this.getCurrentUser();
    if (!user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId);
    }
    user.xp += earnedXP;

    // Check streak
    const today = new Date().toISOString().split('T')[0];
    const lastActive = user.lastActiveDate.split('T')[0];
    if (today !== lastActive) {
      const diffDays = Math.round((new Date(today).getTime() - new Date(lastActive).getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
      user.lastActiveDate = new Date().toISOString();
    }

    this.saveCurrentUser(user);
  }

  // Export / Import JSON
  public exportData(): string {
    const data = {
      currentUser: this.getCurrentUser(),
      users: this.getAllUsers(),
      customLessons: this.getCustomLessons(),
      vocabulary: this.getVocabularyList(),
      curricula: this.getCurricula(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  public importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.currentUser) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(parsed.currentUser));
      if (parsed.users) localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(parsed.users));
      if (parsed.customLessons) localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(parsed.customLessons));
      if (parsed.vocabulary) localStorage.setItem(STORAGE_KEYS.VOCABULARY_LIST, JSON.stringify(parsed.vocabulary));
      if (parsed.curricula) localStorage.setItem(STORAGE_KEYS.CURRICULA, JSON.stringify(parsed.curricula));
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
}

export const storageService = new StorageService();
