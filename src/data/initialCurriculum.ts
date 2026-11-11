import { CurriculumCountry } from '../types';

export const INITIAL_CURRICULA: CurriculumCountry[] = [
  {
    id: 'yemen',
    nameEn: 'Yemen',
    nameAr: 'الجمهورية اليمنية',
    flag: '🇾🇪',
    verified: true,
    lastUpdated: '2026-11-01',
    governorates: [
      { id: 'hadramout', nameEn: 'Hadramout (المكلا / سيئون)', nameAr: 'محافظة حضرموت (المكلا / وادي وصحراء حضرموت)' },
      { id: 'aden', nameEn: 'Aden', nameAr: 'العاصمة المؤقتة عدن' },
      { id: 'sanaa', nameEn: 'Sana\'a', nameAr: 'أمانة العاصمة ومحافظة صنعاء' },
      { id: 'taiz', nameEn: 'Taiz', nameAr: 'محافظة تعز' },
      { id: 'marib', nameEn: 'Marib', nameAr: 'محافظة مأرب' },
      { id: 'hodeidah', nameEn: 'Al-Hodeidah', nameAr: 'محافظة الحديدة' },
      { id: 'ibb', nameEn: 'Ibb', nameAr: 'محافظة إب' },
      { id: 'shabwah', nameEn: 'Shabwah', nameAr: 'محافظة شبوة' },
      { id: 'al_mahra', nameEn: 'Al-Mahra', nameAr: 'محافظة المهرة' },
      { id: 'socotra', nameEn: 'Socotra Archipelago', nameAr: 'أرخبيل سقطرى' },
    ],
    stages: [
      {
        id: 'primary',
        nameEn: 'Primary Education (Grades 1 - 6)',
        nameAr: 'التعليم الأساسي (الصفوف 1 - 6)',
        grades: [
          {
            id: 'grade_4',
            gradeNumber: 4,
            nameEn: 'Grade 4 (Crescent English Course 1)',
            nameAr: 'الصف الرابع الأساسي (سلسلة كريسنت 1)',
            semesters: [
              {
                id: 'g4_sem1',
                semesterNumber: 1,
                nameEn: 'First Semester',
                nameAr: 'الفصل الدراسي الأول',
                units: [
                  {
                    id: 'g4_s1_u1',
                    unitNumber: 1,
                    titleEn: 'Hello & School Friends',
                    titleAr: 'مرحباً وأصدقاء المدرسة',
                    textbookName: 'Crescent English Course for Yemen - Pupil\'s Book 1',
                    descriptionEn: 'Introducing oneself, greetings, classroom items, and numbers 1-20.',
                    descriptionAr: 'التعريف بالنفس، التحيات، الأدوات المدرسية، والأرقام من 1 إلى 20.',
                    lessons: [
                      {
                        id: 'g4_s1_u1_l1',
                        unitId: 'g4_s1_u1',
                        titleEn: 'Lesson 1: Greetings & Introductions',
                        titleAr: 'الدرس 1: التحيات والتعارف',
                        descriptionEn: 'Learn how to greet someone and ask "What is your name?"',
                        descriptionAr: 'تعلم التحية باللغة الإنجليزية والسؤال عن الاسم.',
                        textbookName: 'Crescent English Course for Yemen - Book 1',
                        pageReference: 'Pages 2 - 4',
                        verified: true,
                        source: 'Ministry of Education - Yemen Curriculum Center',
                        version: 'Curriculum Edition 2024-2026',
                        vocabulary: [
                          {
                            id: 'g4_v1',
                            word: 'hello',
                            translation: 'مرحباً / أهلاً',
                            definition: 'Used as a greeting or to begin a conversation.',
                            partOfSpeech: 'phrase',
                            difficulty: 'easy',
                            cefr: 'A1',
                            exampleSentence: 'Hello, my name is Fuad.',
                            exampleTranslation: 'مرحباً، اسمي فؤاد.',
                            category: 'School Vocabulary',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          },
                          {
                            id: 'g4_v2',
                            word: 'friend',
                            translation: 'صديق / زميل',
                            definition: 'A person with whom one has a bond of mutual affection.',
                            partOfSpeech: 'noun',
                            difficulty: 'easy',
                            cefr: 'A1',
                            exampleSentence: 'This is my friend Tariq from Aden.',
                            exampleTranslation: 'هذا صديقي طارق من عدن.',
                            category: 'School Vocabulary',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          },
                          {
                            id: 'g4_v3',
                            word: 'classroom',
                            translation: 'غرفة الصف / الفصل الدراسي',
                            definition: 'A room, typically in a school, in which a class of students is taught.',
                            partOfSpeech: 'noun',
                            difficulty: 'easy',
                            cefr: 'A1',
                            exampleSentence: 'Our classroom is clean and bright.',
                            exampleTranslation: 'فصلنا الدراسي نظيف ومشرق.',
                            category: 'School Vocabulary',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          },
                          {
                            id: 'g4_v4',
                            word: 'teacher',
                            translation: 'معلم / أستاذ',
                            definition: 'A person who teaches, especially in a school.',
                            partOfSpeech: 'noun',
                            difficulty: 'easy',
                            cefr: 'A1',
                            exampleSentence: 'The English teacher is very kind.',
                            exampleTranslation: 'معلم اللغة الإنجليزية لطيف جداً.',
                            category: 'School Vocabulary',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          }
                        ],
                        grammarNotes: [
                          {
                            id: 'g4_gn1',
                            titleEn: 'Verb to Be: Am & Is',
                            titleAr: 'فعل الكينونة (Am و Is)',
                            ruleEn: 'Use "I am" when talking about yourself. Use "He is" or "She is" when talking about one person.',
                            ruleAr: 'نستخدم "I am" عند التحدث عن النفس (أنا أكون). ونستخدم "He is" للمفرد المذكر و "She is" للمفرد المؤنث.',
                            examples: [
                              { en: 'I am a student in Hadramout.', ar: 'أنا طالب في حضرموت.' },
                              { en: 'She is my sister Fatima.', ar: 'هي أختي فاطمة.' }
                            ]
                          }
                        ],
                        dialogue: [
                          { speaker: 'Fuad', text: 'Good morning! My name is Fuad.', translationAr: 'صباح الخير! اسمي فؤاد.' },
                          { speaker: 'Saleh', text: 'Good morning Fuad! I am Saleh from Mukalla.', translationAr: 'صباح الخير يا فؤاد! أنا صالح من المكلا.' },
                          { speaker: 'Fuad', text: 'Nice to meet you, Saleh!', translationAr: 'سعيد بلقائك يا صالح!' }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'grade_6',
            gradeNumber: 6,
            nameEn: 'Grade 6 (Crescent English Course 3)',
            nameAr: 'الصف السادس الأساسي (سلسلة كريسنت 3)',
            semesters: [
              {
                id: 'g6_sem1',
                semesterNumber: 1,
                nameEn: 'First Semester',
                nameAr: 'الفصل الدراسي الأول',
                units: [
                  {
                    id: 'g6_s1_u1',
                    unitNumber: 1,
                    titleEn: 'Life in Yemen: Cities and Traditions',
                    titleAr: 'الحياة في اليمن: المدن والتقاليد',
                    textbookName: 'Crescent English Course for Yemen - Book 3',
                    lessons: [
                      {
                        id: 'g6_s1_u1_l1',
                        unitId: 'g6_s1_u1',
                        titleEn: 'Historic Ports and Cities: Aden & Mukalla',
                        titleAr: 'المدن والموانئ التاريخية: عدن والمكلا',
                        descriptionEn: 'Reading comprehension and vocabulary about coastal life, fishing, and trade.',
                        descriptionAr: 'قراءة ومفردات حول الحياة الساحلية، الصيد، والتجارة.',
                        textbookName: 'Crescent English Course for Yemen - Book 3',
                        verified: true,
                        source: 'Yemen Ministry of Education Curriculum Standards',
                        version: 'Verified Textbook Edition',
                        vocabulary: [
                          {
                            id: 'g6_v1',
                            word: 'harbour',
                            translation: 'ميناء / مرسى بحري',
                            definition: 'A place on the coast where ships may moor in shelter.',
                            partOfSpeech: 'noun',
                            difficulty: 'medium',
                            cefr: 'A2',
                            exampleSentence: 'Aden has one of the oldest natural harbours in the world.',
                            exampleTranslation: 'تمتلك عدن أحد أقدم الموانئ الطبيعية في العالم.',
                            category: 'School Vocabulary',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          },
                          {
                            id: 'g6_v2',
                            word: 'architecture',
                            translation: 'فن العمارة / الطراز المعماري',
                            definition: 'The art or practice of designing and constructing buildings.',
                            partOfSpeech: 'noun',
                            difficulty: 'medium',
                            cefr: 'B1',
                            exampleSentence: 'Shibam in Hadramout is world-famous for its mud-brick skyscraper architecture.',
                            exampleTranslation: 'تشتهر مدينة شبام في حضرموت عالمياً بعمارتها الطينية التي تشبه ناطحات السحاب.',
                            category: 'School Vocabulary',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          }
                        ],
                        grammarNotes: [
                          {
                            id: 'g6_gn1',
                            titleEn: 'Past Simple with Regular Verbs (-ed)',
                            titleAr: 'الماضي البسيط مع الأفعال المنتظمة (-ed)',
                            ruleEn: 'Add -ed to regular verbs to express completed actions in the past.',
                            ruleAr: 'نضيف -ed إلى نهاية الفعل المنتظم للتعبير عن حدث وقع وانتهى في الماضي.',
                            examples: [
                              { en: 'We visited the historic cisterns of Aden.', ar: 'زرنا صهاريج عدن التاريخية.' },
                              { en: 'They walked along the Mukalla corniche.', ar: 'مشوا على طول كورنيش المكلا.' }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'middle',
        nameEn: 'Preparatory / Middle School (Grades 7 - 9)',
        nameAr: 'التعليم الإعدادي / المتوسط (الصفوف 7 - 9)',
        grades: [
          {
            id: 'grade_9',
            gradeNumber: 9,
            nameEn: 'Grade 9 (National Basic Certificate Examination)',
            nameAr: 'الصف التاسع الأساسي (امتحانات الشهادة الأساسية)',
            semesters: [
              {
                id: 'g9_sem1',
                semesterNumber: 1,
                nameEn: 'First Semester',
                nameAr: 'الفصل الدراسي الأول',
                units: [
                  {
                    id: 'g9_s1_u1',
                    unitNumber: 1,
                    titleEn: 'Science, Inventions & Discoveries',
                    titleAr: 'العلوم والاختراعات والاكتشافات',
                    textbookName: 'English for Yemen - Pupil\'s Book 6',
                    lessons: [
                      {
                        id: 'g9_s1_u1_l1',
                        unitId: 'g9_s1_u1',
                        titleEn: 'Lesson 1: Renewable Energy and Solar Power in Yemen',
                        titleAr: 'الدرس 1: الطاقة المتجددة والشمسية في اليمن',
                        descriptionEn: 'Vocabulary and grammar related to solar energy and green technology.',
                        descriptionAr: 'مفردات وقواعد متعلقة بالطاقة الشمسية والتقنيات النظيفة.',
                        textbookName: 'English for Yemen - Book 6',
                        verified: true,
                        source: 'Educational Research & Development Center (ERDC) Yemen',
                        version: 'Verified Examination Curriculum',
                        vocabulary: [
                          {
                            id: 'g9_v1',
                            word: 'renewable',
                            translation: 'متجدد (كالطاقة النظيفة)',
                            definition: 'Not depleted by use, such as water, wind, or solar power.',
                            partOfSpeech: 'adjective',
                            difficulty: 'medium',
                            cefr: 'B1',
                            exampleSentence: 'Solar panels provide clean and renewable energy for Yemeni homes.',
                            exampleTranslation: 'توفر الألواح الشمسية طاقة نظيفة ومتجددة للمنازل اليمنية.',
                            category: 'Scientific English',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          },
                          {
                            id: 'g9_v2',
                            word: 'efficient',
                            translation: 'كفء / عالي الكفاءة',
                            definition: 'Achieving maximum productivity with minimum wasted effort or expense.',
                            partOfSpeech: 'adjective',
                            difficulty: 'medium',
                            cefr: 'B1',
                            exampleSentence: 'LED lights are more efficient than old bulbs.',
                            exampleTranslation: 'مصابيح LED أكثر كفاءة من المصابيح القديمة.',
                            category: 'Scientific English',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          }
                        ],
                        grammarNotes: [
                          {
                            id: 'g9_gn1',
                            titleEn: 'Passive Voice (Present Simple)',
                            titleAr: 'المبني للمجهول (المضارع البسيط)',
                            ruleEn: 'Object + am/is/are + Past Participle (V3). Focus is on the action, not who did it.',
                            ruleAr: 'المفعول به + am/is/are + التصريف الثالث (P.P). نستخدمه عندما يكون التركيز على الحدث نفسه.',
                            examples: [
                              { en: 'Solar panels are installed on roofs.', ar: 'يتم تركيب الألواح الشمسية على الأسطح.' }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'secondary',
        nameEn: 'Secondary Education (1st, 2nd & 3rd Secondary)',
        nameAr: 'التعليم الثانوي (الأول والثاني والثالث الثانوي)',
        grades: [
          {
            id: 'sec_3',
            gradeNumber: '3rd Secondary',
            nameEn: 'Third Secondary (Thanawiya Amma - National Exam Prep)',
            nameAr: 'الثالث الثانوي (امتحانات الثانوية العامة - علمي وأدبي)',
            semesters: [
              {
                id: 'sec3_sem1',
                semesterNumber: 1,
                nameEn: 'First Semester',
                nameAr: 'الفصل الدراسي الأول',
                units: [
                  {
                    id: 'sec3_u1',
                    unitNumber: 1,
                    titleEn: 'Modern Technology, Communications & Society',
                    titleAr: 'التكنولوجيا الحديثة والاتصالات والمجتمع',
                    textbookName: 'English for Yemen - Secondary Book 3 (Ministry Approved)',
                    lessons: [
                      {
                        id: 'sec3_u1_l1',
                        unitId: 'sec3_u1',
                        titleEn: 'Lesson 1: Artificial Intelligence & Global Connectivity',
                        titleAr: 'الدرس 1: الذكاء الاصطناعي والتواصل العالمي',
                        descriptionEn: 'Advanced reading comprehension, conditional sentences, and academic vocabulary for Grade 12 ministerial exams.',
                        descriptionAr: 'قراءة متقدمة، الجمل الشرطية، ومفردات أكاديمية لامتحانات الثانوية العامة الوزارية.',
                        textbookName: 'English for Yemen - Secondary 3',
                        pageReference: 'Ministry Official Curriculum Units 1-2',
                        verified: true,
                        source: 'Yemen Ministry of Education High Examination Committee',
                        version: 'Verified Ministerial Exam Edition 2025/2026',
                        vocabulary: [
                          {
                            id: 's3_v1',
                            word: 'breakthrough',
                            translation: 'إنجاز علمي كبير / طفرة نوعية',
                            definition: 'A sudden, dramatic, and important discovery or development.',
                            partOfSpeech: 'noun',
                            difficulty: 'hard',
                            cefr: 'B2',
                            exampleSentence: 'The discovery of electricity was a major technological breakthrough.',
                            exampleTranslation: 'كان اكتشاف الكهرباء طفرة تكنولوجية كبرى.',
                            category: 'Academic English',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          },
                          {
                            id: 's3_v2',
                            word: 'autonomous',
                            translation: 'ذاتي التحكم / مستقل',
                            definition: 'Acting independently or having the freedom to do so.',
                            partOfSpeech: 'adjective',
                            difficulty: 'hard',
                            cefr: 'C1',
                            exampleSentence: 'Engineers are testing autonomous navigation systems.',
                            exampleTranslation: 'يقوم المهندسون باختبار أنظمة ملاحة ذاتية التحكم.',
                            category: 'Technology English',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          }
                        ],
                        grammarNotes: [
                          {
                            id: 's3_gn1',
                            titleEn: 'Second and Third Conditionals (If Clauses)',
                            titleAr: 'الجمل الشرطية (الحالة الثانية والثالثة)',
                            ruleEn: 'Third Conditional: If + had + V3, would have + V3 (used for hypothetical past situations and regrets).',
                            ruleAr: 'الحالة الشرطية الثالثة: If + had + التصريف الثالث، would have + التصريف الثالث (للحديث عن مواقف ماضية مستحيلة أو ندم).',
                            examples: [
                              { en: 'If the student had revised the vocabulary, he would have scored higher.', ar: 'لو كان الطالب قد راجع المفردات، لكان قد أحرز درجة أعلى.' }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'university',
        nameEn: 'University Education (Specialized Faculties)',
        nameAr: 'التعليم الجامعي (التخصصات الأكاديمية)',
        grades: [
          {
            id: 'uni_med',
            gradeNumber: 'Medicine & Health',
            nameEn: 'Medical English (Faculties of Medicine & Nursing)',
            nameAr: 'اللغة الإنجليزية الطبية (كليات الطب والتمريض - حضرموت وعدن وصنعاء)',
            semesters: [
              {
                id: 'uni_med_s1',
                semesterNumber: 1,
                nameEn: 'Semester 1: Medical Terminology',
                nameAr: 'الفصل 1: المصطلحات الطبية والتشريح',
                units: [
                  {
                    id: 'uni_med_u1',
                    unitNumber: 1,
                    titleEn: 'Cardiovascular and Respiratory Terminology',
                    titleAr: 'مصطلحات الجهاز الدوري والتنفسي',
                    textbookName: 'English for Medical Students (Academic Press)',
                    lessons: [
                      {
                        id: 'uni_med_l1',
                        unitId: 'uni_med_u1',
                        titleEn: 'Cardiovascular Assessment & Clinical Dialogue',
                        titleAr: 'الفحص السريري للقلب ومحادثات الطبيب والمريض',
                        descriptionEn: 'Clinical dialogue, symptom descriptors, and diagnosis vocabulary.',
                        descriptionAr: 'المحادثة السريرية مع المريض ووصف الأعراض والتشخيص.',
                        textbookName: 'Clinical English for Arab Physicians',
                        verified: true,
                        source: 'University Medical College Curriculum',
                        version: 'Verified University Course',
                        vocabulary: [
                          {
                            id: 'um_v1',
                            word: 'hypertension',
                            translation: 'ارتفاع ضغط الدم',
                            definition: 'Abnormally high blood pressure.',
                            partOfSpeech: 'noun',
                            difficulty: 'hard',
                            cefr: 'C1',
                            exampleSentence: 'The physician examined the patient for signs of hypertension.',
                            exampleTranslation: 'فحص الطبيب المريض للتحقق من علامات ارتفاع ضغط الدم.',
                            category: 'Medical English',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          }
                        ],
                        grammarNotes: [
                          {
                            id: 'um_gn1',
                            titleEn: 'Modal Verbs in Medical Consultations (Should, Must, May)',
                            titleAr: 'أفعال الاستطاعة والإلزام في الاستشارات الطبية',
                            ruleEn: 'Use "should" for recommendations, "must" for strict prescriptions, "may" for potential risks.',
                            ruleAr: 'نستخدم "should" للنصائح الطبية، و "must" للتعليمات الدوائية الملزمة، و "may" للمخاطر المحتملة.',
                            examples: [
                              { en: 'You must take this antibiotic every 8 hours.', ar: 'يجب تناول هذا المضاد الحيوي كل 8 ساعات.' }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'uni_eng',
            gradeNumber: 'Engineering & Tech',
            nameEn: 'Technical English for Engineering',
            nameAr: 'اللغة الإنجليزية التخصصية لكليات الهندسة والحاسوب',
            semesters: [
              {
                id: 'uni_eng_s1',
                semesterNumber: 1,
                nameEn: 'Semester 1: Technical Specifications & Reports',
                nameAr: 'الفصل 1: المواصفات الفنية وكتابة التقارير الهندسية',
                units: [
                  {
                    id: 'uni_eng_u1',
                    unitNumber: 1,
                    titleEn: 'Engineering Systems & Technical Documentation',
                    titleAr: 'الأنظمة الهندسية والتوثيق الفني',
                    textbookName: 'Technical English for University Engineers',
                    lessons: [
                      {
                        id: 'uni_eng_l1',
                        unitId: 'uni_eng_u1',
                        titleEn: 'Lesson 1: Specifications, Tolerances & Materials',
                        titleAr: 'الدرس 1: المواصفات الفنية ومعايير الجودة والمواد',
                        descriptionEn: 'Formulation of technical requirements and engineering reports.',
                        descriptionAr: 'صياغة المتطلبات الهندسية وتقارير الفحص.',
                        textbookName: 'Engineering English Course',
                        verified: true,
                        source: 'Faculty of Engineering Standards',
                        version: 'Verified Academic Track',
                        vocabulary: [
                          {
                            id: 'ue_v1',
                            word: 'specification',
                            translation: 'مواصفة قياسية / تفاصيل التصميم',
                            definition: 'An act of describing or identifying something precisely or of stating a precise requirement.',
                            partOfSpeech: 'noun',
                            difficulty: 'hard',
                            cefr: 'B2',
                            exampleSentence: 'The bridge was constructed according to strict civil engineering specifications.',
                            exampleTranslation: 'شُيّد الجسر وفقاً لمواصفات هندسية مدنية صارمة.',
                            category: 'Engineering English',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          }
                        ],
                        grammarNotes: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'saudi',
    nameEn: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية',
    flag: '🇸🇦',
    verified: true,
    lastUpdated: '2026-10-15',
    stages: [
      {
        id: 'secondary',
        nameEn: 'Secondary School (Mega Goal Curriculum)',
        nameAr: 'المرحلة الثانوية (سلسلة Mega Goal المعتمدة)',
        grades: [
          {
            id: 'ksa_sec_1',
            gradeNumber: '1st Secondary',
            nameEn: 'First Secondary (Mega Goal 1)',
            nameAr: 'الأول الثانوي (سلسلة Mega Goal 1)',
            semesters: [
              {
                id: 'ksa_s1',
                semesterNumber: 1,
                nameEn: 'Term 1',
                nameAr: 'الفصل الدراسي الأول',
                units: [
                  {
                    id: 'ksa_mg1_u1',
                    unitNumber: 1,
                    titleEn: 'Big Changes & Global Vision',
                    titleAr: 'تغيرات كبرى ورؤية عالمية',
                    textbookName: 'Mega Goal 1 - Ministry of Education KSA',
                    lessons: [
                      {
                        id: 'ksa_l1',
                        unitId: 'ksa_mg1_u1',
                        titleEn: 'Vision 2030 and Sustainable Cities',
                        titleAr: 'رؤية 2030 والمدن المستدامة',
                        descriptionEn: 'Future tenses, economic vocabulary, and development goals.',
                        descriptionAr: 'صيغ المستقبل، مفردات التنمية، وأهداف الاستدامة.',
                        textbookName: 'Mega Goal 1',
                        verified: true,
                        source: 'Saudi Ministry of Education Curriculum Library',
                        version: 'Verified 2025/2026',
                        vocabulary: [
                          {
                            id: 'ksa_v1',
                            word: 'initiative',
                            translation: 'مبادرة / مشروع ريادي',
                            definition: 'An act or strategy intended to resolve a difficulty or improve a situation.',
                            partOfSpeech: 'noun',
                            difficulty: 'medium',
                            cefr: 'B2',
                            exampleSentence: 'The green initiative aims to increase tree canopy cover.',
                            exampleTranslation: 'تهدف المبادرة الخضراء إلى زيادة الرقعة الشجرية.',
                            category: 'Academic English',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          }
                        ],
                        grammarNotes: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'egypt',
    nameEn: 'Egypt',
    nameAr: 'جمهورية مصر العربية',
    flag: '🇪🇬',
    verified: true,
    lastUpdated: '2026-09-20',
    stages: [
      {
        id: 'secondary',
        nameEn: 'General Secondary (Thanaweya Amma)',
        nameAr: 'المرحلة الثانوية العامة (سلسلة New Hello)',
        grades: [
          {
            id: 'egy_sec_3',
            gradeNumber: '3rd Secondary',
            nameEn: 'Third Secondary (New Hello! for English)',
            nameAr: 'الصف الثالث الثانوي (كتاب New Hello الرسمي)',
            semesters: [
              {
                id: 'egy_s1',
                semesterNumber: 1,
                nameEn: 'First Term',
                nameAr: 'الفصل الدراسي الأول',
                units: [
                  {
                    id: 'egy_u1',
                    unitNumber: 1,
                    titleEn: 'Read All About It: Media, Journalism & Integrity',
                    titleAr: 'اقرأ كل شيء عن هذا: الإعلام والصحافة والمصداقية',
                    textbookName: 'New Hello! English for Secondary Schools Year 3',
                    lessons: [
                      {
                        id: 'egy_l1',
                        unitId: 'egy_u1',
                        titleEn: 'Sensationalism vs Fact-Checking in Journalism',
                        titleAr: 'الإثارة الصحفية مقابل التحقق من الحقائق في الإعلام',
                        descriptionEn: 'Past continuous, past perfect, and media terminology.',
                        descriptionAr: 'الماضي المستمر والتام ومصطلحات الصحافة والتحقيق.',
                        textbookName: 'New Hello! Year 3',
                        verified: true,
                        source: 'Egyptian Ministry of Education',
                        version: 'Verified National Curriculum',
                        vocabulary: [
                          {
                            id: 'egy_v1',
                            word: 'piracy',
                            translation: 'قرصنة (فكرية أو بحرية)',
                            definition: 'The unauthorized reproduction or use of a copyrighted book, recording, television program, or patented work.',
                            partOfSpeech: 'noun',
                            difficulty: 'medium',
                            cefr: 'B2',
                            exampleSentence: 'Publishers work hard to protect books against digital piracy.',
                            exampleTranslation: 'يعمل الناشرون بجد لحماية الكتب من القرصنة الرقمية.',
                            category: 'Academic English',
                            verified: true,
                            srsStage: 0,
                            nextReviewDate: new Date().toISOString(),
                            correctCount: 0,
                            incorrectCount: 0,
                          }
                        ],
                        grammarNotes: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
