import { Exercise, SentenceItem, VocabularyItem } from '../types';

export interface AnalysisResult {
  vocabulary: VocabularyItem[];
  sentences: SentenceItem[];
  detectedGrammarTopics: string[];
  wordCount: number;
  sentenceCount: number;
}

export class ContentAnalyzerService {
  // Common stop words to exclude from primary vocabulary extraction
  private stopWords = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
    'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
    'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
    'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
    'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
    'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
    'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
    'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
    'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
    'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
  ]);

  // Dictionary of known English-Arabic mappings
  private knownDictionary: Record<string, { ar: string; pos: VocabularyItem['partOfSpeech']; def: string; ipa: string }> = {
    school: { ar: 'مدرسة', pos: 'noun', def: 'An institution for educating children.', ipa: '/skuːl/' },
    student: { ar: 'طالب / متعلم', pos: 'noun', def: 'A person who is studying at a school or college.', ipa: '/ˈstjuː.dənt/' },
    teacher: { ar: 'معلم / أستاذ', pos: 'noun', def: 'A person who teaches in a school.', ipa: '/ˈtiː.tʃər/' },
    education: { ar: 'تعليم / تربية', pos: 'noun', def: 'The process of receiving or giving systematic instruction.', ipa: '/ˌedʒ.ʊˈkeɪ.ʃən/' },
    lesson: { ar: 'درس', pos: 'noun', def: 'A period of learning or teaching.', ipa: '/ˈles.ən/' },
    book: { ar: 'كتاب', pos: 'noun', def: 'A written or printed work consisting of pages.', ipa: '/bʊk/' },
    read: { ar: 'يقرأ', pos: 'verb', def: 'Look at and comprehend the meaning of written matter.', ipa: '/riːd/' },
    write: { ar: 'يكتب', pos: 'verb', def: 'Mark letters or words on a surface with a pen or pencil.', ipa: '/raɪt/' },
    speak: { ar: 'يتحدث / يتكلم', pos: 'verb', def: 'Say something in order to convey information.', ipa: '/spiːk/' },
    listen: { ar: 'يستمع / ينصت', pos: 'verb', def: 'Give one\'s attention to a sound.', ipa: '/ˈlɪs.ən/' },
    exam: { ar: 'اختبار / امتحان', pos: 'noun', def: 'A formal test of a person\'s knowledge or proficiency in a subject.', ipa: '/ɪɡˈzæm/' },
    question: { ar: 'سؤال', pos: 'noun', def: 'A sentence worded or expressed so as to elicit information.', ipa: '/ˈkwes.tʃən/' },
    answer: { ar: 'إجابة / حل', pos: 'noun', def: 'A thing said, written, or done to deal with a question.', ipa: '/ˈɑːn.sər/' },
    grammar: { ar: 'قواعد لغوية / نحو', pos: 'noun', def: 'The whole system and structure of a language.', ipa: '/ˈɡræm.ər/' },
    vocabulary: { ar: 'مفردات / كلمات', pos: 'noun', def: 'The body of words used in a particular language.', ipa: '/vəˈkæb.jʊ.lər.i/' },
    practice: { ar: 'ممارسة / تمرين', pos: 'noun', def: 'Repeated exercise in an activity to acquire proficiency.', ipa: '/ˈpræk.tɪs/' },
    successful: { ar: 'ناجح', pos: 'adjective', def: 'Accomplishing an aim or purpose.', ipa: '/səkˈses.fəl/' },
    achieve: { ar: 'يحقق / ينجز', pos: 'verb', def: 'Successfully bring about or reach by effort.', ipa: '/əˈtʃiːv/' },
    hospital: { ar: 'مستشفى', pos: 'noun', def: 'An institution providing medical and surgical treatment.', ipa: '/ˈhɒs.pɪ.təl/' },
    doctor: { ar: 'طبيب', pos: 'noun', def: 'A person who is qualified to treat people who are ill.', ipa: '/ˈdɒk.tər/' },
    engineer: { ar: 'مهندس', pos: 'noun', def: 'A person who designs, builds, or maintains engines, machines, or public works.', ipa: '/ˌen.dʒɪˈnɪər/' },
    city: { ar: 'مدينة', pos: 'noun', def: 'A large town.', ipa: '/ˈsɪt.i/' },
    country: { ar: 'بلد / دولة', pos: 'noun', def: 'A nation with its own government.', ipa: '/ˈkʌn.tri/' },
    future: { ar: 'المستقبل', pos: 'noun', def: 'The time or a period of time following the moment of speaking.', ipa: '/ˈfjuː.tʃər/' },
    technology: { ar: 'تقنية / تكنولوجيا', pos: 'noun', def: 'The application of scientific knowledge for practical purposes.', ipa: '/tekˈnɒl.ə.dʒi/' },
    computer: { ar: 'حاسوب / كمبيوتر', pos: 'noun', def: 'An electronic device for storing and processing data.', ipa: '/kəmˈpjuː.tər/' },
  };

  public analyzeText(content: string): AnalysisResult {
    const cleanContent = content.trim();
    if (!cleanContent) {
      return { vocabulary: [], sentences: [], detectedGrammarTopics: [], wordCount: 0, sentenceCount: 0 };
    }

    // Split into sentences (handling . ! ? and newlines)
    const rawSentences = cleanContent
      .split(/(?<=[.!?])\s+|\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 5);

    const sentences: SentenceItem[] = rawSentences.map((s, idx) => ({
      id: `sent_${Date.now()}_${idx}`,
      english: s,
      grammarFocus: this.detectSentenceGrammar(s)
    }));

    // Detect grammar topics across entire text
    const detectedGrammarTopics: string[] = [];
    if (/has|have|had\s+\w+ed/i.test(cleanContent)) detectedGrammarTopics.push('Perfect Tenses (المضارع أو الماضي التام)');
    if (/is|are|am|was|were\s+\w+ing/i.test(cleanContent)) detectedGrammarTopics.push('Continuous Tenses (المستمر)');
    if (/if\s+/i.test(cleanContent)) detectedGrammarTopics.push('Conditional Sentences (الجمل الشرطية If)');
    if (/will|going to/i.test(cleanContent)) detectedGrammarTopics.push('Future Tense (صيغ المستقبل)');
    if (/should|must|can|could|would|might/i.test(cleanContent)) detectedGrammarTopics.push('Modal Verbs (أفعال الاستطاعة والإلزام)');
    if (/was|were\s+\w+ed/i.test(cleanContent)) detectedGrammarTopics.push('Passive Voice (المبني للمجهول)');

    // Tokenize words
    const rawWords = cleanContent
      .toLowerCase()
      .replace(/[^a-z\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !this.stopWords.has(w));

    // Calculate frequency & unique
    const wordFreq: Record<string, number> = {};
    for (const w of rawWords) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }

    const uniqueWords = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a]);

    const vocabulary: VocabularyItem[] = uniqueWords.slice(0, 30).map((word, idx) => {
      const known = this.knownDictionary[word];
      const matchingSentence = sentences.find(s => new RegExp(`\\b${word}\\b`, 'i').test(s.english))?.english || `Practice using "${word}" in your own daily sentence.`;

      return {
        id: `vocab_${Date.now()}_${idx}`,
        word: word,
        translation: known ? known.ar : `المعنى حسب سياق النص`,
        definition: known ? known.def : `A key vocabulary word extracted from your study material.`,
        ipa: known ? known.ipa : `/${word}/`,
        partOfSpeech: known ? known.pos : this.inferPartOfSpeech(word),
        difficulty: word.length > 8 ? 'hard' : word.length > 5 ? 'medium' : 'easy',
        cefr: word.length > 9 ? 'B2' : word.length > 6 ? 'B1' : 'A2',
        exampleSentence: matchingSentence,
        category: 'Custom Content',
        verified: !!known,
        srsStage: 0,
        nextReviewDate: new Date().toISOString(),
        correctCount: 0,
        incorrectCount: 0,
      };
    });

    return {
      vocabulary,
      sentences,
      detectedGrammarTopics,
      wordCount: cleanContent.split(/\s+/).length,
      sentenceCount: sentences.length,
    };
  }

  private detectSentenceGrammar(s: string): string {
    if (/if\s+/i.test(s)) return 'Conditional Structure';
    if (/is|are|am|was|were\s+\w+ing/i.test(s)) return 'Continuous Action';
    if (/will\s+/i.test(s)) return 'Future Prediction / Intention';
    if (/should|must|can/i.test(s)) return 'Modal Obligation / Ability';
    return 'Declarative Statement';
  }

  private inferPartOfSpeech(word: string): VocabularyItem['partOfSpeech'] {
    if (word.endsWith('tion') || word.endsWith('ment') || word.endsWith('ness') || word.endsWith('ity')) return 'noun';
    if (word.endsWith('ize') || word.endsWith('ise') || word.endsWith('ate') || word.endsWith('ed') || word.endsWith('ing')) return 'verb';
    if (word.endsWith('ful') || word.endsWith('ous') || word.endsWith('ive') || word.endsWith('able') || word.endsWith('al')) return 'adjective';
    if (word.endsWith('ly')) return 'adverb';
    return 'noun';
  }

  // Generates complete 10-mode interactive exercise suite from user imported lesson
  public generateExercises(vocabulary: VocabularyItem[], sentences: SentenceItem[]): Exercise[] {
    const exercises: Exercise[] = [];

    // Mode 1: Listening
    if (vocabulary.length > 0) {
      const target = vocabulary[0];
      const distractors = vocabulary.slice(1, 4).map(v => v.word);
      const options = [target.word, ...distractors].sort(() => Math.random() - 0.5);
      exercises.push({
        id: `ex_listen_${Date.now()}`,
        type: 'listening',
        promptEn: `Listen carefully to the audio and select the word you heard:`,
        promptAr: `استمع بعناية إلى المقطع الصوتي واختر الكلمة المنطوقة:`,
        audioText: target.word,
        targetWord: target.word,
        options,
        correctAnswer: target.word,
        explanationEn: `The word "${target.word}" means "${target.translation}".`,
        explanationAr: `الكلمة المنطوقة هي "${target.word}" وتعني "${target.translation}".`
      });
    }

    // Mode 2: Spelling
    if (vocabulary.length > 1) {
      const target = vocabulary[1];
      exercises.push({
        id: `ex_spell_${Date.now()}`,
        type: 'spelling',
        promptEn: `Listen to the pronunciation and spell the word for "${target.translation}":`,
        promptAr: `استمع إلى النطق واكتب التهجئة الدقيقة لكلمة "${target.translation}":`,
        audioText: target.word,
        targetWord: target.word,
        correctAnswer: target.word,
        explanationEn: `Correct spelling: ${target.word.toUpperCase()}`,
        explanationAr: `التهجئة الصحيحة هي: ${target.word.toUpperCase()}`
      });
    }

    // Mode 3: Sentence Selection
    if (sentences.length > 0) {
      const targetSentence = sentences[0];
      const otherSentences = sentences.slice(1, 3).map(s => s.english);
      const fakeOption = `The exam was postponed until next week.`;
      const options = [targetSentence.english, ...otherSentences, fakeOption].slice(0, 4).sort(() => Math.random() - 0.5);
      exercises.push({
        id: `ex_sent_sel_${Date.now()}`,
        type: 'sentence_selection',
        promptEn: `Select the sentence from your study material that best conveys this meaning:`,
        promptAr: `اختر الجملة المناسبة من مادتك الدراسية:`,
        options,
        correctAnswer: targetSentence.english,
        explanationEn: targetSentence.english,
        explanationAr: `الجملة الأصلية من مادتك هي: ${targetSentence.english}`
      });
    }

    // Mode 4: Word Matching
    if (vocabulary.length >= 3) {
      const pairs = vocabulary.slice(0, 4).map((v, i) => ({
        id: `p_${i}`,
        left: v.word,
        right: v.translation
      }));
      exercises.push({
        id: `ex_matching_${Date.now()}`,
        type: 'word_matching',
        promptEn: `Connect each English word with its Arabic translation:`,
        promptAr: `صِل كل كلمة إنجليزية بترجمتها الصحيحة باللغة العربية:`,
        matchingPairs: pairs,
        correctAnswer: 'matched',
        explanationEn: `Pairing vocabulary with native translations reinforces retention.`,
        explanationAr: `ربط الكلمات بالترجمة العربية يرسخ المفردات في الذاكرة طويلة المدى.`
      });
    }

    // Mode 5: Fill in the Blanks
    if (sentences.length > 0 && vocabulary.length > 0) {
      const sent = sentences[0].english;
      const targetVocab = vocabulary.find(v => new RegExp(`\\b${v.word}\\b`, 'i').test(sent)) || vocabulary[0];
      const sentenceWithBlank = sent.replace(new RegExp(`\\b${targetVocab.word}\\b`, 'i'), '_____');
      const distractors = vocabulary.filter(v => v.word !== targetVocab.word).slice(0, 3).map(v => v.word);
      const options = [targetVocab.word, ...distractors].sort(() => Math.random() - 0.5);

      exercises.push({
        id: `ex_fill_blank_${Date.now()}`,
        type: 'fill_in_blank',
        promptEn: `Fill in the blank with the most fitting word:`,
        promptAr: `املأ الفراغ بالكلمة الصحيحة الملائمة للسياق:`,
        sentenceContext: sentenceWithBlank,
        options,
        correctAnswer: targetVocab.word,
        explanationEn: `Sentence: "${sent}"`,
        explanationAr: `الجملة الكاملة: "${sent}"`
      });
    }

    // Mode 6: Underline the Correct Word
    if (vocabulary.length >= 2) {
      const v1 = vocabulary[0].word;
      const v2 = vocabulary[1].word;
      const promptSentence = `To succeed in the examinations, it is [${v1} / ${v2}] to review your notes daily.`;
      exercises.push({
        id: `ex_underline_${Date.now()}`,
        type: 'underline_word',
        promptEn: `Select the correct word inside the brackets:`,
        promptAr: `حدد الكلمة الصحيحة بين القوسين:`,
        sentenceContext: promptSentence,
        optionsContext: [v1, v2],
        options: [v1, v2],
        correctAnswer: v1,
        explanationEn: `The appropriate choice is "${v1}".`,
        explanationAr: `الخيار الأنسب في هذا السياق هو "${v1}".`
      });
    }

    // Mode 7: Pronunciation Practice
    if (vocabulary.length > 0) {
      const target = vocabulary[0];
      exercises.push({
        id: `ex_pron_${Date.now()}`,
        type: 'pronunciation',
        promptEn: `Speak the word clearly into your microphone:`,
        promptAr: `انطق الكلمة التالية بوضوح في الميكروفون:`,
        targetWord: target.word,
        audioText: target.word,
        correctAnswer: target.word,
        explanationEn: `IPA: ${target.ipa || target.word}`,
        explanationAr: `طريقة النطق الصوتي (IPA): ${target.ipa || target.word}`
      });
    }

    // Mode 8: Word Ordering
    if (sentences.length > 0) {
      const sent = sentences[0].english.replace(/[.!?]/g, '');
      const words = sent.split(/\s+/).filter(w => w.length > 0);
      if (words.length >= 3 && words.length <= 8) {
        const scrambled = [...words].sort(() => Math.random() - 0.5);
        exercises.push({
          id: `ex_order_${Date.now()}`,
          type: 'word_ordering',
          promptEn: `Arrange the scrambled words to reconstruct the original sentence:`,
          promptAr: `رتب الكلمات المبعثرة لإعادة بناء الجملة الصحيحة:`,
          scrambledWords: scrambled,
          correctAnswer: sent,
          explanationEn: sent,
          explanationAr: `الجملة الصحيحة هي: ${sent}`
        });
      }
    }

    // Mode 9: Translation Practice
    if (vocabulary.length > 0) {
      const target = vocabulary[0];
      exercises.push({
        id: `ex_trans_${Date.now()}`,
        type: 'translation',
        promptEn: `What is the Arabic translation for "${target.word}"?`,
        promptAr: `ما هي الترجمة العربية الصحيحة للكلمة الإنجليزية "${target.word}"؟`,
        sentenceContext: target.word,
        options: [
          target.translation,
          'معلومات إضافية غير محددة',
          'طريقة أخرى للدراسة',
          'مراجعة سريعة'
        ].sort(() => Math.random() - 0.5),
        correctAnswer: target.translation,
        explanationEn: `"${target.word}" = ${target.translation}`,
        explanationAr: `ترجمة "${target.word}" هي "${target.translation}".`
      });
    }

    // Mode 10: Writing Practice
    if (vocabulary.length > 0) {
      const target = vocabulary[0];
      exercises.push({
        id: `ex_write_${Date.now()}`,
        type: 'writing',
        promptEn: `Write a complete sentence in English using the word "${target.word}":`,
        promptAr: `اكتب جملة إنجليزية متكاملة المعنى تحتوي على كلمة "${target.word}":`,
        sentenceContext: `Write a sentence with: ${target.word}`,
        correctAnswer: [target.word],
        explanationEn: `Ensure your sentence contains a subject, verb, and the word "${target.word}".`,
        explanationAr: `تأكد من احتواء جملتك على فاعل وفعل سليم واستخدام كلمة "${target.word}".`
      });
    }

    return exercises;
  }
}

export const contentAnalyzer = new ContentAnalyzerService();
