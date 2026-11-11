import { CAT_KNOWLEDGE_RULES, INITIAL_VOCABULARY_DATABASE } from '../data/knowledgeBase';
import { CatKnowledgeItem, Language, VocabularyItem } from '../types';

export interface CatResponse {
  text: string;
  matchedRule?: CatKnowledgeItem;
  matchedVocab?: VocabularyItem;
  examples?: string[];
  audioPlayWord?: string;
  suggestedQuestions?: string[];
}

export class CatIntelligenceEngine {
  private rules: CatKnowledgeItem[] = [];
  private vocabList: VocabularyItem[] = [];

  constructor() {
    this.rules = [...CAT_KNOWLEDGE_RULES];
    this.vocabList = [...INITIAL_VOCABULARY_DATABASE];
  }

  public registerCustomVocabulary(vocab: VocabularyItem[]) {
    // Add custom words into searchable index
    for (const item of vocab) {
      if (!this.vocabList.some(v => v.word.toLowerCase() === item.word.toLowerCase())) {
        this.vocabList.push(item);
      }
    }
  }

  public query(userInput: string, lang: Language = 'ar'): CatResponse {
    const rawQuery = userInput.trim().toLowerCase();
    if (!rawQuery) {
      return {
        text: lang === 'ar'
          ? 'مرحباً بك! أنا رفيقك الذكي إتقان، اسألني عن معاني الكلمات، القواعد، تصاريف الأفعال، أو طريقة التهجئة!'
          : 'Welcome! I am your ITQAN educational companion. Ask me about word meanings, grammar rules, verb tenses, or spelling!',
        suggestedQuestions: this.getDefaultQuestions(lang)
      };
    }

    // 1. Detect Intent: Meaning of a word
    const meaningPatterns = [
      /what does ["']?([a-z\s]+)["']? mean/i,
      /meaning of ["']?([a-z\s]+)["']?/i,
      /what is the meaning of ["']?([a-z\s]+)["']?/i,
      /define ["']?([a-z\s]+)["']?/i,
      /ترجمة كلمة\s+([a-zA-Z\s]+)/,
      /معنى كلمة\s+([a-zA-Z\s]+)/,
      /ما معنى\s+([a-zA-Z\s]+)/,
      /ايش معنى\s+([a-zA-Z\s]+)/,
    ];

    for (const pattern of meaningPatterns) {
      const match = rawQuery.match(pattern);
      if (match && match[1]) {
        const targetWord = match[1].trim().toLowerCase();
        const found = this.vocabList.find(v => v.word.toLowerCase() === targetWord);
        if (found) {
          const text = lang === 'ar'
            ? `كلمة "${found.word}" تعني: ${found.translation}.\nالتعريف بالإنجليزية: ${found.definition}\n${found.arabicExplanation ? `الشرح: ${found.arabicExplanation}\n` : ''}مثال في جملة: "${found.exampleSentence}"`
            : `"${found.word}" means ${found.translation} in Arabic.\nDefinition: ${found.definition}\nExample: "${found.exampleSentence}"`;
          return {
            text,
            matchedVocab: found,
            audioPlayWord: found.word,
            examples: found.exampleSentence ? [found.exampleSentence] : []
          };
        }
      }
    }

    // 2. Detect Intent: Spelling
    const spellingPatterns = [
      /how do i spell ["']?([a-z\s]+)["']?/i,
      /how to spell ["']?([a-z\s]+)["']?/i,
      /spell ["']?([a-z\s]+)["']?/i,
      /spelling of ["']?([a-z\s]+)["']?/i,
      /كيف اكتب\s+([a-zA-Z\s]+)/,
      /كيف تتهجى\s+([a-zA-Z\s]+)/,
      /تهجئة\s+([a-zA-Z\s]+)/,
    ];

    for (const pattern of spellingPatterns) {
      const match = rawQuery.match(pattern);
      if (match && match[1]) {
        const targetWord = match[1].trim().toLowerCase();
        // Check rule first
        const ruleMatch = this.rules.find(r => r.intent.startsWith('spelling') && r.keywords.includes(targetWord));
        if (ruleMatch) {
          return {
            text: lang === 'ar' ? ruleMatch.answerAr : ruleMatch.answerEn,
            matchedRule: ruleMatch,
            audioPlayWord: targetWord,
            examples: ruleMatch.examples
          };
        }
        // Spell out any word
        const spelled = targetWord.toUpperCase().split('').join(' - ');
        return {
          text: lang === 'ar'
            ? `تُكتب كلمة "${targetWord}" بالحروف التالية: ${spelled}`
            : `The word "${targetWord}" is spelled: ${spelled}`,
          audioPlayWord: targetWord
        };
      }
    }

    // 3. Detect Intent: Past Tense / Irregular Verbs
    const pastTensePatterns = [
      /past of ["']?([a-z]+)["']?/i,
      /past tense of ["']?([a-z]+)["']?/i,
      /what is the past of ["']?([a-z]+)["']?/i,
      /ماضي\s+([a-zA-Z]+)/,
      /ما هو ماضي\s+([a-zA-Z]+)/,
    ];

    for (const pattern of pastTensePatterns) {
      const match = rawQuery.match(pattern);
      if (match && match[1]) {
        const verb = match[1].trim().toLowerCase();
        const rule = this.rules.find(r => r.intent === `grammar_past_${verb}` || r.keywords.includes(verb));
        if (rule) {
          return {
            text: lang === 'ar' ? rule.answerAr : rule.answerEn,
            matchedRule: rule,
            examples: rule.examples
          };
        }
        // Common irregular verb lookup
        const commonIrregularVerbs: Record<string, { past: string; pp: string }> = {
          go: { past: 'went', pp: 'gone' },
          see: { past: 'saw', pp: 'seen' },
          take: { past: 'took', pp: 'taken' },
          eat: { past: 'ate', pp: 'eaten' },
          drink: { past: 'drank', pp: 'drunk' },
          write: { past: 'wrote', pp: 'written' },
          read: { past: 'read (pronounced red)', pp: 'read' },
          buy: { past: 'bought', pp: 'bought' },
          speak: { past: 'spoke', pp: 'spoken' },
          come: { past: 'came', pp: 'come' },
          make: { past: 'made', pp: 'made' },
          give: { past: 'gave', pp: 'given' },
        };

        if (commonIrregularVerbs[verb]) {
          const v = commonIrregularVerbs[verb];
          return {
            text: lang === 'ar'
              ? `الماضي (V2) للفعل "${verb}" هو "${v.past}". والتصريف الثالث (V3) هو "${v.pp}".`
              : `The past tense of "${verb}" is "${v.past}", and its past participle is "${v.pp}".`
          };
        }
      }
    }

    // 4. Match Knowledge Rules by Keywords & Query Patterns
    let bestRule: CatKnowledgeItem | null = null;
    let highestScore = 0;

    for (const rule of this.rules) {
      let score = 0;
      for (const pattern of rule.queryPatterns) {
        if (rawQuery.includes(pattern.toLowerCase())) {
          score += 15;
        }
      }
      for (const kw of rule.keywords) {
        if (rawQuery.includes(kw.toLowerCase())) {
          score += 8;
        }
      }
      if (score > highestScore && score >= 8) {
        highestScore = score;
        bestRule = rule;
      }
    }

    if (bestRule) {
      return {
        text: lang === 'ar' ? bestRule.answerAr : bestRule.answerEn,
        matchedRule: bestRule,
        examples: bestRule.examples
      };
    }

    // 5. Direct Vocabulary Search
    const cleanWord = rawQuery.replace(/[^a-zA-Z]/g, '').trim();
    if (cleanWord.length > 2) {
      const directMatch = this.vocabList.find(
        v => v.word.toLowerCase() === cleanWord || v.translation.includes(rawQuery)
      );
      if (directMatch) {
        return {
          text: lang === 'ar'
            ? `وجدت لك كلمة "${directMatch.word}":\nالمعنى: ${directMatch.translation}\nالتعريف: ${directMatch.definition}\nمثال: ${directMatch.exampleSentence}`
            : `Found "${directMatch.word}":\nTranslation: ${directMatch.translation}\nDefinition: ${directMatch.definition}\nExample: ${directMatch.exampleSentence}`,
          matchedVocab: directMatch,
          audioPlayWord: directMatch.word,
          examples: [directMatch.exampleSentence]
        };
      }
    }

    // 6. Strict Honesty Requirement when unverified or not in database
    return {
      text: lang === 'ar'
        ? 'لم أجد معلومات موثقة كافية في قاعدة بياناتي التعليمية للإجابة على هذا السؤال بعد. يمكنك سؤالي عن معاني الكلمات الإنجليزية، القواعد (مثل Was و Were أو المضارع البسيط)، أو تصاريف الأفعال الشاذة.'
        : "I don't have enough verified information to answer this question yet. Try asking in another way, or ask me about English vocabulary, grammar rules (like Was vs Were), or irregular verbs.",
      suggestedQuestions: this.getDefaultQuestions(lang)
    };
  }

  public getContextualHint(exerciseType: string, lang: Language = 'ar'): string {
    switch (exerciseType) {
      case 'listening':
        return lang === 'ar'
          ? 'نصيحة الاستماع: ركز على المقاطع الصوتية الأولى ونهايات الكلمات.'
          : 'Listening tip: Focus on initial vowel sounds and word endings.';
      case 'spelling':
        return lang === 'ar'
          ? 'نصيحة التهجئة: قسّم الكلمة إلى مقاطع صوتية صغيرة.'
          : 'Spelling tip: Break the word down into smaller syllables.';
      case 'word_ordering':
        return lang === 'ar'
          ? 'نصيحة الترتيب: ابدأ بالفاعل (Subject) ثم الفعل (Verb) ثم المفعول به (Object).'
          : 'Ordering tip: Start with the Subject, followed by the Verb, then the Object.';
      case 'pronunciation':
        return lang === 'ar'
          ? 'نصيحة النطق: تنفس جيداً وانطق كل حرف بوضوح أمام الميكروفون.'
          : 'Pronunciation tip: Articulate clearly and sustain natural vowel lengths.';
      default:
        return lang === 'ar'
          ? 'اقرأ السؤال بتمهل، وفكر في السياق العام للجملة.'
          : 'Read carefully and examine the full sentence context.';
    }
  }

  public getDefaultQuestions(lang: Language = 'ar'): string[] {
    if (lang === 'ar') {
      return [
        'ما الفرق بين Was و Were؟',
        'ما معنى كلمة Beautiful؟',
        'كيف أتهجى كلمة Necessary؟',
        'ما هو ماضي فعل Go؟',
        'متى نستخدم in و on و at للوقت؟',
        'ما الفرق بين much و many؟'
      ];
    }
    return [
      'What is the difference between Was and Were?',
      'What does "Beautiful" mean?',
      'How do I spell "Necessary"?',
      'What is the past tense of "Go"?',
      'When do we use in, on, and at for time?',
      'What is the difference between much and many?'
    ];
  }
}

export const catEngine = new CatIntelligenceEngine();
