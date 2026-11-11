import { GeneralUnit } from '../types';

export const GENERAL_LEARNING_UNITS: GeneralUnit[] = [
  // Beginner Level (A1 - A2)
  {
    id: 'gen_beg_u1',
    level: 'beginner',
    unitNumber: 1,
    titleEn: 'First Steps: Greetings & Everyday Objects',
    titleAr: 'الخطوات الأولى: التحيات والأشياء اليومية',
    descriptionEn: 'Master basic conversation starters, personal pronouns, and household objects.',
    descriptionAr: 'إتقان التحيات الأساسية، الضمائر الشخصية، والأشياء اليومية المحيطة بك.',
    lessons: [
      {
        id: 'gen_b1_l1',
        unitId: 'gen_beg_u1',
        titleEn: 'Warm Welcomes & Introductions',
        titleAr: 'الترحيب الحار والتعريف بالنفس',
        descriptionEn: 'Learn how to introduce yourself and ask how others are doing.',
        descriptionAr: 'تعلم كيف تقدم نفسك وتسأل الآخرين عن أحوالهم.',
        xpReward: 25,
        exercises: [
          {
            id: 'ex_b1_1',
            type: 'word_matching',
            promptEn: 'Match the English greetings with their Arabic meanings:',
            promptAr: 'صِل التحيات باللغة الإنجليزية بمعانيها بالعربية:',
            correctAnswer: 'matched',
            matchingPairs: [
              { id: 'p1', left: 'Hello', right: 'مرحباً' },
              { id: 'p2', left: 'Good morning', right: 'صباح الخير' },
              { id: 'p3', left: 'Good night', right: 'تصبح على خير' },
              { id: 'p4', left: 'Thank you', right: 'شكراً لك' }
            ],
            explanationEn: 'These are the most common everyday polite expressions.',
            explanationAr: 'هذه أكثر العبارات اليومية شيوعاً في التواصل المهذب.'
          },
          {
            id: 'ex_b1_2',
            type: 'listening',
            promptEn: 'Listen to the audio and select what was spoken:',
            promptAr: 'استمع إلى المقطع الصوتي واختر العبارة المنطوقة بدقة:',
            audioText: 'Good morning! How are you today?',
            options: [
              'Good morning! How are you today?',
              'Good night! See you tomorrow.',
              'Hello! What is your name?',
              'Good afternoon! Nice to meet you.'
            ],
            correctAnswer: 'Good morning! How are you today?',
            explanationEn: 'The speaker greets in the morning and inquires about your well-being.',
            explanationAr: 'المتحدث يلقي تحية الصباح ويسأل عن الحال.'
          },
          {
            id: 'ex_b1_3',
            type: 'spelling',
            promptEn: 'Listen and spell the word for "جميل / جميلة":',
            promptAr: 'استمع واكتب التهجئة الصحيحة لكلمة "جميل / جميلة":',
            audioText: 'beautiful',
            targetWord: 'beautiful',
            correctAnswer: 'beautiful',
            explanationEn: 'B-E-A-U-T-I-F-U-L',
            explanationAr: 'تُكتب B-E-A-U-T-I-F-U-L.'
          },
          {
            id: 'ex_b1_4',
            type: 'word_ordering',
            promptEn: 'Arrange the words to form a correct English sentence:',
            promptAr: 'رتب الكلمات لتكوين جملة إنجليزية صحيحة:',
            scrambledWords: ['is', 'name', 'My', 'Ahmed'],
            correctAnswer: 'My name is Ahmed',
            explanationEn: 'Subject possessive (My name) + verb (is) + complement (Ahmed).',
            explanationAr: 'ضمير الملكية والاسم (My name) + فعل الكينونة (is) + الاسم (Ahmed).'
          },
          {
            id: 'ex_b1_5',
            type: 'pronunciation',
            promptEn: 'Speak the sentence aloud into your microphone:',
            promptAr: 'انطق الجملة التالية بصوت واضح في الميكروفون:',
            targetWord: 'Nice to meet you',
            correctAnswer: 'Nice to meet you',
            explanationEn: 'A friendly phrase used upon meeting someone for the first time.',
            explanationAr: 'عبارة لطيفة تُقال عند مقابلة شخص ما لأول مرة.'
          }
        ]
      },
      {
        id: 'gen_b1_l2',
        unitId: 'gen_beg_u1',
        titleEn: 'Everyday Essentials & In The Classroom',
        titleAr: 'الأساسيات اليومية وفي قاعة الدراسة',
        descriptionEn: 'Names of common objects, books, pens, and asking questions.',
        descriptionAr: 'أسماء الأدوات الشائعة مثل الكتب والأقلام وكيفية السؤال عنها.',
        xpReward: 25,
        exercises: [
          {
            id: 'ex_b2_1',
            type: 'fill_in_blank',
            promptEn: 'Choose the correct word to complete the sentence:',
            promptAr: 'اختر الكلمة المناسبة لإكمال الجملة:',
            sentenceContext: 'I write my homework with a blue ___.',
            options: ['pen', 'chair', 'window', 'car'],
            correctAnswer: 'pen',
            explanationEn: 'We use a pen to write on paper.',
            explanationAr: 'نستخدم القلم (pen) للكتابة.'
          },
          {
            id: 'ex_b2_2',
            type: 'sentence_selection',
            promptEn: 'Which sentence correctly translates: "أنا أقرأ كتاباً مفيداً"؟',
            promptAr: 'أي جملة تترجم المعنى بشكل صحيح: "أنا أقرأ كتاباً مفيداً"؟',
            options: [
              'I am reading a useful book.',
              'I writes a useful book.',
              'I reading useful book.',
              'He is reading useful book.'
            ],
            correctAnswer: 'I am reading a useful book.',
            explanationEn: 'Subject "I" takes "am" with "-ing" verb and indefinite article "a".',
            explanationAr: 'الضمير I يأخذ am والفعل ينتهي بـ ing مع أداة التنكير a.'
          },
          {
            id: 'ex_b2_3',
            type: 'translation',
            promptEn: 'Translate the following English sentence to Arabic:',
            promptAr: 'ترجم الجملة الإنجليزية التالية إلى العربية:',
            sentenceContext: 'The teacher is very patient and helpful.',
            options: [
              'المعلم صبور ومساعد جداً.',
              'المعلم يكتب على السبورة.',
              'الطلاب ذهبوا إلى المكتبة.',
              'الفصل الدراسي كبير ونظيف.'
            ],
            correctAnswer: 'المعلم صبور ومساعد جداً.',
            explanationEn: 'Patient = صبور, helpful = مساعد/متعاون.',
            explanationAr: 'Patient تعني صبور، و helpful تعني متعاون أو مساعد.'
          }
        ]
      }
    ]
  },
  // Intermediate Level (B1 - B2)
  {
    id: 'gen_int_u1',
    level: 'intermediate',
    unitNumber: 1,
    titleEn: 'Narrative Past & Real Conversations',
    titleAr: 'السرد في الماضي والمحادثات الواقعية',
    descriptionEn: 'Describe past memories, journeys, experiences, and make polite requests.',
    descriptionAr: 'سرد الذكريات والرحلات الماضية، والتعبير عن التجارب، وصياغة الطلبات المهذبة.',
    lessons: [
      {
        id: 'gen_int_l1',
        unitId: 'gen_int_u1',
        titleEn: 'Travel Memories & Past Adventures',
        titleAr: 'ذكريات السفر ومغامرات الماضي',
        descriptionEn: 'Irregular past verbs, travel vocabulary, and expressive storytelling.',
        descriptionAr: 'أفعال الماضي الشاذة، مفردات السفر، وأسلوب السرد التعبيري.',
        xpReward: 35,
        exercises: [
          {
            id: 'ex_int_1',
            type: 'underline_word',
            promptEn: 'Select the correct past form of the verb to complete the story:',
            promptAr: 'حدد الصيغة الصحيحة لفعل الماضي لإكمال القصة:',
            sentenceContext: 'Last summer, my family ___ to the historic city of Shibam in Hadramout.',
            optionsContext: ['traveled', 'travels', 'traveling', 'will travel'],
            options: ['traveled', 'travels', 'traveling', 'will travel'],
            correctAnswer: 'traveled',
            explanationEn: '"Last summer" is a past time marker, requiring the past simple "traveled".',
            explanationAr: '"Last summer" دلالة زمنية ماضية، وتتطلب الماضي البسيط traveled.'
          },
          {
            id: 'ex_int_2',
            type: 'fill_in_blank',
            promptEn: 'Complete the sentence with the correct irregular verb:',
            promptAr: 'أكمل الجملة بالتصريف الصحيح للفعل الشاذ:',
            sentenceContext: 'We ___ (go) to the traditional spice market in Crater, Aden yesterday.',
            options: ['went', 'gone', 'goes', 'going'],
            correctAnswer: 'went',
            explanationEn: 'The past simple of "go" is "went".',
            explanationAr: 'الماضي البسيط للفعل go هو went.'
          },
          {
            id: 'ex_int_3',
            type: 'writing',
            promptEn: 'Type a complete sentence describing where you went yesterday:',
            promptAr: 'اكتب جملة إنجليزية كاملة تصف فيها أين ذهبت أمس (استخدم كلمة went):',
            sentenceContext: 'Yesterday, I went to...',
            correctAnswer: ['Yesterday, I went to school', 'Yesterday, I went to the market', 'Yesterday, I went to Mukalla', 'I went to school yesterday'],
            explanationEn: 'Ensure correct word order and capitalization.',
            explanationAr: 'احرص على بداية الجملة بحرف كبير واستخدام الفعل went مع حرف الجر to.'
          }
        ]
      }
    ]
  },
  // Advanced Level (C1 - C2)
  {
    id: 'gen_adv_u1',
    level: 'advanced',
    unitNumber: 1,
    titleEn: 'Academic Debate, Research & Nuance',
    titleAr: 'المناظرة الأكاديمية والبحث العلمي والدقة اللغوية',
    descriptionEn: 'Advanced stylistic structures, complex idioms, thesis arguments, and debate expressions.',
    descriptionAr: 'التراكيب البلاغية المتقدمة، التعابير الاصطلاحية، صياغة الأطروحات، وأساليب الإقناع.',
    lessons: [
      {
        id: 'gen_adv_l1',
        unitId: 'gen_adv_u1',
        titleEn: 'Critical Thinking & Nuanced Argumentation',
        titleAr: 'التفكير النقدي والمحاججة اللغوية الرصينة',
        descriptionEn: 'Formulate counter-arguments, evaluate academic sources, and articulate refined points of view.',
        descriptionAr: 'صياغة الحجج المقابلة، تقييم المصادر الأكاديمية، والتعبير عن وجهات النظر بدقة متناهية.',
        xpReward: 50,
        exercises: [
          {
            id: 'ex_adv_1',
            type: 'sentence_selection',
            promptEn: 'Select the sentence that demonstrates the most formal academic tone:',
            promptAr: 'اختر الجملة التي تعبر عن الأسلوب الأكاديمي الأكثر رصانة ورسمية:',
            options: [
              'The empirical data suggests a substantial correlation between study frequency and retention.',
              'Kids who study more remember stuff a whole lot better.',
              'People get high scores when they read lots of papers.',
              'The results are pretty good if you ask me.'
            ],
            correctAnswer: 'The empirical data suggests a substantial correlation between study frequency and retention.',
            explanationEn: 'Uses scholarly vocabulary: "empirical data", "substantial correlation", "retention".',
            explanationAr: 'تستخدم مفردات علمية رصينة مثل البيانات التجريبية والارتباط الجوهري وقوة الاستذكار.'
          },
          {
            id: 'ex_adv_2',
            type: 'word_matching',
            promptEn: 'Match these advanced C1 academic idioms with their precise definitions:',
            promptAr: 'صِل هذه التعبيرات الاصطلاحية المتقدمة بمعانيها الدقيقة:',
            correctAnswer: 'matched',
            matchingPairs: [
              { id: 'ap1', left: 'A double-edged sword', right: 'سلاح ذو حدين' },
              { id: 'ap2', left: 'Read between the lines', right: 'قراءة ما بين السطور / فهم المغزى الضمني' },
              { id: 'ap3', left: 'Play devil\'s advocate', right: 'طرح الرأي المعاكس لاختبار قوة الحجة' },
              { id: 'ap4', left: 'The tip of the iceberg', right: 'غيض من فيض / الجزء الظاهر من مشكلة أكبر' }
            ],
            explanationEn: 'High-level idiomatic expressions frequently evaluated in IELTS/TOEFL.',
            explanationAr: 'تعبيرات اصطلاحية شائعة في اختبارات الكفاءة اللغوية الأكاديمية.'
          }
        ]
      }
    ]
  }
];
