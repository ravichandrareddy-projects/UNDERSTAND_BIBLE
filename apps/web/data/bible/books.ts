import type { BibleBook, CanonSection } from './types';

export const CANON_SECTION_LABELS: Record<
  CanonSection,
  { en: string; te: string; ar: string }
> = {
  law: { en: 'Law (Pentateuch)', te: 'ధర్మశాస్త్రం (తోరా)', ar: 'التوراة والناموس' },
  history: {
    en: 'Historical Books',
    te: 'చరిత్ర గ్రంథాలు',
    ar: 'الأسفار التاريخية',
  },
  wisdom: {
    en: 'Poetry & Wisdom',
    te: 'జ్ఞాన & కవితా గ్రంథాలు',
    ar: 'أسفار الحكمة والشعر',
  },
  major_prophets: {
    en: 'Major Prophets',
    te: 'ప్రధాన ప్రవక్తలు',
    ar: 'الأنبياء الكبار',
  },
  minor_prophets: {
    en: 'Minor Prophets',
    te: 'చిన్న ప్రవక్తలు',
    ar: 'الأنبياء الصغار',
  },
  gospels: { en: 'The Gospels', te: 'సువార్తలు', ar: 'الأناجيل' },
  acts: { en: 'Apostolic History', te: 'అపొస్తలుల కార్యములు', ar: 'أعمال الرسل' },
  epistles: { en: 'Epistles & Letters', te: 'పత్రికలు', ar: 'الرسائل' },
  revelation: {
    en: 'Apocalypse / Prophecy',
    te: 'ప్రకటన గ్రంథం',
    ar: 'الرؤيا والنبوة',
  },
};

export const BIBLE_BOOKS: BibleBook[] = [
  // ===================== OLD TESTAMENT (39 BOOKS) =====================
  // 1. Law (Pentateuch)
  {
    id: 'GEN',
    slug: 'genesis',
    testament: 'OT',
    section: 'law',
    chaptersCount: 50,
    names: { en: 'Genesis', te: 'ఆదికాండము', ar: 'التكوين' },
    abbreviations: { en: ['Gen', 'Ge', 'Gn'], te: ['ఆది'], ar: ['تك'] },
  },
  {
    id: 'EXO',
    slug: 'exodus',
    testament: 'OT',
    section: 'law',
    chaptersCount: 40,
    names: { en: 'Exodus', te: 'నిర్గమకాండము', ar: 'الخروج' },
    abbreviations: { en: ['Exod', 'Exo', 'Ex'], te: ['నిర్గ'], ar: ['خر'] },
  },
  {
    id: 'LEV',
    slug: 'leviticus',
    testament: 'OT',
    section: 'law',
    chaptersCount: 27,
    names: { en: 'Leviticus', te: 'లేవీయకాండము', ar: 'اللاويين' },
    abbreviations: { en: ['Lev', 'Le', 'Lv'], te: ['లేవీ'], ar: ['لا'] },
  },
  {
    id: 'NUM',
    slug: 'numbers',
    testament: 'OT',
    section: 'law',
    chaptersCount: 36,
    names: { en: 'Numbers', te: 'సంఖ్యాకాండము', ar: 'العدد' },
    abbreviations: { en: ['Num', 'Nu', 'Nm'], te: ['సంఖ్యా'], ar: ['عد'] },
  },
  {
    id: 'DEU',
    slug: 'deuteronomy',
    testament: 'OT',
    section: 'law',
    chaptersCount: 34,
    names: { en: 'Deuteronomy', te: 'ద్వితీయోపదేశకాండము', ar: 'التثنية' },
    abbreviations: { en: ['Deut', 'Deu', 'Dt'], te: ['ద్వితీ'], ar: ['تث'] },
  },

  // 2. History
  {
    id: 'JOS',
    slug: 'joshua',
    testament: 'OT',
    section: 'history',
    chaptersCount: 24,
    names: { en: 'Joshua', te: 'యెహోషువ', ar: 'يشوع' },
    abbreviations: { en: ['Josh', 'Jos'], te: ['యెహో'], ar: ['يش'] },
  },
  {
    id: 'JDG',
    slug: 'judges',
    testament: 'OT',
    section: 'history',
    chaptersCount: 21,
    names: { en: 'Judges', te: 'న్యాయాధిపతులు', ar: 'القضاة' },
    abbreviations: { en: ['Judg', 'Jdg'], te: ['న్యాయా'], ar: ['قض'] },
  },
  {
    id: 'RUT',
    slug: 'ruth',
    testament: 'OT',
    section: 'history',
    chaptersCount: 4,
    names: { en: 'Ruth', te: 'రూతు', ar: 'راعوث' },
    abbreviations: { en: ['Ruth', 'Rth', 'Ru'], te: ['రూతు'], ar: ['را'] },
  },
  {
    id: '1SA',
    slug: '1-samuel',
    testament: 'OT',
    section: 'history',
    chaptersCount: 31,
    names: { en: '1 Samuel', te: '1 సమూయేలు', ar: 'صموئيل الأول' },
    abbreviations: { en: ['1Sam', '1Sa', '1S'], te: ['1 సమూ'], ar: ['1 صم'] },
  },
  {
    id: '2SA',
    slug: '2-samuel',
    testament: 'OT',
    section: 'history',
    chaptersCount: 24,
    names: { en: '2 Samuel', te: '2 సమూయేలు', ar: 'صموئيل الثاني' },
    abbreviations: { en: ['2Sam', '2Sa', '2S'], te: ['2 సమూ'], ar: ['2 صم'] },
  },
  {
    id: '1KI',
    slug: '1-kings',
    testament: 'OT',
    section: 'history',
    chaptersCount: 22,
    names: { en: '1 Kings', te: '1 రాజులు', ar: 'الملوك الأول' },
    abbreviations: { en: ['1Kgs', '1Ki', '1K'], te: ['1 రాజు'], ar: ['1 مل'] },
  },
  {
    id: '2KI',
    slug: '2-kings',
    testament: 'OT',
    section: 'history',
    chaptersCount: 25,
    names: { en: '2 Kings', te: '2 రాజులు', ar: 'الملوك الثاني' },
    abbreviations: { en: ['2Kgs', '2Ki', '2K'], te: ['2 రాజు'], ar: ['2 مل'] },
  },
  {
    id: '1CH',
    slug: '1-chronicles',
    testament: 'OT',
    section: 'history',
    chaptersCount: 29,
    names: {
      en: '1 Chronicles',
      te: '1 దినవృత్తాంతములు',
      ar: 'أخبار الأيام الأول',
    },
    abbreviations: {
      en: ['1Chron', '1Chr', '1Ch'],
      te: ['1 దిన'],
      ar: ['1 أخ'],
    },
  },
  {
    id: '2CH',
    slug: '2-chronicles',
    testament: 'OT',
    section: 'history',
    chaptersCount: 36,
    names: {
      en: '2 Chronicles',
      te: '2 దినవృత్తాంతములు',
      ar: 'أخبار الأيام الثاني',
    },
    abbreviations: {
      en: ['2Chron', '2Chr', '2Ch'],
      te: ['2 దిన'],
      ar: ['2 أخ'],
    },
  },
  {
    id: 'EZR',
    slug: 'ezra',
    testament: 'OT',
    section: 'history',
    chaptersCount: 10,
    names: { en: 'Ezra', te: 'ఎజ్రా', ar: 'عزرا' },
    abbreviations: { en: ['Ezra', 'Ezr'], te: ['ఎజ్రా'], ar: ['عز'] },
  },
  {
    id: 'NEH',
    slug: 'nehemiah',
    testament: 'OT',
    section: 'history',
    chaptersCount: 13,
    names: { en: 'Nehemiah', te: 'నెహెమ్యా', ar: 'نحميا' },
    abbreviations: { en: ['Neh', 'Ne'], te: ['నెహె'], ar: ['نح'] },
  },
  {
    id: 'EST',
    slug: 'esther',
    testament: 'OT',
    section: 'history',
    chaptersCount: 10,
    names: { en: 'Esther', te: 'ఎస్తేరు', ar: 'أستير' },
    abbreviations: { en: ['Esth', 'Est', 'Es'], te: ['ఎస్తే'], ar: ['أس'] },
  },

  // 3. Poetry & Wisdom
  {
    id: 'JOB',
    slug: 'job',
    testament: 'OT',
    section: 'wisdom',
    chaptersCount: 42,
    names: { en: 'Job', te: 'యోబు', ar: 'أيوب' },
    abbreviations: { en: ['Job', 'Jb'], te: ['యోబు'], ar: ['أي'] },
  },
  {
    id: 'PSA',
    slug: 'psalms',
    testament: 'OT',
    section: 'wisdom',
    chaptersCount: 150,
    names: { en: 'Psalms', te: 'కీర్తనలు', ar: 'المزامير' },
    abbreviations: { en: ['Ps', 'Psa', 'Psm'], te: ['కీర్త'], ar: ['مز'] },
  },
  {
    id: 'PRO',
    slug: 'proverbs',
    testament: 'OT',
    section: 'wisdom',
    chaptersCount: 31,
    names: { en: 'Proverbs', te: 'సామెతలు', ar: 'الأمثال' },
    abbreviations: { en: ['Prov', 'Pro', 'Pr'], te: ['సామె'], ar: ['أم'] },
  },
  {
    id: 'ECC',
    slug: 'ecclesiastes',
    testament: 'OT',
    section: 'wisdom',
    chaptersCount: 12,
    names: { en: 'Ecclesiastes', te: 'ప్రసంగి', ar: 'الجامعة' },
    abbreviations: { en: ['Eccl', 'Ecc', 'Ec'], te: ['ప్రసం'], ar: ['جا'] },
  },
  {
    id: 'SNG',
    slug: 'song-of-solomon',
    testament: 'OT',
    section: 'wisdom',
    chaptersCount: 8,
    names: { en: 'Song of Solomon', te: 'పరమగీతము', ar: 'نشيد الأنشاد' },
    abbreviations: { en: ['Song', 'Sng', 'SS'], te: ['పరమ'], ar: ['نش'] },
  },

  // 4. Major Prophets
  {
    id: 'ISA',
    slug: 'isaiah',
    testament: 'OT',
    section: 'major_prophets',
    chaptersCount: 66,
    names: { en: 'Isaiah', te: 'యెషయా', ar: 'إشعياء' },
    abbreviations: { en: ['Isa', 'Is'], te: ['యెష'], ar: ['إش'] },
  },
  {
    id: 'JER',
    slug: 'jeremiah',
    testament: 'OT',
    section: 'major_prophets',
    chaptersCount: 52,
    names: { en: 'Jeremiah', te: 'యిర్మీయా', ar: 'إرميا' },
    abbreviations: { en: ['Jer', 'Je', 'Jr'], te: ['యిర్మీ'], ar: ['إر'] },
  },
  {
    id: 'LAM',
    slug: 'lamentations',
    testament: 'OT',
    section: 'major_prophets',
    chaptersCount: 5,
    names: { en: 'Lamentations', te: 'విలాపవాక్యములు', ar: 'مراثي إرميا' },
    abbreviations: { en: ['Lam', 'La'], te: ['విలా'], ar: ['مرا'] },
  },
  {
    id: 'EZK',
    slug: 'ezekiel',
    testament: 'OT',
    section: 'major_prophets',
    chaptersCount: 48,
    names: { en: 'Ezekiel', te: 'యెహెజ్కేలు', ar: 'حزقيال' },
    abbreviations: { en: ['Ezek', 'Ezk'], te: ['యెహెజ్కే'], ar: ['حز'] },
  },
  {
    id: 'DAN',
    slug: 'daniel',
    testament: 'OT',
    section: 'major_prophets',
    chaptersCount: 12,
    names: { en: 'Daniel', te: 'దానియేలు', ar: 'دانيال' },
    abbreviations: { en: ['Dan', 'Da', 'Dn'], te: ['దాని'], ar: ['دا'] },
  },

  // 5. Minor Prophets
  {
    id: 'HOS',
    slug: 'hosea',
    testament: 'OT',
    section: 'minor_prophets',
    chaptersCount: 14,
    names: { en: 'Hosea', te: 'హోషేయ', ar: 'هوشع' },
    abbreviations: { en: ['Hos', 'Ho'], te: ['హోషే'], ar: ['هو'] },
  },
  {
    id: 'JOL',
    slug: 'joel',
    testament: 'OT',
    section: 'minor_prophets',
    chaptersCount: 3,
    names: { en: 'Joel', te: 'యోవేలు', ar: 'يوئيل' },
    abbreviations: { en: ['Joel', 'Joe', 'Jl'], te: ['యోవే'], ar: ['يؤ'] },
  },
  {
    id: 'AMO',
    slug: 'amos',
    testament: 'OT',
    section: 'minor_prophets',
    chaptersCount: 9,
    names: { en: 'Amos', te: 'ఆమోసు', ar: 'عاموس' },
    abbreviations: { en: ['Amos', 'Am'], te: ['ఆమో'], ar: ['عا'] },
  },
  {
    id: 'OBA',
    slug: 'obadiah',
    testament: 'OT',
    section: 'minor_prophets',
    chaptersCount: 1,
    names: { en: 'Obadiah', te: 'ఓబద్యా', ar: 'عوبديا' },
    abbreviations: { en: ['Obad', 'Oba', 'Ob'], te: ['ఓబ'], ar: ['عو'] },
  },
  {
    id: 'JON',
    slug: 'jonah',
    testament: 'OT',
    section: 'minor_prophets',
    chaptersCount: 4,
    names: { en: 'Jonah', te: 'యోనా', ar: 'يونان' },
    abbreviations: { en: ['Jonah', 'Jon', 'Jnh'], te: ['యోనా'], ar: ['يون'] },
  },
  {
    id: 'MIC',
    slug: 'micah',
    testament: 'OT',
    section: 'minor_prophets',
    chaptersCount: 7,
    names: { en: 'Micah', te: 'మీకా', ar: 'ميخا' },
    abbreviations: { en: ['Mic', 'Mc'], te: ['మీకా'], ar: ['مي'] },
  },
  {
    id: 'NAM',
    slug: 'nahum',
    testament: 'OT',
    section: 'minor_prophets',
    chaptersCount: 3,
    names: { en: 'Nahum', te: 'నహూము', ar: 'ناحوم' },
    abbreviations: { en: ['Nah', 'Na'], te: ['నహూ'], ar: ['نا'] },
  },
  {
    id: 'HAB',
    slug: 'habakkuk',
    testament: 'OT',
    section: 'minor_prophets',
    chaptersCount: 3,
    names: { en: 'Habakkuk', te: 'హబక్కూకు', ar: 'حبقوق' },
    abbreviations: { en: ['Hab', 'Hb'], te: ['హబ'], ar: ['حب'] },
  },
  {
    id: 'ZEP',
    slug: 'zephaniah',
    testament: 'OT',
    section: 'minor_prophets',
    chaptersCount: 3,
    names: { en: 'Zephaniah', te: 'జెఫన్యా', ar: 'صفنيا' },
    abbreviations: { en: ['Zeph', 'Zep', 'Zp'], te: ['జెఫ'], ar: ['صف'] },
  },
  {
    id: 'HAG',
    slug: 'haggai',
    testament: 'OT',
    section: 'minor_prophets',
    chaptersCount: 2,
    names: { en: 'Haggai', te: 'హగ్గయి', ar: 'حجي' },
    abbreviations: { en: ['Hag', 'Hg'], te: ['హగ్గ'], ar: ['حج'] },
  },
  {
    id: 'ZEC',
    slug: 'zechariah',
    testament: 'OT',
    section: 'minor_prophets',
    chaptersCount: 14,
    names: { en: 'Zechariah', te: 'జెకర్యా', ar: 'زكريا' },
    abbreviations: { en: ['Zech', 'Zec', 'Zc'], te: ['జెక'], ar: ['زك'] },
  },
  {
    id: 'MAL',
    slug: 'malachi',
    testament: 'OT',
    section: 'minor_prophets',
    chaptersCount: 4,
    names: { en: 'Malachi', te: 'మలాకీ', ar: 'ملاخي' },
    abbreviations: { en: ['Mal', 'Ml'], te: ['మలా'], ar: ['مل'] },
  },

  // ===================== NEW TESTAMENT (27 BOOKS) =====================
  // 6. Gospels
  {
    id: 'MAT',
    slug: 'matthew',
    testament: 'NT',
    section: 'gospels',
    chaptersCount: 28,
    names: { en: 'Matthew', te: 'మత్తయి సువార్త', ar: 'متى' },
    abbreviations: { en: ['Matt', 'Mat', 'Mt'], te: ['మత్త'], ar: ['مت'] },
  },
  {
    id: 'MRK',
    slug: 'mark',
    testament: 'NT',
    section: 'gospels',
    chaptersCount: 16,
    names: { en: 'Mark', te: 'మార్కు సువార్త', ar: 'مرقس' },
    abbreviations: { en: ['Mark', 'Mrk', 'Mk'], te: ['మార్కు'], ar: ['مر'] },
  },
  {
    id: 'LUK',
    slug: 'luke',
    testament: 'NT',
    section: 'gospels',
    chaptersCount: 24,
    names: { en: 'Luke', te: 'లూకా సువార్త', ar: 'لوقا' },
    abbreviations: { en: ['Luke', 'Luk', 'Lk'], te: ['లూకా'], ar: ['لو'] },
  },
  {
    id: 'JHN',
    slug: 'john',
    testament: 'NT',
    section: 'gospels',
    chaptersCount: 21,
    names: { en: 'John', te: 'యోహాను సువార్త', ar: 'يوحنا' },
    abbreviations: { en: ['John', 'Jhn', 'Jn'], te: ['యోహా'], ar: ['يو'] },
  },

  // 7. Acts
  {
    id: 'ACT',
    slug: 'acts',
    testament: 'NT',
    section: 'acts',
    chaptersCount: 28,
    names: { en: 'Acts', te: 'అపొస్తలుల కార్యములు', ar: 'أعمال الرسل' },
    abbreviations: { en: ['Acts', 'Act', 'Ac'], te: ['అపొ'], ar: ['أع'] },
  },

  // 8. Epistles
  {
    id: 'ROM',
    slug: 'romans',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 16,
    names: { en: 'Romans', te: 'రోమీయులకు', ar: 'رومية' },
    abbreviations: { en: ['Rom', 'Ro', 'Rm'], te: ['రోమా'], ar: ['رو'] },
  },
  {
    id: '1CO',
    slug: '1-corinthians',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 16,
    names: { en: '1 Corinthians', te: '1 కొరింథీయులకు', ar: 'كورنثوس الأولى' },
    abbreviations: { en: ['1Cor', '1Co'], te: ['1 కొరిం'], ar: ['1 كو'] },
  },
  {
    id: '2CO',
    slug: '2-corinthians',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 13,
    names: { en: '2 Corinthians', te: '2 కొరింథీయులకు', ar: 'كورنثوس الثانية' },
    abbreviations: { en: ['2Cor', '2Co'], te: ['2 కొరిం'], ar: ['2 كو'] },
  },
  {
    id: 'GAL',
    slug: 'galatians',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 6,
    names: { en: 'Galatians', te: 'గలతీయులకు', ar: 'غلاطية' },
    abbreviations: { en: ['Gal', 'Ga'], te: ['గలతీ'], ar: ['غل'] },
  },
  {
    id: 'EPH',
    slug: 'ephesians',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 6,
    names: { en: 'Ephesians', te: 'ఎఫెసీయులకు', ar: 'أفسس' },
    abbreviations: { en: ['Eph', 'Ep'], te: ['ఎఫెసీ'], ar: ['أف'] },
  },
  {
    id: 'PHP',
    slug: 'philippians',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 4,
    names: { en: 'Philippians', te: 'ఫిలిప్పీయులకు', ar: 'فيلبي' },
    abbreviations: { en: ['Phil', 'Php', 'Pp'], te: ['ఫిలిప్పీ'], ar: ['في'] },
  },
  {
    id: 'COL',
    slug: 'colossians',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 4,
    names: { en: 'Colossians', te: 'కొలొస్సయులకు', ar: 'كولوسي' },
    abbreviations: { en: ['Col', 'Co'], te: ['కొలొస్స'], ar: ['كو'] },
  },
  {
    id: '1TH',
    slug: '1-thessalonians',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 5,
    names: {
      en: '1 Thessalonians',
      te: '1 థెస్సలొనీకయులకు',
      ar: 'تسالونيكي الأولى',
    },
    abbreviations: { en: ['1Thess', '1Th'], te: ['1 థెస్స'], ar: ['1 تس'] },
  },
  {
    id: '2TH',
    slug: '2-thessalonians',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 3,
    names: {
      en: '2 Thessalonians',
      te: '2 థెస్సలొనీకయులకు',
      ar: 'تسالونيكي الثانية',
    },
    abbreviations: { en: ['2Thess', '2Th'], te: ['2 థెస్స'], ar: ['2 تس'] },
  },
  {
    id: '1TI',
    slug: '1-timothy',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 6,
    names: { en: '1 Timothy', te: '1 తిమోతికి', ar: 'تيموثاوس الأولى' },
    abbreviations: { en: ['1Tim', '1Ti'], te: ['1 తిమో'], ar: ['1 تي'] },
  },
  {
    id: '2TI',
    slug: '2-timothy',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 4,
    names: { en: '2 Timothy', te: '2 తిమోతికి', ar: 'تيموثاوس الثانية' },
    abbreviations: { en: ['2Tim', '2Ti'], te: ['2 తిమో'], ar: ['2 تي'] },
  },
  {
    id: 'TIT',
    slug: 'titus',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 3,
    names: { en: 'Titus', te: 'తీతుకు', ar: 'تيطس' },
    abbreviations: { en: ['Titus', 'Tit', 'Ti'], te: ['తీతు'], ar: ['يط'] },
  },
  {
    id: 'PHM',
    slug: 'philemon',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 1,
    names: { en: 'Philemon', te: 'ఫిలేమోనుకు', ar: 'فليمون' },
    abbreviations: { en: ['Phlm', 'Phm', 'Pm'], te: ['ఫిలే'], ar: ['فل'] },
  },
  {
    id: 'HEB',
    slug: 'hebrews',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 13,
    names: { en: 'Hebrews', te: 'హెబ్రీయులకు', ar: 'العبرانيين' },
    abbreviations: { en: ['Heb', 'He'], te: ['హెబ్రీ'], ar: ['عب'] },
  },
  {
    id: 'JAS',
    slug: 'james',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 5,
    names: { en: 'James', te: 'యాకోబు', ar: 'يعقوب' },
    abbreviations: { en: ['Jas', 'Jm'], te: ['యాకో'], ar: ['يع'] },
  },
  {
    id: '1PE',
    slug: '1-peter',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 5,
    names: { en: '1 Peter', te: '1 పేతురు', ar: 'بطرس الأولى' },
    abbreviations: { en: ['1Pet', '1Pe', '1Pt'], te: ['1 పేతు'], ar: ['1 بط'] },
  },
  {
    id: '2PE',
    slug: '2-peter',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 3,
    names: { en: '2 Peter', te: '2 పేతురు', ar: 'بطرس الثانية' },
    abbreviations: { en: ['2Pet', '2Pe', '2Pt'], te: ['2 పేతు'], ar: ['2 بط'] },
  },
  {
    id: '1JN',
    slug: '1-john',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 5,
    names: { en: '1 John', te: '1 యోహాను', ar: 'يوحنا الأولى' },
    abbreviations: { en: ['1John', '1Jn', '1J'], te: ['1 యోహా'], ar: ['1 يو'] },
  },
  {
    id: '2JN',
    slug: '2-john',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 1,
    names: { en: '2 John', te: '2 యోహాను', ar: 'يوحنا الثانية' },
    abbreviations: { en: ['2John', '2Jn', '2J'], te: ['2 యోహా'], ar: ['2 يو'] },
  },
  {
    id: '3JN',
    slug: '3-john',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 1,
    names: { en: '3 John', te: '3 యోహాను', ar: 'يوحنا الثالثة' },
    abbreviations: { en: ['3John', '3Jn', '3J'], te: ['3 యోహా'], ar: ['3 يو'] },
  },
  {
    id: 'JUD',
    slug: 'jude',
    testament: 'NT',
    section: 'epistles',
    chaptersCount: 1,
    names: { en: 'Jude', te: 'యూదా', ar: 'يهوذا' },
    abbreviations: { en: ['Jude', 'Jud', 'Jd'], te: ['యూదా'], ar: ['يه'] },
  },

  // 9. Revelation
  {
    id: 'REV',
    slug: 'revelation',
    testament: 'NT',
    section: 'revelation',
    chaptersCount: 22,
    names: { en: 'Revelation', te: 'ప్రకటన గ్రంథము', ar: 'رؤيا يوحنا' },
    abbreviations: { en: ['Rev', 'Rv'], te: ['ప్రక'], ar: ['رؤ'] },
  },
];

// ===================== DEUTEROCANONICAL BOOKS (CATHOLIC CANON - 7 BOOKS) =====================
export const DEUTEROCANONICAL_BOOKS: BibleBook[] = [
  {
    id: 'TOB',
    slug: 'tobit',
    testament: 'OT',
    section: 'history',
    chaptersCount: 14,
    names: { en: 'Tobit', te: 'తోబీతు', ar: 'طوبيا' },
    abbreviations: { en: ['Tob', 'Tb'], te: ['తోబీ'], ar: ['طو'] },
  },
  {
    id: 'JDT',
    slug: 'judith',
    testament: 'OT',
    section: 'history',
    chaptersCount: 16,
    names: { en: 'Judith', te: 'యూదితు', ar: 'يهوديت' },
    abbreviations: { en: ['Jdt', 'Jd'], te: ['యూది'], ar: ['يه'] },
  },
  {
    id: '1MA',
    slug: '1-maccabees',
    testament: 'OT',
    section: 'history',
    chaptersCount: 16,
    names: { en: '1 Maccabees', te: '1 మక్కబీయులు', ar: 'مكابيين أول' },
    abbreviations: { en: ['1Mac', '1Ma'], te: ['1మక్క'], ar: ['1مك'] },
  },
  {
    id: '2MA',
    slug: '2-maccabees',
    testament: 'OT',
    section: 'history',
    chaptersCount: 15,
    names: { en: '2 Maccabees', te: '2 మక్కబీయులు', ar: 'مكابيين ثاني' },
    abbreviations: { en: ['2Mac', '2Ma'], te: ['2మక్క'], ar: ['2مك'] },
  },
  {
    id: 'WIS',
    slug: 'wisdom',
    testament: 'OT',
    section: 'wisdom',
    chaptersCount: 19,
    names: {
      en: 'Wisdom of Solomon',
      te: 'సొలొమోను జ్ఞానగ్రంథము',
      ar: 'حكمة سليمان',
    },
    abbreviations: { en: ['Wis', 'Ws'], te: ['జ్ఞాన'], ar: ['حك'] },
  },
  {
    id: 'SIR',
    slug: 'sirach',
    testament: 'OT',
    section: 'wisdom',
    chaptersCount: 51,
    names: {
      en: 'Sirach (Ecclesiasticus)',
      te: 'సీరా జ్ఞానగ్రంథము',
      ar: 'يشوع بن سيراخ',
    },
    abbreviations: { en: ['Sir', 'Ecclus'], te: ['సీరా'], ar: ['سي'] },
  },
  {
    id: 'BAR',
    slug: 'baruch',
    testament: 'OT',
    section: 'major_prophets',
    chaptersCount: 6,
    names: { en: 'Baruch', te: 'బారూకు', ar: 'باروخ' },
    abbreviations: { en: ['Bar', 'Ba'], te: ['బారూ'], ar: ['بار'] },
  },
];

/**
 * Returns books for a given tradition.
 * Catholic tradition includes 73 books (66 standard + 7 deuterocanonical).
 */
export function getBooksForTradition(
  tradition: 'protestant' | 'catholic' | 'orthodox' = 'protestant',
): BibleBook[] {
  if (tradition === 'catholic') {
    return [...BIBLE_BOOKS, ...DEUTEROCANONICAL_BOOKS];
  }
  return BIBLE_BOOKS;
}

/**
 * Returns the 1-based canonical index of a book within the specified canon.
 * Crucial for the 3D Bible-opening animation direction calculation.
 */
export function getBookOrder(
  bookId: string,
  tradition: 'protestant' | 'catholic' | 'orthodox' = 'protestant',
): number {
  const normalized = bookId.toUpperCase();
  const list = getBooksForTradition(tradition);
  const index = list.findIndex(
    (b) => b.id === normalized || b.slug === bookId.toLowerCase(),
  );
  return index !== -1 ? index + 1 : 1;
}

export function getBook(
  idOrSlug: string,
  tradition: 'protestant' | 'catholic' | 'orthodox' = 'protestant',
): BibleBook {
  const normalized = idOrSlug.toUpperCase();
  const list = getBooksForTradition(tradition);
  const book = list.find(
    (b) => b.id === normalized || b.slug === idOrSlug.toLowerCase(),
  );
  return (book ?? BIBLE_BOOKS[0]) as BibleBook; // Default to Genesis
}

export function searchBooks(
  query: string,
  locale: 'en' | 'te' | 'ar' = 'en',
  tradition: 'protestant' | 'catholic' | 'orthodox' = 'protestant',
): BibleBook[] {
  const q = query.trim().toLowerCase();
  const list = getBooksForTradition(tradition);
  if (!q) return list;

  return list.filter((b) => {
    // Check ID
    if (b.id.toLowerCase().includes(q)) return true;
    // Check localized name
    if (b.names[locale]?.toLowerCase().includes(q)) return true;
    if (b.names.en.toLowerCase().includes(q)) return true;
    // Check abbreviations
    if (b.abbreviations[locale]?.some((abbr) => abbr.toLowerCase().includes(q)))
      return true;
    if (b.abbreviations.en.some((abbr) => abbr.toLowerCase().includes(q)))
      return true;
    return false;
  });
}
