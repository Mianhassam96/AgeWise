'use strict';
/* ═══════════════════════════════════════════════
   WaqtX — Islamic History Engine  v2A
   Structured knowledge base with source attribution,
   evidence certainty levels, and curated collections.

   SCHEMA (full, v2A):
   {
     id:           string   — unique kebab-case identifier
     type:         string   — event | person | place | dynasty | concept | civilization
     collection:   string   — seerah | prophets | companions | scholars | events |
                               dynasties | civilizations | places
     era:          string   — seerah | rashidun | umayyad | abbasid | ottoman |
                               mamluk | scholars | modern | prophets | companions
     title:        string
     subtitle:     string   — short tagline
     date: {
       hijri:      string   — Hijri date string
       gregorian:  string   — CE/BCE date string
     }
     startDate:    number   — approximate CE year (negative = BCE), for sorting/timeline
     endDate:      number   — CE year, for dynasties/civilizations (null for point events)
     location:     string   — primary location string
     summary:      string   — 2–3 sentence overview
     details:      string   — extended, nuanced account
     people:       string[] — array of person IDs
     relatedEvents: string[] — array of event IDs
     relatedPlaces: string[] — array of place IDs
     topics:       string[] — e.g. ['knowledge','science','medicine','architecture']
     sources: [{
       type:  string  — quran | hadith | classical | academic | disputed
       ref:   string  — full reference
       note:  string  — explanatory note
     }]
     certainty:    string   — established | probable | disputed
     tags:         string[]
     dayOfYear:    number|null — 1–365 for "This Day" matching
   }

   SOURCE TYPES:
     quran     — direct Quranic reference (surah:verse)
     hadith    — collection + book + number + grading
     classical — traditional Muslim scholarly sources
     academic  — modern historical scholarship
     disputed  — conflicting reports; we note the disagreement

   CERTAINTY LEVELS:
     established — confirmed by Quran and/or mutawatir hadith
     probable    — well-attested classical sources, scholarly consensus
     disputed    — conflicting accounts exist; disagreement noted

   RULE: We never present uncertain details as established fact.
         If accounts differ, we say so.
   ═══════════════════════════════════════════════ */

window.WAQTX_HISTORY = window.WAQTX_HISTORY || {};
var H = window.WAQTX_HISTORY;

/* ── Separate named collections ── */
H.events         = [];
H.people         = [];
H.prophets       = [];
H.companions     = [];
H.scholars       = [];
H.dynasties      = [];
H.civilizations  = [];
H.places         = [];

/* ══════════════════════════════════════
   ERA METADATA
   ══════════════════════════════════════ */
H.ERAS = {
  prophets:   { label: 'The Prophets',        cssClass: 'era-prophets',  startYear: -9999,  endYear: 570,   next: 'seerah',    prev: null },
  seerah:     { label: 'Seerah',              cssClass: 'era-seerah',    startYear: 570,    endYear: 632,   next: 'rashidun',  prev: 'prophets' },
  rashidun:   { label: 'Rashidun Era',        cssClass: 'era-rashidun',  startYear: 632,    endYear: 661,   next: 'umayyad',   prev: 'seerah' },
  umayyad:    { label: 'Umayyad Era',         cssClass: 'era-umayyad',   startYear: 661,    endYear: 750,   next: 'abbasid',   prev: 'rashidun' },
  abbasid:    { label: 'Abbasid Era',         cssClass: 'era-abbasid',   startYear: 750,    endYear: 1258,  next: 'ottoman',   prev: 'umayyad' },
  ottoman:    { label: 'Ottoman Era',         cssClass: 'era-ottoman',   startYear: 1299,   endYear: 1924,  next: 'modern',    prev: 'abbasid' },
  mamluk:     { label: 'Mamluk Era',          cssClass: 'era-abbasid',   startYear: 1250,   endYear: 1517,  next: 'ottoman',   prev: 'abbasid' },
  scholars:   { label: 'Scholars & Science',  cssClass: 'era-scholars',  startYear: 700,    endYear: 1400,  next: null,        prev: null },
  companions: { label: 'Companions',          cssClass: 'era-rashidun',  startYear: 570,    endYear: 680,   next: 'rashidun',  prev: 'seerah' },
  modern:     { label: 'Modern Era',          cssClass: 'era-modern',    startYear: 1800,   endYear: 9999,  next: null,        prev: 'ottoman' }
};
H.ERA_LABELS = {};
Object.keys(H.ERAS).forEach(function(k) { H.ERA_LABELS[k] = H.ERAS[k].label; });

/* ══════════════════════════════════════════════════════════
   COLLECTION 1 — PROPHETS
   Sources: Quran only for established facts.
   No biographical details not in Quran are presented
   as established. Classical sources noted where relevant.
   ══════════════════════════════════════════════════════════ */
H.prophets = [
  {
    id: 'adam-pbuh',
    type: 'person', collection: 'prophets', era: 'prophets',
    title: 'Adam (عليه السلام)',
    subtitle: 'The first human being — the first Prophet',
    date: { hijri: 'Before recorded history', gregorian: 'Before recorded time' },
    startDate: -9999, endDate: null,
    location: 'Created in the heavens; settled on Earth',
    summary: 'Adam (AS) is described in the Quran as the first human being, created by Allah and then taught the names of all things. He and his wife Hawwa were settled in the garden (janna), then descended to Earth after eating from the forbidden tree. He was the first Prophet. Allah taught him repentance, and his repentance was accepted.',
    details: 'The Quran describes Adam\'s creation with care: Allah fashioned him, breathed His spirit into him, commanded the angels to prostrate before him, and taught him the names of all things — a sign of the knowledge granted to humanity. Iblis (Shaytan) refused to prostrate out of arrogance, and this refusal marked the beginning of enmity between human beings and Shaytan. Adam and Hawwa\'s time in the garden, their error, and their subsequent repentance are described across multiple Surahs. Allah accepted their repentance and sent them to Earth as His khalifah (vicegerent). The Quran does not specify a time or location for Adam\'s earthly life beyond this framework. Details found in classical tafsir about Jeddah, the number of children, and other specifics are drawn from Isra\'iliyyat (narrations from Jewish and Christian traditions) and are not considered Quranic or mutawatir.',
    people: ['hawwa'],
    relatedEvents: [], relatedPlaces: [],
    topics: ['creation', 'prophethood', 'repentance'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Baqarah 2:30–38', note: 'Creation of Adam, the angels, Iblis, and the garden' },
      { type: 'quran', ref: 'Surah Al-A\'raf 7:11–27', note: 'Further account of Adam and Iblis' },
      { type: 'quran', ref: 'Surah Ta-Ha 20:115–123', note: 'Adam\'s error and repentance' },
      { type: 'academic', ref: 'Fazlur Rahman, Major Themes of the Quran (1980)', note: 'Analysis of Quranic anthropology' }
    ],
    certainty: 'established',
    tags: ['prophet', 'first-human', 'creation', 'repentance'],
    dayOfYear: null
  },
  {
    id: 'ibrahim-pbuh',
    type: 'person', collection: 'prophets', era: 'prophets',
    title: 'Ibrahim (عليه السلام)',
    subtitle: 'Khalilullah — the Friend of Allah, father of monotheism',
    date: { hijri: 'c. 4,000 years before hijrah (traditional)', gregorian: 'c. 2000–1800 BCE (approximate)' },
    startDate: -2000, endDate: null,
    location: 'Mesopotamia (Ur/Babylonia); Canaan; Makkah (Hejaz)',
    summary: 'Ibrahim (AS) is one of the most mentioned Prophets in the Quran, referred to as Khalilullah (the intimate friend of Allah) and as the father of the Abrahamic tradition. His story — challenging idol worship, the fire, his migration, his willingness to sacrifice his son, and his building of the Kaaba with Ismail — is described in multiple Surahs.',
    details: 'The Quran presents Ibrahim\'s rejection of idol worship, his destruction of the idols of his people, and his being thrown into the fire — from which Allah saved him. His migration (hijrah) and his raising of the foundations of the Kaaba alongside his son Ismail are described in Surah Al-Baqarah. His dream of sacrificing his son — and the ransom of that son with a great sacrifice — is described in Surah Al-Saffat. The Quran calls Ibrahim neither Jewish nor Christian, but a hanif — a pure monotheist. Modern academic historians debate the historicity of a specific Abraham figure, but the Quranic account is understood by Muslims as revealed truth independent of this scholarly discussion. The identification of his son in the sacrifice (Ismail or Ishaq) is a matter of classical scholarly discussion; most classical Muslim scholars held it was Ismail.',
    people: ['ismail-pbuh', 'ishaq-pbuh', 'sarah', 'hajar'],
    relatedEvents: ['building-of-kaaba'],
    relatedPlaces: ['makkah', 'kaaba'],
    topics: ['prophethood', 'monotheism', 'kaaba', 'sacrifice'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Baqarah 2:124–132', note: 'Ibrahim as imam, building of Kaaba with Ismail' },
      { type: 'quran', ref: 'Surah Al-Anbiya 21:51–70', note: 'Ibrahim\'s challenge to idols and the fire' },
      { type: 'quran', ref: 'Surah Al-Saffat 37:83–113', note: 'The sacrifice' },
      { type: 'quran', ref: 'Surah An-Nahl 16:120', note: 'Ibrahim described as a nation in himself — hanif' },
      { type: 'academic', ref: 'John Kaltner, Ishmael Instructs Isaac (1999)', note: 'Academic comparative study of Ibrahim narratives' }
    ],
    certainty: 'established',
    tags: ['prophet', 'ibrahim', 'kaaba', 'monotheism', 'hanif'],
    dayOfYear: null
  },
  {
    id: 'musa-pbuh',
    type: 'person', collection: 'prophets', era: 'prophets',
    title: 'Musa (عليه السلام)',
    subtitle: 'Kalimullah — the one to whom Allah spoke directly',
    date: { hijri: 'Before Islamic calendar', gregorian: 'c. 1300–1200 BCE (approximate)' },
    startDate: -1300, endDate: null,
    location: 'Egypt; Sinai Peninsula; Canaan',
    summary: 'Musa (AS) is the most frequently mentioned Prophet in the Quran — his name appears over 130 times. He is described as Kalimullah (the one who spoke directly with Allah). His story — from infancy in Egypt, to his calling at the burning bush, the confrontation with Pharaoh, the liberation of Bani Isra\'il, and the receiving of the Tawrah — spans many Surahs.',
    details: 'The Quran narrates Musa\'s life in extraordinary detail: his birth and being placed in the river to save him from Pharaoh\'s decree, his time with Pharaoh\'s family, his flight after accidentally killing a man, his time in Madyan with Shu\'ayb (AS), his calling at the burning bush, his miracles before Pharaoh (the staff and the shining hand), the crossing of the sea, and the receiving of the Tawrah on the mountain. Multiple Surahs address different aspects of his story. The Quran makes clear that Musa\'s mission was to both free Bani Isra\'il from Pharaoh\'s oppression and to call Pharaoh himself to faith. The historical identification of which Pharaoh is meant is debated among academic historians; the Quran does not name him.',
    people: ['harun-pbuh', 'pharaoh-firaun', 'asiyah'],
    relatedEvents: ['parting-of-the-sea', 'receiving-of-tawrah'],
    relatedPlaces: ['egypt', 'sinai', 'madyan'],
    topics: ['prophethood', 'liberation', 'tawrah', 'miracles'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Qasas 28:1–43', note: 'Most complete Quranic account of Musa\'s early life' },
      { type: 'quran', ref: 'Surah Ta-Ha 20:9–98', note: 'The calling, confrontation with Pharaoh, Sinai' },
      { type: 'quran', ref: 'Surah Al-A\'raf 7:103–171', note: 'Confrontation with Pharaoh and aftermath' },
      { type: 'academic', ref: 'James Kugel, The God of Old (2003)', note: 'Academic analysis of the Mosaic tradition' }
    ],
    certainty: 'established',
    tags: ['prophet', 'musa', 'egypt', 'tawrah', 'liberation', 'pharaoh'],
    dayOfYear: null
  },
  {
    id: 'isa-pbuh',
    type: 'person', collection: 'prophets', era: 'prophets',
    title: 'Isa (عليه السلام)',
    subtitle: 'Ruhullah — the Messiah, son of Maryam',
    date: { hijri: 'Before Islamic calendar', gregorian: 'c. 4 BCE – 30 CE (approximate)' },
    startDate: -4, endDate: null,
    location: 'Palestine (al-Sham region)',
    summary: 'Isa (AS) — known as Jesus in Christian tradition — is described in the Quran as the Messiah (al-Masih), a Prophet, and a Word from Allah, born miraculously to Maryam (Mary) without a father. He performed miracles by Allah\'s permission and was raised to Allah before being killed. Muslims believe he will return before the Day of Judgment.',
    details: 'The Quran\'s account of Isa emphasises his humanity and prophethood while affirming extraordinary events: his miraculous birth, his speaking in the cradle, his miracles (healing, raising the dead by Allah\'s permission), his message of tawhid, and his being raised to Allah. The Quran explicitly rejects the Christian doctrine of the Trinity and of Isa being divine, while affirming the deepest respect for him as a great Prophet. The Quran states he was not crucified — "it was made to appear so to them" — but that Allah raised him up. The exact meaning of this verse (4:157-158) has been discussed by classical scholars with differing interpretations of the detail of what happened to the person on the cross.',
    people: ['maryam', 'zakariyya-pbuh', 'yahya-pbuh'],
    relatedEvents: [],
    relatedPlaces: ['jerusalem', 'bethlehem', 'nazareth'],
    topics: ['prophethood', 'injeel', 'miracles', 'return'],
    sources: [
      { type: 'quran', ref: 'Surah Maryam 19:16–36', note: 'Birth of Isa and his speaking in the cradle' },
      { type: 'quran', ref: 'Surah Al-Imran 3:45–59', note: 'The Messiah — his nature and mission' },
      { type: 'quran', ref: 'Surah An-Nisa 4:157–158', note: 'The Quran\'s account of the crucifixion and raising of Isa' },
      { type: 'quran', ref: 'Surah Al-Ma\'idah 5:110–117', note: 'Isa\'s miracles and his clarification of his message' }
    ],
    certainty: 'established',
    tags: ['prophet', 'isa', 'maryam', 'messiah', 'injeel', 'palestine'],
    dayOfYear: null
  },
  {
    id: 'muhammad-pbuh',
    type: 'person', collection: 'prophets', era: 'seerah',
    title: 'Muhammad ﷺ',
    subtitle: 'The Seal of the Prophets — the final messenger to all of humanity',
    date: { hijri: '53 BH – 11 AH', gregorian: 'c. 570 – 632 CE' },
    startDate: 570, endDate: 632,
    location: 'Makkah (born); Madinah (passed away)',
    summary: 'Muhammad ibn Abdullah ﷺ is the final Prophet and Messenger sent by Allah to all of humanity. Born in Makkah around 570 CE, he received the first Quranic revelation at age 40 in the Cave of Hira. Over 23 years, he conveyed the complete message of Islam, established the first Muslim community, and left behind the Quran and his Sunnah as guidance for all time.',
    details: 'The Quran itself addresses Muhammad ﷺ directly in many places — confirming his prophethood, consoling him in hardship, correcting him at times, and establishing the nature of his mission. The Seerah (prophetic biography) is the most thoroughly documented life in pre-modern history. His character is described in the Quran as "of exalted moral character" (68:4), and Aisha (RA) described his character as "the Quran." See the Seerah collection for detailed accounts of the events of his life.',
    people: ['abu-bakr-al-siddiq', 'khadijah-bint-khuwaylid', 'aisha-bint-abi-bakr', 'ali-ibn-abi-talib', 'fatimah-al-zahra'],
    relatedEvents: ['first-revelation', 'hijrah', 'battle-of-badr', 'conquest-of-makkah', 'farewell-pilgrimage', 'death-of-prophet'],
    relatedPlaces: ['makkah', 'madinah', 'cave-of-hira'],
    topics: ['prophethood', 'seerah', 'quran', 'sunnah'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Ahzab 33:40', note: '"Muhammad is not the father of any of your men, but he is the Messenger of Allah and the Seal of the Prophets"' },
      { type: 'quran', ref: 'Surah Al-Qalam 68:4', note: '"And indeed, you are of exalted moral character"' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Bad\' al-Wahy, Hadith 1', note: 'First revelation — narration of Aisha (RA), graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Primary classical biography' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 1–2', note: 'Comprehensive biographical detail' },
      { type: 'academic', ref: 'Martin Lings, Muhammad: His Life Based on the Earliest Sources (1983)', note: 'Widely respected narrative biography' },
      { type: 'academic', ref: 'W. Montgomery Watt, Muhammad at Mecca (1953) and Muhammad at Medina (1956)', note: 'Standard academic biography' }
    ],
    certainty: 'established',
    tags: ['prophet', 'seal', 'quran', 'sunnah', 'seerah', 'makkah', 'madinah'],
    dayOfYear: null
  }
];

/* ══════════════════════════════════════════════════════════
   COLLECTION 2 — SEERAH
   Complete sequence of the life of the Prophet ﷺ
   18 events, fully sourced.
   ══════════════════════════════════════════════════════════ */
H.events = [
  {
    id: 'birth-of-prophet',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'Birth of the Prophet Muhammad ﷺ',
    subtitle: 'The beginning of the most consequential life in history',
    date: { hijri: '53 BH (Before Hijrah)', gregorian: 'c. 570 CE' },
    startDate: 570, endDate: null,
    location: 'Makkah, Arabian Peninsula',
    summary: 'Muhammad ibn Abdullah ﷺ was born in Makkah into the Banu Hashim clan of Quraysh. His father Abdullah had died before his birth. His mother Aminah bint Wahb passed away when he was six. He was raised first by his grandfather Abd al-Muttalib, then by his uncle Abu Talib.',
    details: 'The traditional date of 12 Rabi\' al-Awwal is followed by many Muslims, though classical scholars recorded other dates within the same month. The year is associated with the Year of the Elephant (\'Am al-Fil — the year Abraha\'s army was turned back from Makkah), generally placed around 570 CE, though some modern historians suggest slightly earlier dates. His early life was marked by personal loss — orphaned young, raised in simplicity — qualities that would be reflected throughout his character. He was sent to live among the Banu Sa\'d tribe in the desert (a common practice for Meccan children) and was nursed by Halima al-Sa\'diyya.',
    people: ['muhammad-pbuh', 'aminah-bint-wahb', 'abd-al-muttalib', 'abu-talib', 'halima-al-sadiyya'],
    relatedEvents: ['year-of-elephant', 'first-revelation'],
    relatedPlaces: ['makkah'],
    topics: ['seerah', 'birth'],
    sources: [
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah, Vol. 1', note: 'Primary classical biography; abridgement of Ibn Ishaq (d. 150 AH)' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 1', note: 'Detailed early biographical source' },
      { type: 'academic', ref: 'Martin Lings, Muhammad: His Life Based on the Earliest Sources (1983), Ch. 1–3' },
      { type: 'academic', ref: 'W. Montgomery Watt, Muhammad at Mecca (1953), Ch. 1' }
    ],
    certainty: 'probable',
    tags: ['seerah', 'birth', 'makkah', 'prophet'],
    dayOfYear: 244
  },
  {
    id: 'year-of-elephant',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'The Year of the Elephant',
    subtitle: 'Abraha\'s army repelled from Makkah — the Quran\'s testimony',
    date: { hijri: 'c. 53 BH', gregorian: 'c. 570 CE' },
    startDate: 570, endDate: null,
    location: 'Near Makkah',
    summary: 'In the year associated with the Prophet\'s birth, Abraha al-Ashram — an Aksumite ruler in Yemen — marched an army including elephants toward Makkah with the reported intention of destroying the Kaaba. The Quran states that Allah repelled the army with birds (ababil) dropping stones, destroying it before it reached the sanctuary.',
    details: 'Surah Al-Fil (105) in the Quran directly addresses this event, making it Quranicaly confirmed. The classical narrative identifies Abraha as a Christian viceroy of the Aksumite Empire in Yemen who built a cathedral in Sana\'a and sought to redirect Arab pilgrimage to it. South Arabian inscriptions mentioning Abraha and his military campaigns have been found by modern archaeologists, providing external corroboration for his existence and campaigns — though the specific attack on Makkah is not confirmed in non-Islamic sources. The supernatural element (the birds) is a matter of faith.',
    people: ['abraha'],
    relatedEvents: ['birth-of-prophet'],
    relatedPlaces: ['makkah', 'kaaba'],
    topics: ['seerah', 'miracles', 'kaaba'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Fil 105:1–5', note: 'Direct Quranic account — "Have you not considered how your Lord dealt with the companions of the elephant?"' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Narrative account with details about Abraha' },
      { type: 'academic', ref: 'Christian Robin, "Arabia and Ethiopia" in The Oxford Handbook of Late Antiquity (2012)', note: 'South Arabian inscriptions corroborating Abraha\'s campaigns' }
    ],
    certainty: 'established',
    tags: ['seerah', 'makkah', 'kaaba', 'elephant', 'abraha'],
    dayOfYear: null
  },
  {
    id: 'first-revelation',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'The First Revelation',
    subtitle: 'Iqra — the word that changed the world',
    date: { hijri: '13 BH (27 Ramadan, traditional)', gregorian: 'c. 610 CE' },
    startDate: 610, endDate: null,
    location: 'Cave of Hira, Jabal al-Nour, near Makkah',
    summary: 'At approximately 40 years of age, during spiritual retreat in the Cave of Hira, the Prophet ﷺ received the first Quranic revelation through the Angel Jibreel. The first words: "Read in the name of your Lord who created." He returned to Khadijah deeply shaken; she comforted him and took him to her cousin Waraqah ibn Nawfal.',
    details: 'The account of the first revelation is preserved in multiple sahih narrations, primarily through Aisha (RA) in Sahih al-Bukhari — the very first hadith in the collection. The Prophet ﷺ described being embraced by the angel until he could bear no more, then the words of Surah Al-Alaq being revealed. Waraqah ibn Nawfal, a Christian scholar, recognised the event as the same revelation given to Musa (Moses) and foretold that the Prophet ﷺ would face opposition. The month of Ramadan is identified by the Quran itself as the month the Quran was revealed (2:185), and the 27th night of Ramadan is traditionally associated with Laylat al-Qadr, though the precise night is a matter of scholarly discussion.',
    people: ['muhammad-pbuh', 'khadijah-bint-khuwaylid', 'jibreel', 'waraqah-ibn-nawfal'],
    relatedEvents: ['birth-of-prophet', 'beginning-of-dawah'],
    relatedPlaces: ['cave-of-hira', 'makkah'],
    topics: ['seerah', 'quran', 'revelation', 'ramadan'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Alaq 96:1–5', note: 'The first verses revealed' },
      { type: 'quran', ref: 'Surah Al-Baqarah 2:185', note: '"Ramadan is the month in which the Quran was revealed"' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Hadith 3, Kitab Bad\' al-Wahy', note: 'Narrated by Aisha (RA) — first hadith in Bukhari, graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Extended narrative account' }
    ],
    certainty: 'established',
    tags: ['seerah', 'revelation', 'quran', 'hira', 'ramadan', 'jibreel'],
    dayOfYear: null
  },
  {
    id: 'early-dawah-makkah',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'Early Dawah in Makkah',
    subtitle: 'Three years of private preaching — the first Muslims',
    date: { hijri: 'c. 13–10 BH', gregorian: 'c. 610–613 CE' },
    startDate: 610, endDate: 613,
    location: 'Makkah',
    summary: 'For approximately three years after the first revelation, the Prophet ﷺ called people to Islam privately. The first to accept were Khadijah (RA) his wife, Ali ibn Abi Talib (RA) his cousin, Zayd ibn Haritha (RA), and Abu Bakr al-Siddiq (RA), who then brought others including Uthman, Zubayr, Abd al-Rahman ibn Awf, and Sa\'d ibn Abi Waqqas.',
    details: 'The private phase of dawah produced a small but dedicated group of early Muslims. The Quran was being revealed continuously during this period. The early Muslims included people from different social strata — from the wealthy Khadijah to the enslaved Bilal — demonstrating the universal message of Islam. After three years, the revelation of Surah Al-Hijr 15:94 ("Proclaim what you have been commanded and turn away from those who associate partners with Allah") marked the beginning of public preaching.',
    people: ['muhammad-pbuh', 'khadijah-bint-khuwaylid', 'ali-ibn-abi-talib', 'abu-bakr-al-siddiq', 'zayd-ibn-haritha', 'bilal-ibn-rabah'],
    relatedEvents: ['first-revelation', 'public-dawah-makkah', 'persecution-of-muslims'],
    relatedPlaces: ['makkah'],
    topics: ['seerah', 'dawah', 'early-muslims'],
    sources: [
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Account of early converts' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir', note: 'Biographical details of early Muslims' },
      { type: 'academic', ref: 'W. Montgomery Watt, Muhammad at Mecca (1953), Ch. 4–5' }
    ],
    certainty: 'probable',
    tags: ['seerah', 'makkah', 'dawah', 'early-islam', 'khadijah', 'abu-bakr'],
    dayOfYear: null
  },
  {
    id: 'migration-to-abyssinia',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'The Migration to Abyssinia',
    subtitle: 'The first hijrah — seeking refuge with a just king',
    date: { hijri: 'c. 7 BH', gregorian: 'c. 615 CE' },
    startDate: 615, endDate: null,
    location: 'Makkah to Aksum (Abyssinia/Ethiopia)',
    summary: 'As persecution intensified in Makkah, the Prophet ﷺ instructed a group of his companions to seek refuge with the Negus (Najashi) — the Christian king of Abyssinia — describing him as a just king who would not wrong anyone. Two groups migrated there, totalling around 100 companions.',
    details: 'The migration to Abyssinia is sometimes called the first hijrah. The Quraysh sent emissaries to persuade the Negus to return the Muslims, but the Negus listened to both sides — and when Ja\'far ibn Abi Talib recited the Quranic verses about Isa (AS) and Maryam, the Negus is reported to have said the difference between the Quran\'s account and what he believed was no more than a line drawn in the sand. He refused to extradite the Muslims and returned the Quraysh gifts. Some classical sources indicate the Negus himself accepted Islam before his death; the Prophet ﷺ reportedly prayed the funeral prayer (salat al-ghayb) for him in absentia.',
    people: ['muhammad-pbuh', 'jafar-ibn-abi-talib', 'umm-salamah', 'negus-najashi'],
    relatedEvents: ['persecution-of-muslims', 'hijrah'],
    relatedPlaces: ['makkah', 'abyssinia'],
    topics: ['seerah', 'hijrah', 'persecution', 'justice'],
    sources: [
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Detailed account of the migration and the Negus dialogue' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Jana\'iz, Hadith 1320', note: 'Funeral prayer for the Negus, graded sahih' },
      { type: 'academic', ref: 'W. Montgomery Watt, Muhammad at Mecca (1953), Ch. 6' }
    ],
    certainty: 'probable',
    tags: ['seerah', 'abyssinia', 'hijrah', 'persecution', 'negus', 'jafar'],
    dayOfYear: null
  },
  {
    id: 'year-of-sorrow',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'The Year of Sorrow',
    subtitle: 'The deaths of Khadijah and Abu Talib — the Prophet\'s two protectors',
    date: { hijri: 'c. 4 BH', gregorian: 'c. 619 CE' },
    startDate: 619, endDate: null,
    location: 'Makkah',
    summary: 'In a single year, the Prophet ﷺ lost his beloved wife Khadijah bint Khuwaylid — his first wife and the mother of his children — and his uncle and protector Abu Talib. Their deaths left him more vulnerable in Makkah than at any previous point. This year is called \'Am al-Huzn — the Year of Sorrow.',
    details: 'Khadijah (RA) had been the first to accept Islam and had been the Prophet\'s greatest support throughout the 15 difficult years of prophethood in Makkah. Her death was a profound personal loss. The Prophet ﷺ spoke of her with deep love and gratitude throughout his life. Abu Talib had protected the Prophet ﷺ through his tribal authority, despite not accepting Islam himself. Without his protection, the Prophet ﷺ became more exposed to Quraysh hostility. He then attempted to seek protection in Ta\'if, but was rejected and driven away. The Year of Sorrow was followed by the gift of the Isra and Mi\'raj.',
    people: ['muhammad-pbuh', 'khadijah-bint-khuwaylid', 'abu-talib'],
    relatedEvents: ['early-dawah-makkah', 'isra-and-miraj', 'hijrah'],
    relatedPlaces: ['makkah', 'taif'],
    topics: ['seerah', 'grief', 'khadijah', 'family'],
    sources: [
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Account of the deaths of Khadijah and Abu Talib' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Manaqib al-Ansar, Hadith 3818', note: 'Prophet\'s descriptions of Khadijah, graded sahih' },
      { type: 'academic', ref: 'Lesley Hazleton, The First Muslim (2013)', note: 'Narrative account of the Meccan period' }
    ],
    certainty: 'established',
    tags: ['seerah', 'khadijah', 'abu-talib', 'grief', 'makkah'],
    dayOfYear: null
  },
  {
    id: 'isra-and-miraj',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'Al-Isra\' wal-Mi\'raj',
    subtitle: 'The Night Journey and Ascension — from Makkah to Jerusalem to the heavens',
    date: { hijri: 'c. 3 BH (traditional: 27 Rajab)', gregorian: 'c. 620 CE' },
    startDate: 620, endDate: null,
    location: 'Makkah → Jerusalem (al-Aqsa) → the heavens',
    summary: 'In one night, the Prophet ﷺ was taken by the Angel Jibreel from Makkah to Masjid al-Aqsa in Jerusalem (the Isra\'), then ascended through the heavens (the Mi\'raj), meeting previous Prophets and reaching the highest station. The five daily prayers were prescribed during this night. The Quran refers to this journey in Surah Al-Isra\'.',
    details: 'The Isra\' (night journey) is referred to directly in the Quran (17:1). The Mi\'raj (ascension) is described through hadith and is referenced in Surah An-Najm (53:1–18). Whether the journey was physical or spiritual is a matter of classical scholarly discussion — the Quran\'s use of "by His servant" (bi-abdihi) is taken by most classical scholars to indicate a physical journey, though some understood it as a spiritual vision. During the Mi\'raj, the Prophet ﷺ met Prophets including Adam, Ibrahim, Musa, and Isa. The prescription of the five prayers was reduced from fifty to five through conversations with Musa (AS), according to the hadith of al-Bukhari and Muslim. The journey was met with disbelief by many Quraysh when announced the next morning.',
    people: ['muhammad-pbuh', 'jibreel', 'musa-pbuh', 'ibrahim-pbuh', 'isa-pbuh'],
    relatedEvents: ['year-of-sorrow', 'hijrah', 'first-revelation'],
    relatedPlaces: ['makkah', 'jerusalem', 'masjid-al-aqsa'],
    topics: ['seerah', 'miracles', 'prayer', 'ascension', 'jerusalem'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Isra\' 17:1', note: '"Exalted is He who took His servant by night from al-Masjid al-Haram to al-Masjid al-Aqsa..."' },
      { type: 'quran', ref: 'Surah An-Najm 53:1–18', note: 'Description of the ascension' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Bad\' al-Khalq, Hadith 3207; Sahih Muslim, Kitab al-Iman, Hadith 163', note: 'Detailed narration of the Isra and Mi\'raj, graded sahih' }
    ],
    certainty: 'established',
    tags: ['seerah', 'isra', 'miraj', 'jerusalem', 'prayer', 'ascension'],
    dayOfYear: 208
  },
  {
    id: 'hijrah',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'The Hijrah',
    subtitle: 'The migration that marked the beginning of the Islamic calendar',
    date: { hijri: '1 AH', gregorian: '622 CE' },
    startDate: 622, endDate: null,
    location: 'Makkah to Madinah (via Cave of Thawr)',
    summary: 'Facing increasing persecution and a Quraysh plot to kill him, the Prophet ﷺ and Abu Bakr migrated from Makkah to Madinah, hiding in the Cave of Thawr for three days before completing the journey. Their arrival in Madinah marked a new era. Umar ibn al-Khattab later established this migration as Year 1 of the Islamic calendar.',
    details: 'The Quran refers to the Hijrah in Surah Al-Tawbah 9:40 — "the second of two, when they were in the cave" — confirming the companionship of Abu Bakr. The Prophet ﷺ sent Ali ibn Abi Talib to sleep in his bed that night to deceive the Quraysh, then departed with Abu Bakr under cover of darkness. During three days in the Cave of Thawr, Asma\' bint Abi Bakr brought them food. Their guide Abdallah ibn Urayqit led them by a coastal route to avoid Quraysh search parties. The Prophet\'s arrival in Quba and then Madinah was met with great celebration. Upon arrival he established the first mosque (at Quba, then in Madinah) and drafted the Constitution of Madinah — a foundational civic document.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'ali-ibn-abi-talib', 'asma-bint-abi-bakr'],
    relatedEvents: ['first-revelation', 'battle-of-badr', 'constitution-of-madinah'],
    relatedPlaces: ['makkah', 'madinah', 'cave-of-thawr', 'quba'],
    topics: ['seerah', 'hijrah', 'migration', 'calendar'],
    sources: [
      { type: 'quran', ref: 'Surah At-Tawbah 9:40', note: '"the second of two when they were in the cave — he said to his companion: do not grieve, for Allah is with us"' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Manaqib, Hadith 3905', note: 'Detailed narration of the Hijrah, graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Extended narrative account' },
      { type: 'academic', ref: 'W. Montgomery Watt, Muhammad at Medina (1956), Ch. 1' }
    ],
    certainty: 'established',
    tags: ['seerah', 'hijrah', 'makkah', 'madinah', 'abu-bakr', 'calendar'],
    dayOfYear: 245
  },
  {
    id: 'battle-of-badr',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'The Battle of Badr',
    subtitle: 'Yawm al-Furqan — the Day of Distinction',
    date: { hijri: '17 Ramadan 2 AH', gregorian: '13 March 624 CE' },
    startDate: 624, endDate: null,
    location: 'Badr, 130km southwest of Madinah',
    summary: 'The first major armed engagement between the Muslim community and the Quraysh of Makkah. A Muslim force of approximately 313 — many poorly armed — faced a Quraysh army of around 1,000. The Muslims won a decisive victory. The Quran calls this day "Yawm al-Furqan" — the Day of Distinction.',
    details: 'The engagement arose from a Muslim raid on a Quraysh caravan, which prompted a large Quraysh army. The Quran addresses Badr in significant detail in Surah Al-Anfal. The victory was decisive: several Quraysh leaders including Abu Jahl were killed. The battle marked the turning point at which the Muslim community proved it could defend itself militarily. The Quran explicitly mentions divine assistance at Badr. The battle also raised questions of how to deal with captives — settled by Quran 8:67–68, which addressed ransom. Seventy Quraysh were killed and seventy taken captive.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'umar-ibn-al-khattab', 'ali-ibn-abi-talib', 'abu-jahl', 'hamzah-ibn-abd-al-muttalib'],
    relatedEvents: ['hijrah', 'battle-of-uhud', 'conquest-of-makkah'],
    relatedPlaces: ['badr', 'madinah', 'makkah'],
    topics: ['seerah', 'battle', 'victory', 'military'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Anfal 8:5–19, 41–44', note: 'Extensive Quranic account of Badr and its lessons' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Maghazi, Hadith 3986ff', note: 'Multiple narrations, graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Detailed narrative' }
    ],
    certainty: 'established',
    tags: ['seerah', 'battle', 'badr', 'ramadan', 'victory'],
    dayOfYear: 72
  },
  {
    id: 'battle-of-uhud',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'The Battle of Uhud',
    subtitle: 'A trial and a lesson — the archer\'s mistake and its consequences',
    date: { hijri: '7 Shawwal 3 AH', gregorian: 'March 625 CE' },
    startDate: 625, endDate: null,
    location: 'Mount Uhud, near Madinah',
    summary: 'The Quraysh, seeking revenge for Badr, attacked Madinah with 3,000 fighters. The Muslims initially had the upper hand but a group of archers abandoned their post against the Prophet\'s explicit instruction, allowing the Quraysh cavalry to attack from the rear. The Muslims suffered heavy losses including the martyrdom of Hamzah ibn Abd al-Muttalib. The Prophet ﷺ himself was wounded.',
    details: 'Uhud is addressed extensively in the Quran — Surah Al-Imran devotes over 60 verses to its events and lessons. The archers\' disobedience is a key lesson: they left their mountain post when they saw the Quraysh retreating, thinking victory was complete, allowing Khalid ibn al-Walid (then fighting for Quraysh) to lead a cavalry charge from behind. Hamzah (RA), the Prophet\'s beloved uncle, was martyred. The Quran uses Uhud to teach Muslims about the consequences of disobedience, the nature of trials, and the importance of maintaining character in difficulty. The Quran also clarifies that Muhammad ﷺ is a messenger, not immortal (3:144) — a verse Abu Bakr cited at the Prophet\'s death.',
    people: ['muhammad-pbuh', 'hamzah-ibn-abd-al-muttalib', 'khalid-ibn-al-walid', 'abu-sufyan', 'hind-bint-utbah'],
    relatedEvents: ['battle-of-badr', 'battle-of-khandaq'],
    relatedPlaces: ['uhud', 'madinah'],
    topics: ['seerah', 'battle', 'trial', 'obedience', 'martyrdom'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Imran 3:121–180', note: 'Extensive Quranic account and lessons of Uhud' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Maghazi, Hadith 4043ff', note: 'Detailed narrations, graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Narrative account' }
    ],
    certainty: 'established',
    tags: ['seerah', 'battle', 'uhud', 'hamzah', 'trial', 'disobedience'],
    dayOfYear: 83
  },
  {
    id: 'battle-of-khandaq',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'The Battle of the Trench (Al-Khandaq)',
    subtitle: 'The siege of Madinah — Salman al-Farisi\'s strategy',
    date: { hijri: 'Shawwal 5 AH', gregorian: 'March 627 CE' },
    startDate: 627, endDate: null,
    location: 'Madinah',
    summary: 'A coalition of 10,000 fighters — Quraysh, Ghatafan, and others — laid siege to Madinah. On the advice of Salman al-Farisi (RA), the Muslims dug a trench (khandaq) along the exposed northern approach. The siege lasted about a month before the coalition abandoned it, weakened by cold, internal disagreement, and a sandstorm described in the Quran.',
    details: 'The Battle of the Trench is described in the Quran in Surah Al-Ahzab. The strategy of the trench was unprecedented in Arabia — a Persian military practice suggested by Salman, demonstrating Islam\'s openness to wisdom from any source. During the siege, an agreement with the Banu Qurayza (a Jewish tribe within Madinah who had a treaty with the Muslims) broke down — they sided with the besieging coalition. After the siege, the Prophet ﷺ turned to address the Banu Qurayza\'s treachery. This period is one of the more historically and legally complex moments in the Seerah, with some details discussed by both classical and modern scholars.',
    people: ['muhammad-pbuh', 'salman-al-farisi', 'abu-sufyan', 'umar-ibn-al-khattab', 'ali-ibn-abi-talib'],
    relatedEvents: ['battle-of-uhud', 'treaty-of-hudaybiyyah'],
    relatedPlaces: ['madinah'],
    topics: ['seerah', 'battle', 'siege', 'strategy'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Ahzab 33:9–27', note: 'Quranic account of the trench and the divine wind' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Maghazi, Hadith 4104ff', note: 'Graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Narrative detail' },
      { type: 'academic', ref: 'W. Montgomery Watt, Muhammad at Medina (1956), Ch. 2' }
    ],
    certainty: 'established',
    tags: ['seerah', 'battle', 'khandaq', 'trench', 'madinah', 'salman'],
    dayOfYear: 86
  },
  {
    id: 'treaty-of-hudaybiyyah',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'The Treaty of Hudaybiyyah',
    subtitle: 'A "manifest victory" in apparent defeat',
    date: { hijri: 'Dhu al-Qi\'dah 6 AH', gregorian: 'March 628 CE' },
    startDate: 628, endDate: null,
    location: 'Al-Hudaybiyyah, near Makkah',
    summary: 'The Prophet ﷺ set out for Makkah to perform Umrah with 1,400 companions. The Quraysh blocked their entry. After negotiation, a 10-year treaty was agreed: the Muslims would return that year and come back the following year; any Muslim who fled to Madinah would be returned, but not vice versa. Many companions were distressed by the terms — but the Quran called it "a manifest victory."',
    details: 'The Treaty of Hudaybiyyah appeared disadvantageous to Muslims on its face — particularly the clause returning Muslim defectors to Quraysh (but not Quraysh defectors to Muslims). However, the treaty allowed two years of peace during which Islam spread rapidly across Arabia and beyond. The Quran\'s characterisation of it as "a manifest victory" (fath mubin — Surah 48:1) proved prophetic: within two years the treaty was broken by Quraysh, giving the Prophet ﷺ cause to march on Makkah. The treaty also established the Muslims\' equal standing as a sovereign political entity. The bay\'at al-ridwan — the pledge under the tree — was taken by the companions and is praised in the Quran (48:18).',
    people: ['muhammad-pbuh', 'umar-ibn-al-khattab', 'uthman-ibn-affan', 'suhay-ibn-amr'],
    relatedEvents: ['battle-of-khandaq', 'conquest-of-makkah'],
    relatedPlaces: ['hudaybiyyah', 'makkah', 'madinah'],
    topics: ['seerah', 'treaty', 'diplomacy', 'victory'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Fath 48:1–3, 18', note: '"Indeed We have granted you a manifest victory" — revealed after Hudaybiyyah' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Shurut, Hadith 2731ff', note: 'Detailed account of the treaty terms, graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Narrative account' }
    ],
    certainty: 'established',
    tags: ['seerah', 'treaty', 'hudaybiyyah', 'victory', 'diplomacy'],
    dayOfYear: null
  },
  {
    id: 'conquest-of-makkah',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'The Conquest of Makkah',
    subtitle: 'Forgiveness at the peak of power',
    date: { hijri: 'Ramadan 8 AH', gregorian: 'January 630 CE' },
    startDate: 630, endDate: null,
    location: 'Makkah',
    summary: 'After the Quraysh violated the Treaty of Hudaybiyyah, the Prophet ﷺ marched on Makkah with 10,000 companions. The city fell with minimal resistance. He entered the Kaaba, removed the idols, and declared a general amnesty — forgiving those who had persecuted him and his followers for decades. Bilal ibn Rabah gave the adhan from the top of the Kaaba.',
    details: 'The entry into Makkah is one of the most celebrated moments in Islamic history. The Prophet ﷺ entered on his camel, head bowed in humility, reciting Surah Al-Nasr. He declared: "Today is a day of mercy." His amnesty covered even Abu Sufyan and Hind bint Utbah — who had ordered the mutilation of Hamzah at Uhud. Bilal\'s adhan from the Kaaba was a powerful symbol: the formerly enslaved Abyssinian man now calling to prayer from the holiest sanctuary. The Prophet ﷺ destroyed 360 idols around the Kaaba, reciting the verse: "The truth has come and falsehood has perished" (17:81). Most of the Quraysh accepted Islam.',
    people: ['muhammad-pbuh', 'abu-sufyan', 'bilal-ibn-rabah', 'khalid-ibn-al-walid', 'abu-bakr-al-siddiq', 'hind-bint-utbah'],
    relatedEvents: ['treaty-of-hudaybiyyah', 'farewell-pilgrimage', 'hijrah'],
    relatedPlaces: ['makkah', 'kaaba'],
    topics: ['seerah', 'conquest', 'forgiveness', 'mercy', 'kaaba'],
    sources: [
      { type: 'quran', ref: 'Surah An-Nasr 110:1–3', note: 'Revealed in connection with the conquest of Makkah' },
      { type: 'quran', ref: 'Surah Al-Isra\' 17:81', note: '"The truth has come and falsehood has perished"' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Maghazi, Hadith 4280ff', note: 'Graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Detailed narrative including amnesty proclamation' }
    ],
    certainty: 'established',
    tags: ['seerah', 'makkah', 'conquest', 'forgiveness', 'bilal', 'kaaba', 'ramadan'],
    dayOfYear: 62
  },
  {
    id: 'farewell-pilgrimage',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'The Farewell Pilgrimage',
    subtitle: 'The completion of the religion — the last Hajj of the Prophet ﷺ',
    date: { hijri: 'Dhu al-Hijjah 10 AH', gregorian: 'March 632 CE' },
    startDate: 632, endDate: null,
    location: 'Makkah — Arafat — Mina — Madinah',
    summary: 'In the tenth year after Hijrah, the Prophet ﷺ performed his first and only complete Hajj with approximately 100,000 companions. On the plain of Arafat, he delivered the Farewell Sermon — addressing equality, the sanctity of life, women\'s rights, the prohibition of usury, and the permanence of the Quran and Sunnah as guidance. The verse completing the religion was revealed here.',
    details: 'The Farewell Sermon (Khutbat al-Wada\') is preserved in multiple hadith with consistent core content across narrations. The Prophet ﷺ declared the equality of all people ("No Arab has superiority over a non-Arab except by taqwa"), the inviolability of blood, wealth, and honour, the rights of women, the abolition of pre-Islamic blood feuds and usury, and the two trusts left behind: the Quran and the Sunnah. The verse "Today I have perfected your religion for you" (Surah 5:3) was revealed at Arafat according to multiple sahih hadith. The Prophet ﷺ asked the gathered companions three times to testify that he had conveyed the message, and they affirmed it.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'ali-ibn-abi-talib', 'bilal-ibn-rabah'],
    relatedEvents: ['conquest-of-makkah', 'death-of-prophet'],
    relatedPlaces: ['makkah', 'arafat', 'mina', 'madinah'],
    topics: ['seerah', 'hajj', 'sermon', 'equality', 'completion'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Ma\'idah 5:3', note: '"Today I have perfected your religion for you and completed My favour upon you" — revealed at Arafat' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Hajj, Hadith 1623; Sahih Muslim, Kitab al-Hajj, Hadith 1218', note: 'Farewell Pilgrimage narrations, graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Full account of the Farewell Pilgrimage and sermon' }
    ],
    certainty: 'established',
    tags: ['seerah', 'hajj', 'farewell', 'sermon', 'equality', 'completion'],
    dayOfYear: null
  },
  {
    id: 'death-of-prophet',
    type: 'event', collection: 'seerah', era: 'seerah',
    title: 'The Passing of the Prophet Muhammad ﷺ',
    subtitle: 'The end of prophethood — the beginning of the Ummah\'s responsibility',
    date: { hijri: '12 Rabi\' al-Awwal 11 AH', gregorian: '8 June 632 CE' },
    startDate: 632, endDate: null,
    location: 'Madinah — the house of Aisha (RA)',
    summary: 'After a brief illness, the Prophet Muhammad ﷺ passed away in Madinah at approximately 63 years of age, in the arms of his wife Aisha (RA). He was buried in the room in which he died. Abu Bakr announced his passing with the verse: "Muhammad is not but a messenger; messengers have passed on before him."',
    details: 'The Prophet\'s final illness lasted around two weeks. His last days were spent in the house of Aisha (RA). Multiple narrations describe his concern for the Ummah in his final moments — warning against making his grave a place of worship, and praying for mercy. His last words are recorded in several narrations. Abu Bakr\'s response — calmly announcing the death and reciting Surah Al-Imran 3:144 — is itself one of the most significant moments in Islamic history: it steadied the community when Umar (RA) at first could not accept the news. The Prophet ﷺ was buried in the house of Aisha (RA), which was later incorporated into the Masjid al-Nabawi.',
    people: ['muhammad-pbuh', 'aisha-bint-abi-bakr', 'abu-bakr-al-siddiq', 'umar-ibn-al-khattab', 'ali-ibn-abi-talib', 'fatimah-al-zahra'],
    relatedEvents: ['farewell-pilgrimage', 'caliphate-abu-bakr'],
    relatedPlaces: ['madinah', 'masjid-al-nabawi'],
    topics: ['seerah', 'passing', 'prophethood', 'legacy'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Imran 3:144', note: '"Muhammad is not but a messenger; messengers have passed on before him" — recited by Abu Bakr at the announcement' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Maghazi, Hadith 4462; Kitab Jana\'iz, Hadith 1241', note: 'Multiple graded sahih narrations of the Prophet\'s final days' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Detailed account of final illness and passing' }
    ],
    certainty: 'established',
    tags: ['seerah', 'prophet', 'passing', 'madinah', 'aisha', 'abu-bakr'],
    dayOfYear: 159
  }
];

/* ══════════════════════════════════════════════════════════
   COLLECTION 3 — COMPANIONS (Al-Sahabah)
   10 major Companions with biographical entries.
   Every claim sourced. No hagiographic exaggeration.
   ══════════════════════════════════════════════════════════ */
H.companions = [
  {
    id: 'abu-bakr-al-siddiq',
    type: 'person', collection: 'companions', era: 'rashidun',
    title: 'Abu Bakr al-Siddiq (رضي الله عنه)',
    subtitle: 'Al-Siddiq — the Truthful. First Caliph. Closest companion of the Prophet ﷺ',
    date: { hijri: 'c. 573 BCE – 13 AH', gregorian: 'c. 573 – 634 CE' },
    startDate: 573, endDate: 634,
    location: 'Makkah; Madinah',
    summary: 'Abu Bakr Abdullah ibn Abi Quhafa was the closest companion of the Prophet ﷺ, the first adult male to accept Islam, and the first Caliph after the Prophet\'s passing. He was known for extraordinary faith, gentleness, and decisive leadership — particularly in the crisis that followed the Prophet\'s death.',
    details: 'Abu Bakr was among the wealthiest merchants in Makkah, spending his wealth to free enslaved Muslims including Bilal ibn Rabah. He accompanied the Prophet ﷺ on the Hijrah, sharing the Cave of Thawr — the Quran refers to this directly (9:40). The Prophet said: "If I were to take a khalil (close friend) from this Ummah, I would take Abu Bakr" (Bukhari). His caliphate (632–634 CE) saw: the Wars of Riddah (consolidating the Arabian Peninsula), the beginning of the Quran\'s compilation, and early campaigns into Persia and Syria. He served just over two years before dying of illness.',
    people: ['muhammad-pbuh', 'umar-ibn-al-khattab', 'aisha-bint-abi-bakr', 'bilal-ibn-rabah'],
    relatedEvents: ['hijrah', 'death-of-prophet', 'caliphate-abu-bakr'],
    relatedPlaces: ['makkah', 'madinah'],
    topics: ['companion', 'caliph', 'rashidun', 'faith'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Fada\'il al-Sahabah, Hadith 3661', note: 'Prophet\'s statement about Abu Bakr, graded sahih' },
      { type: 'quran', ref: 'Surah At-Tawbah 9:40', note: '"the second of two when they were in the cave"' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 3', note: 'Primary biographical source' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986), Ch. 2' }
    ],
    certainty: 'established',
    tags: ['companion', 'caliph', 'siddiq', 'hijrah', 'makkah', 'madinah'],
    dayOfYear: null
  },
  {
    id: 'umar-ibn-al-khattab',
    type: 'person', collection: 'companions', era: 'rashidun',
    title: 'Umar ibn al-Khattab (رضي الله عنه)',
    subtitle: 'Al-Faruq — the Distinguisher. Second Caliph. Greatest administrator in early Islamic history',
    date: { hijri: 'c. 584 – 23 AH', gregorian: 'c. 584 – 644 CE' },
    startDate: 584, endDate: 644,
    location: 'Makkah; Madinah',
    summary: 'Umar ibn al-Khattab was initially one of Islam\'s fiercest opponents before his profound conversion transformed him into one of its greatest champions. As Second Caliph (634–644 CE), he oversaw the largest territorial expansion in early Islamic history — Persia, Syria, Egypt, Jerusalem — while being renowned for personal austerity and strict justice.',
    details: 'Umar\'s conversion — described in classical sources as occurring after he heard his sister recite Quranic verses — gave the early Muslim community its first public march to the Kaaba. The Prophet ﷺ said: "Islam was strengthened by the Islam of Umar" (Ibn Majah). As caliph: he established the diwan (state register), created the position of appointed governors, set up the Hijri calendar, walked the streets of Madinah at night checking on his people, and personally entered Jerusalem after its surrender — famously refusing to pray inside the Church of the Holy Sepulchre to prevent a precedent for its conversion. He was assassinated while leading Fajr prayer by Abu Lu\'lu\'a al-Fayruz.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'ali-ibn-abi-talib', 'khalid-ibn-al-walid'],
    relatedEvents: ['caliphate-umar', 'battle-of-yarmouk', 'battle-of-qadisiyyah'],
    relatedPlaces: ['makkah', 'madinah', 'jerusalem'],
    topics: ['companion', 'caliph', 'rashidun', 'justice', 'expansion'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Fada\'il al-Sahabah, Hadith 3684', note: 'Prophet\'s praise of Umar, graded sahih' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 3', note: 'Primary biographical source' },
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk', note: 'Historical accounts of his caliphate' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)' }
    ],
    certainty: 'established',
    tags: ['companion', 'caliph', 'faruq', 'expansion', 'justice', 'madinah'],
    dayOfYear: null
  },
  {
    id: 'uthman-ibn-affan',
    type: 'person', collection: 'companions', era: 'rashidun',
    title: 'Uthman ibn Affan (رضي الله عنه)',
    subtitle: 'Dhul-Nurayn — possessor of two lights. Third Caliph. Standardiser of the Quran',
    date: { hijri: 'c. 576 – 35 AH', gregorian: 'c. 576 – 656 CE' },
    startDate: 576, endDate: 656,
    location: 'Makkah; Madinah',
    summary: 'Uthman ibn Affan was among the earliest converts to Islam, married two daughters of the Prophet ﷺ (earning the title "Dhul-Nurayn"), and was known for extraordinary generosity. His greatest legacy as Third Caliph was the standardisation of the Quranic text — producing authoritative copies distributed across the Muslim world.',
    details: 'Uthman financed the expansion of the Masjid al-Nabawi from his own wealth and purchased the well of Ruma to provide free water to the Madinah community. During the Prophet\'s lifetime, he equipped the Army of Hardship (Jaysh al-Usra) at Tabuk largely from his own treasury. As Caliph, the Uthmanic codex — the standardised Quranic manuscript distributed to major cities — is among the most consequential acts of preservation in history. His later caliphate faced growing dissent over appointments of relatives as governors; he was killed by rebels in 656 CE while reciting the Quran, an act attested in multiple classical sources.',
    people: ['muhammad-pbuh', 'zayd-ibn-thabit', 'ali-ibn-abi-talib', 'umar-ibn-al-khattab'],
    relatedEvents: ['caliphate-uthman'],
    relatedPlaces: ['makkah', 'madinah'],
    topics: ['companion', 'caliph', 'rashidun', 'quran', 'generosity'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Fada\'il al-Sahabah, Hadith 3696', note: 'Prophet\'s praise of Uthman, graded sahih' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Fada\'il al-Quran, Hadith 4987', note: 'Account of Quran compilation, graded sahih' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 3' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)' }
    ],
    certainty: 'established',
    tags: ['companion', 'caliph', 'rashidun', 'quran-compilation', 'generosity'],
    dayOfYear: null
  },
  {
    id: 'ali-ibn-abi-talib',
    type: 'person', collection: 'companions', era: 'rashidun',
    title: 'Ali ibn Abi Talib (رضي الله عنه)',
    subtitle: 'The Gate of Knowledge. Fourth Caliph. Cousin and son-in-law of the Prophet ﷺ',
    date: { hijri: 'c. 600 – 40 AH', gregorian: 'c. 600 – 661 CE' },
    startDate: 600, endDate: 661,
    location: 'Makkah; Madinah; Kufa',
    summary: 'Ali ibn Abi Talib was the cousin and son-in-law of the Prophet ﷺ, husband of Fatimah al-Zahra (RA), father of Hasan and Husayn. Among the first to accept Islam. Fourth Caliph of the Rashidun. Deeply revered in both Sunni and Shia Islam — though his significance differs theologically between the two traditions.',
    details: 'Ali accepted Islam as a young boy and never worshipped idols. The Prophet ﷺ praised him extensively in authenticated hadith. He slept in the Prophet\'s bed on the night of the Hijrah. His caliphate (656–661 CE) was marked by the first fitna: the Battle of the Camel (against Aisha, Talha, and Zubayr) and the Battle of Siffin (against Muawiyah ibn Abi Sufyan). Ali is celebrated for his knowledge, eloquence, and piety; the Nahj al-Balagha (compiled in the 4th century AH) collects attributed sermons and letters — their individual authenticity varies. He was assassinated in the mosque of Kufa by Ibn Muljam, ending the Rashidun Caliphate.',
    people: ['muhammad-pbuh', 'fatimah-al-zahra', 'husayn-ibn-ali', 'hasan-ibn-ali', 'abu-bakr-al-siddiq'],
    relatedEvents: ['hijrah', 'battle-of-karbala'],
    relatedPlaces: ['makkah', 'madinah', 'kufa'],
    topics: ['companion', 'caliph', 'rashidun', 'knowledge', 'ahl-al-bayt'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Fada\'il al-Sahabah, Hadith 3706; Sahih Muslim, Kitab Fada\'il al-Sahabah, Hadith 2404', note: 'Multiple graded sahih narrations about Ali' },
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk', note: 'Historical account of his caliphate' },
      { type: 'academic', ref: 'Wilferd Madelung, The Succession to Muhammad (1997)', note: 'Detailed academic analysis of the succession question' }
    ],
    certainty: 'established',
    tags: ['companion', 'caliph', 'rashidun', 'ahl-al-bayt', 'knowledge', 'kufa'],
    dayOfYear: null
  },
  {
    id: 'khadijah-bint-khuwaylid',
    type: 'person', collection: 'companions', era: 'seerah',
    title: 'Khadijah bint Khuwaylid (رضي الله عنها)',
    subtitle: 'The first Muslim. The Prophet\'s greatest support',
    date: { hijri: 'c. 68 BH – 3 BH', gregorian: 'c. 555 – 619 CE' },
    startDate: 555, endDate: 619,
    location: 'Makkah',
    summary: 'Khadijah bint Khuwaylid was the first person to accept Islam and the Prophet\'s first and most beloved wife. A successful businesswoman, she was his employer before becoming his wife. She provided emotional, moral, and financial support through the most difficult years of the Makkan period. Her death, along with Abu Talib\'s, defined the Year of Sorrow.',
    details: 'Khadijah is consistently described in the earliest sources as a woman of nobility, wisdom, and strength. When the first revelation came, it was she who comforted the shaking Prophet ﷺ and took him to Waraqah. She affirmed his prophethood before anyone else. She gave much of her wealth in support of the early Muslim community. The Prophet ﷺ spoke of her with profound love throughout his life — Aisha (RA) noted that she was sometimes jealous of Khadijah, despite her having died before Aisha married the Prophet, because of how much he spoke of her. The Prophet ﷺ said she believed in him when others disbelieved, supported him when others abandoned him, and had his children.',
    people: ['muhammad-pbuh', 'waraqah-ibn-nawfal', 'fatimah-al-zahra'],
    relatedEvents: ['first-revelation', 'year-of-sorrow', 'early-dawah-makkah'],
    relatedPlaces: ['makkah'],
    topics: ['companion', 'family', 'seerah', 'faith', 'support'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Bad\' al-Wahy, Hadith 3; Kitab Manaqib al-Ansar, Hadith 3818', note: 'Multiple graded sahih narrations about Khadijah' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 8 (Women)', note: 'Primary biographical source' },
      { type: 'academic', ref: 'Lesley Hazleton, The First Muslim (2013)', note: 'Narrative account emphasising Khadijah\'s role' }
    ],
    certainty: 'established',
    tags: ['companion', 'seerah', 'khadijah', 'first-muslim', 'wife', 'makkah'],
    dayOfYear: null
  },
  {
    id: 'aisha-bint-abi-bakr',
    type: 'person', collection: 'companions', era: 'seerah',
    title: 'Aisha bint Abi Bakr (رضي الله عنها)',
    subtitle: 'Umm al-Mu\'minin — Mother of the Believers. Scholar. Transmitter of the Sunnah',
    date: { hijri: 'c. 9 BH – 58 AH', gregorian: 'c. 613 – 678 CE' },
    startDate: 613, endDate: 678,
    location: 'Makkah; Madinah',
    summary: 'Aisha bint Abi Bakr is one of the most important figures in Islamic history — the Prophet\'s wife, the daughter of Abu Bakr, and one of the greatest transmitters of hadith. She narrated approximately 2,210 hadith and was a scholar whom Companions would consult on matters of fiqh and Sunnah. The Prophet ﷺ died in her arms.',
    details: 'Aisha is described in the classical sources as having an extraordinary memory and sharp intelligence. After the Prophet\'s passing, she lived for nearly 50 more years as a scholar and teacher in Madinah. Among the most important hadith — including the very first hadith in Bukhari (the account of the first revelation) — are narrated by her. She corrected other companions\' narrations on multiple occasions. Her role in the Battle of the Camel (36 AH / 656 CE) — opposing Ali\'s caliphate — is one of the more discussed events in early Islamic history; she later expressed regret for her involvement. She is buried in al-Baqi\' cemetery in Madinah.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'ali-ibn-abi-talib', 'umar-ibn-al-khattab'],
    relatedEvents: ['death-of-prophet', 'first-revelation'],
    relatedPlaces: ['makkah', 'madinah'],
    topics: ['companion', 'scholar', 'seerah', 'hadith', 'family'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Hadith 1 (Kitab Bad\' al-Wahy)', note: 'First hadith in Bukhari narrated by Aisha, graded sahih' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 8', note: 'Primary biographical source' },
      { type: 'academic', ref: 'Denise Spellberg, Politics, Gender, and the Islamic Past: The Legacy of A\'isha bint Abi Bakr (1994)', note: 'Academic study of Aisha\'s historical legacy' }
    ],
    certainty: 'established',
    tags: ['companion', 'scholar', 'hadith', 'seerah', 'umm-al-muminin', 'madinah'],
    dayOfYear: null
  },
  {
    id: 'bilal-ibn-rabah',
    type: 'person', collection: 'companions', era: 'seerah',
    title: 'Bilal ibn Rabah (رضي الله عنه)',
    subtitle: 'The first Mu\'adhdhin. Symbol of Islam\'s stand against slavery',
    date: { hijri: 'c. 580 – 20 AH', gregorian: 'c. 580 – 640 CE' },
    startDate: 580, endDate: 640,
    location: 'Makkah (born enslaved); Madinah; Damascus (died)',
    summary: 'Bilal ibn Rabah was an Abyssinian slave in Makkah who was among the earliest converts to Islam and was tortured by his master Umayyah ibn Khalaf for his refusal to renounce the faith. Abu Bakr purchased his freedom. He became the Prophet\'s first mu\'adhdhin (one who calls to prayer) — his call from atop the Kaaba at the conquest of Makkah remains one of the most powerful symbols in Islamic history.',
    details: 'Bilal\'s endurance of torture — being laid on hot rocks in the Makkah sun while Umayyah demanded he renounce Islam, responding only "Ahad, Ahad" (One, One) — is one of the most renowned stories of early Islamic suffering and steadfastness. Abu Bakr (RA) paid his price and freed him. His appointment as the first mu\'adhdhin demonstrated Islam\'s fundamental rejection of racial hierarchy — a formerly enslaved African man had the highest ritual honour of calling the community to prayer. After the Prophet\'s death, Bilal was so overwhelmed with grief that he could barely complete the adhan; he gave the adhan in full only twice more, one of which was at the request of Umar during a visit to Syria.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'umayyah-ibn-khalaf'],
    relatedEvents: ['early-dawah-makkah', 'conquest-of-makkah'],
    relatedPlaces: ['makkah', 'madinah', 'damascus'],
    topics: ['companion', 'freedom', 'adhan', 'slavery', 'steadfastness'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Fada\'il al-Sahabah, Hadith 3754', note: 'Graded sahih' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 3', note: 'Detailed biographical account' },
      { type: 'academic', ref: 'Jonathan Brown, Misquoting Muhammad (2014)', note: 'Context of early Islamic social reform' }
    ],
    certainty: 'established',
    tags: ['companion', 'bilal', 'adhan', 'freedom', 'slavery', 'makkah'],
    dayOfYear: null
  },
  {
    id: 'khalid-ibn-al-walid',
    type: 'person', collection: 'companions', era: 'rashidun',
    title: 'Khalid ibn al-Walid (رضي الله عنه)',
    subtitle: 'Sayf Allah al-Maslul — the Drawn Sword of Allah',
    date: { hijri: 'c. 585 – 21 AH', gregorian: 'c. 585 – 642 CE' },
    startDate: 585, endDate: 642,
    location: 'Makkah; Madinah; Syria (died in Homs)',
    summary: 'Khalid ibn al-Walid was one of the greatest military commanders in history. Before accepting Islam, he led the cavalry charge that turned Uhud against the Muslims. After his conversion (628 CE), he became the undefeated general whose campaigns secured Arabia, defeated the Sassanid Persian Empire at al-Qadisiyyah, and decisively won the Battle of Yarmouk against the Byzantines.',
    details: 'Khalid\'s conversion occurred shortly before the conquest of Makkah. The Prophet ﷺ gave him the title "Sayf Allah al-Maslul" (the Drawn Sword of Allah). He is said to have fought in over 100 battles without ever suffering a defeat. He led the campaigns in the Wars of Riddah under Abu Bakr, then commanded in Iraq and Syria. Umar ibn al-Khattab controversially removed him from command at the Battle of Yarmouk (replacing him with Abu Ubayda ibn al-Jarrah) — the reasons for this and the exact timing are discussed in classical sources. Khalid reportedly wept on his deathbed that he had never achieved the martyrdom he sought in so many battles.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'umar-ibn-al-khattab', 'abu-ubayda-ibn-al-jarrah'],
    relatedEvents: ['battle-of-uhud', 'conquest-of-makkah', 'battle-of-yarmouk'],
    relatedPlaces: ['makkah', 'madinah', 'damascus', 'homs'],
    topics: ['companion', 'military', 'rashidun', 'expansion'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Jihad, Hadith 2800', note: 'Prophet\'s title for Khalid, graded sahih' },
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk', note: 'Accounts of his campaigns' },
      { type: 'academic', ref: 'Fred Donner, The Early Islamic Conquests (1981)', note: 'Academic analysis of early Muslim military campaigns' }
    ],
    certainty: 'established',
    tags: ['companion', 'military', 'rashidun', 'yarmouk', 'makkah', 'khalid'],
    dayOfYear: null
  },
  {
    id: 'fatimah-al-zahra',
    type: 'person', collection: 'companions', era: 'seerah',
    title: 'Fatimah al-Zahra (رضي الله عنها)',
    subtitle: 'Sayyidat Nisa\' al-Alamin — leader of the women of the worlds',
    date: { hijri: 'c. 5 BH – 11 AH', gregorian: 'c. 605 – 632 CE' },
    startDate: 605, endDate: 632,
    location: 'Makkah; Madinah',
    summary: 'Fatimah al-Zahra was the youngest and most beloved daughter of the Prophet ﷺ and Khadijah (RA), and the wife of Ali ibn Abi Talib (RA). She is described in the hadith as the leader of the women of the worlds and the one whose pleasure pleases Allah, and whose anger angers Allah. She died approximately six months after her father.',
    details: 'Fatimah is one of the Ahl al-Bayt (the Prophet\'s household), who are mentioned in the Quran (33:33) in the verse of purification. The Prophet ﷺ expressed deep love for her: "Fatimah is a part of me; whoever angers her angers me" (Bukhari). She is the mother of Hasan and Husayn. She passed away roughly six months after the Prophet ﷺ, grief-stricken. The details of her final months — including a dispute over the estate of Fadak — are a point of historical and theological discussion between Sunni and Shia traditions, with different narrations and interpretations. She is buried in Madinah, though the exact location is disputed.',
    people: ['muhammad-pbuh', 'khadijah-bint-khuwaylid', 'ali-ibn-abi-talib', 'hasan-ibn-ali', 'husayn-ibn-ali'],
    relatedEvents: ['death-of-prophet'],
    relatedPlaces: ['makkah', 'madinah'],
    topics: ['companion', 'ahl-al-bayt', 'family', 'seerah'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Fada\'il al-Sahabah, Hadith 3714', note: '"Fatimah is a part of me" — graded sahih' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 8', note: 'Primary biographical source' },
      { type: 'academic', ref: 'Denise Spellberg, Politics, Gender, and the Islamic Past (1994)', note: 'Academic context' }
    ],
    certainty: 'established',
    tags: ['companion', 'ahl-al-bayt', 'fatimah', 'seerah', 'madinah'],
    dayOfYear: null
  },
  {
    id: 'umar-ibn-abd-al-aziz',
    type: 'person', collection: 'companions', era: 'umayyad',
    title: 'Umar ibn Abd al-Aziz (رحمه الله)',
    subtitle: 'Umar II — the fifth Rightly-Guided Caliph',
    date: { hijri: '61 – 101 AH', gregorian: '682 – 720 CE' },
    startDate: 682, endDate: 720,
    location: 'Madinah; Umayyad Caliphate (capital: Damascus)',
    summary: 'Umar ibn Abd al-Aziz (Umar II) was an Umayyad Caliph widely regarded as the most just ruler in the centuries after the Rashidun — so much so that many classical scholars called him the fifth Rightly-Guided Caliph. He reversed his predecessors\' policies of cursing Ali from the pulpit, reduced taxation on non-Muslims, and lived with extraordinary personal austerity.',
    details: 'Umar II came from the Umayyad royal family but upon becoming Caliph, he returned lands and wealth accumulated by his family to the public treasury. He sought to apply the principles of justice associated with the earlier caliphs — Umar ibn al-Khattab was his role model. He is credited with initiating the systematic compilation of hadith (ordering Ibn Shihab al-Zuhri to begin the collection), ending the Umayyad practice of publicly cursing Ali ibn Abi Talib in Friday sermons, and reducing the jizya burden on newly converted non-Arabs. He served only two and a half years before dying of illness at around 38 years old. He is reported to have said: "I have been given authority over you without your consent and without your choice; I therefore release you from the allegiance you owe me."',
    people: ['ali-ibn-abi-talib', 'ibn-shihab-al-zuhri'],
    relatedEvents: ['umayyad-caliphate'],
    relatedPlaces: ['madinah', 'damascus'],
    topics: ['caliph', 'umayyad', 'justice', 'reform'],
    sources: [
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 5', note: 'Primary biographical source' },
      { type: 'academic', ref: 'H.A.R. Gibb, "The Fiscal Rescript of \'Umar II" in Arabica, Vol. 2 (1955)', note: 'Academic analysis of his fiscal reforms' },
      { type: 'academic', ref: 'G.R. Hawting, The First Dynasty of Islam (1986)', note: 'Context of Umayyad caliphate' }
    ],
    certainty: 'probable',
    tags: ['companion', 'caliph', 'umayyad', 'justice', 'reform', 'madinah'],
    dayOfYear: null
  }
];

/* ══════════════════════════════════════════════════════════
   COLLECTION 4 — CIVILIZATIONS
   Each entry covers an era's geography, knowledge,
   architecture, key figures, and primary sources.
   ══════════════════════════════════════════════════════════ */
H.civilizations = [
  {
    id: 'civ-baghdad-abbasid',
    type: 'civilization', collection: 'civilizations', era: 'abbasid',
    title: 'Baghdad — Capital of the Islamic Golden Age',
    subtitle: 'The Abbasid metropolis where knowledge became civilization',
    date: { hijri: '145 – 656 AH', gregorian: '762 – 1258 CE' },
    startDate: 762, endDate: 1258,
    location: 'Iraq — on the Tigris River',
    summary: 'Founded in 762 CE by the Abbasid Caliph al-Mansur as a circular planned city called Madinat al-Salam (City of Peace), Baghdad became the largest city in the world within a century and the intellectual capital of an extraordinary flowering of science, mathematics, medicine, philosophy, and literature. The House of Wisdom (Bayt al-Hikma) gathered scholars who translated classical knowledge and built upon it.',
    details: 'At its peak under Harun al-Rashid and al-Ma\'mun (9th century), Baghdad had an estimated population of 1–2 million. The House of Wisdom employed scholars who translated Aristotle, Galen, Euclid, and Ptolemy into Arabic — and then extended and corrected their work. Al-Khwarizmi developed algebra here. Al-Razi directed its hospitals. Al-Kindi pioneered Islamic philosophy. Al-Jahiz produced literary masterpieces. The city had public libraries, paper mills (paper having been adopted from China via Samarkand), markets, and sophisticated hydraulic systems. Baghdad was destroyed by the Mongols in 1258 CE — but the knowledge it had produced had already spread across the Islamic world and into Europe through translation movements in Toledo and Sicily.',
    topics: ['knowledge', 'science', 'mathematics', 'medicine', 'philosophy', 'architecture', 'translation'],
    people: ['al-khwarizmi', 'al-razi', 'ibn-al-haytham', 'al-biruni', 'harun-al-rashid', 'al-mamun'],
    relatedEvents: ['abbasid-caliphate', 'mongol-sack-of-baghdad'],
    relatedPlaces: ['baghdad', 'samarra', 'basra'],
    sources: [
      { type: 'academic', ref: 'Jim Al-Khalili, The House of Wisdom (2011)', note: 'Best accessible account of Baghdad\'s Golden Age science' },
      { type: 'academic', ref: 'Hugh Kennedy, The Court of the Caliphs (2004)', note: 'Cultural and political history of Abbasid Baghdad' },
      { type: 'academic', ref: 'Guy Le Strange, Baghdad During the Abbasid Caliphate (1900)', note: 'Classic historical geography' },
      { type: 'academic', ref: 'Dimitri Gutas, Greek Thought, Arabic Culture (1998)', note: 'The translation movement in detail' }
    ],
    certainty: 'established',
    tags: ['abbasid', 'baghdad', 'golden-age', 'science', 'knowledge', 'house-of-wisdom', 'iraq'],
    dayOfYear: null
  },
  {
    id: 'civ-cordoba-andalus',
    type: 'civilization', collection: 'civilizations', era: 'umayyad',
    title: 'Córdoba — Jewel of Al-Andalus',
    subtitle: 'Europe\'s most sophisticated medieval city — light, knowledge, and coexistence',
    date: { hijri: '92 – 422 AH', gregorian: '711 – 1031 CE' },
    startDate: 711, endDate: 1031,
    location: 'Southern Spain (Andalusia)',
    summary: 'At its 10th-century peak under the Umayyad Caliphate of Córdoba, the city had an estimated population of 500,000 — larger than any city in Western Europe. It had street lighting, paved roads, public baths, hospitals, and a major library. Philosophers, poets, physicians, and mathematicians flourished here across religious boundaries.',
    details: 'The Great Mosque of Córdoba (La Mezquita) — begun by Abd al-Rahman I in 785 CE and expanded across generations — stands as one of the finest architectural achievements in history. Abd al-Rahman III\'s court library reputedly held 400,000 volumes. Ibn Rushd (Averroes) wrote his Aristotle commentaries here; Ibn Tufayl wrote Hayy ibn Yaqzan; al-Zahrawi (Abulcasis) developed surgical instruments still recognisable today; Maimonides (Jewish philosopher) was born here. The concept of "convivencia" — the coexistence of Muslims, Christians, and Jews — is associated with Córdoba, though historians debate its extent and idealisation. The Umayyad Caliphate of Córdoba collapsed in civil war (taifa period) in the early 11th century.',
    topics: ['architecture', 'philosophy', 'medicine', 'mathematics', 'literature', 'coexistence', 'knowledge'],
    people: ['abd-al-rahman-i', 'abd-al-rahman-iii', 'ibn-rushd', 'al-zahrawi', 'ibn-tufayl'],
    relatedEvents: ['andalus', 'conquest-of-spain', 'caliphate-of-cordoba', 'fall-of-granada'],
    relatedPlaces: ['cordoba', 'granada', 'seville', 'toledo'],
    sources: [
      { type: 'academic', ref: 'Maria Rosa Menocal, The Ornament of the World (2002)', note: 'Cultural history of al-Andalus — note: some historians consider it idealised' },
      { type: 'academic', ref: 'Richard Fletcher, Moorish Spain (1992)', note: 'Balanced popular history' },
      { type: 'academic', ref: 'Hugh Kennedy, Muslim Spain and Portugal (1996)', note: 'Standard academic political history' },
      { type: 'disputed', ref: 'The degree of inter-religious tolerance in al-Andalus is debated — "convivencia" is both celebrated and critiqued as an oversimplification', note: 'Contested historiographical concept' }
    ],
    certainty: 'probable',
    tags: ['andalus', 'cordoba', 'spain', 'umayyad', 'golden-age', 'architecture', 'medicine'],
    dayOfYear: null
  },
  {
    id: 'civ-cairo-mamluk',
    type: 'civilization', collection: 'civilizations', era: 'mamluk',
    title: 'Cairo — Centre of Islamic Learning After Baghdad',
    subtitle: 'Fatimid Cairo, Ayyubid strength, and the Mamluk golden era',
    date: { hijri: '358 – 923 AH', gregorian: '969 – 1517 CE' },
    startDate: 969, endDate: 1517,
    location: 'Egypt — on the Nile',
    summary: 'Cairo (al-Qahira — "the Victorious") was founded by the Fatimid dynasty in 969 CE. Under successive Fatimid, Ayyubid, and Mamluk rulers, it became the largest and most important city in the Arab world — home to Al-Azhar (the world\'s oldest continuously operating university), a refuge for scholars after Baghdad\'s fall, and a major centre of commerce and Islamic architecture.',
    details: 'Al-Azhar Mosque and University, founded by the Fatimids in 970 CE, is the oldest continuously operating institution of higher learning in the world. Under the Mamluks (1250–1517), Cairo became the pre-eminent Islamic city after the Mongols destroyed Baghdad. Ibn Khaldun served as Chief Maliki Judge here. Ibn Battuta visited. Sultan Qalawun built a remarkable hospital complex (the Maristan). The Mamluk architectural legacy — the mosque-madrasa complexes of Sultan Hasan, Qalawun, and Barquq — represents one of the most sophisticated traditions in Islamic architecture. Cairo was conquered by the Ottomans in 1517 under Selim I, ending the Mamluk sultanate.',
    topics: ['knowledge', 'architecture', 'al-azhar', 'commerce', 'learning', 'hospitals'],
    people: ['ibn-khaldun', 'salahuddin-ayyubi', 'baybars'],
    relatedEvents: ['mongol-sack-of-baghdad', 'salahuddin-jerusalem', 'ottoman-empire'],
    relatedPlaces: ['cairo', 'egypt'],
    sources: [
      { type: 'academic', ref: 'Robert Irwin, The Middle East in the Middle Ages: The Early Mamluk Sultanate (1986)', note: 'Standard Mamluk history' },
      { type: 'academic', ref: 'Jonathan Bloom and Sheila Blair, The Grove Encyclopedia of Islamic Art and Architecture (2009)', note: 'Reference for architecture' },
      { type: 'academic', ref: 'Jonathan Berkey, The Transmission of Knowledge in Medieval Cairo (1992)', note: 'Detailed study of Al-Azhar and scholarly culture' }
    ],
    certainty: 'established',
    tags: ['egypt', 'cairo', 'fatimid', 'ayyubid', 'mamluk', 'al-azhar', 'knowledge'],
    dayOfYear: null
  },
  {
    id: 'civ-istanbul-ottoman',
    type: 'civilization', collection: 'civilizations', era: 'ottoman',
    title: 'Istanbul — Heart of the Ottoman World',
    subtitle: 'Constantinople conquered, transformed, and made the capital of Islamic civilization',
    date: { hijri: '857 – 1342 AH', gregorian: '1453 – 1924 CE' },
    startDate: 1453, endDate: 1924,
    location: 'Modern Turkey — at the meeting of Europe and Asia',
    summary: 'After Sultan Mehmed II conquered Constantinople in 1453 CE, the city was transformed into the Ottoman imperial capital — renamed Istanbul. For nearly 500 years it was one of the world\'s great cities: seat of the Caliphate after 1517, home to extraordinary mosques, the Topkapi Palace, the Grand Bazaar, and a cosmopolitan population of Muslims, Christians, and Jews.',
    details: 'Mehmed II converted the Hagia Sophia into a mosque and commissioned the construction of the Fatih Mosque complex on the site of the Church of the Holy Apostles. The Ottoman architectural tradition reached its pinnacle under Sinan — the master architect who built the Suleymaniye Mosque (Istanbul) and the Selimiye Mosque (Edirne), the latter considered his masterpiece. The Topkapi Palace served as the administrative centre of an empire spanning three continents. The city was a centre of scholarship, medicine, and commerce. The Ottoman Caliphate continued until its abolition in 1924 by Mustafa Kemal Ataturk — the end of the last formal Islamic caliphate.',
    topics: ['architecture', 'caliphate', 'ottoman', 'scholarship', 'commerce', 'empire'],
    people: ['mehmed-ii', 'suleiman-the-magnificent', 'sinan-the-architect'],
    relatedEvents: ['conquest-of-constantinople', 'ottoman-empire'],
    relatedPlaces: ['istanbul', 'hagia-sophia', 'topkapi'],
    sources: [
      { type: 'academic', ref: 'Caroline Finkel, Osman\'s Dream: The History of the Ottoman Empire (2005)', note: 'Comprehensive narrative history' },
      { type: 'academic', ref: 'Colin Imber, The Ottoman Empire, 1300–1650 (2002)', note: 'Standard academic history' },
      { type: 'academic', ref: 'Gülru Necipoğlu, The Age of Sinan: Architectural Culture in the Ottoman Empire (2005)', note: 'Definitive study of Ottoman architecture' }
    ],
    certainty: 'established',
    tags: ['ottoman', 'istanbul', 'turkey', 'architecture', 'caliphate', 'empire'],
    dayOfYear: null
  },
  {
    id: 'civ-bukhara-scholars',
    type: 'civilization', collection: 'civilizations', era: 'abbasid',
    title: 'Bukhara — City of Scholars',
    subtitle: 'Where hadith science, mathematics, and medicine flourished in Central Asia',
    date: { hijri: 'c. 200 – 600 AH', gregorian: 'c. 820 – 1220 CE' },
    startDate: 820, endDate: 1220,
    location: 'Modern Uzbekistan — Transoxiana (Ma wara\' al-Nahr)',
    summary: 'Bukhara was one of the great centres of Islamic scholarship in Central Asia — producing Imam al-Bukhari (compiler of the most authentic hadith collection), Ibn Sina (the greatest medieval physician), and a remarkable tradition of Islamic jurisprudence, theology, and science. It flourished under the Samanid dynasty before the Mongol devastation.',
    details: 'Bukhara\'s scholarly culture was extraordinary: Imam al-Bukhari (810–870 CE) was born there; Ibn Sina (980–1037 CE) was born nearby in Afshana and was educated in Bukhara\'s libraries. The Samanid dynasty (819–999 CE) made Persian the language of court literature while maintaining Arabics as the language of scholarship — producing a bilingual intellectual culture that spread across the region. The city was also a major stop on the Silk Road, generating commerce that funded scholarship. The Mongol invasion of 1220 CE devastated Bukhara — Genghis Khan\'s army destroyed much of the city and its population. It later recovered but never fully regained its pre-Mongol scholarly prominence.',
    topics: ['knowledge', 'hadith', 'medicine', 'scholarship', 'silk-road'],
    people: ['imam-al-bukhari', 'ibn-sina', 'al-biruni'],
    relatedEvents: ['abbasid-caliphate', 'mongol-sack-of-baghdad'],
    relatedPlaces: ['bukhara', 'samarkand'],
    sources: [
      { type: 'academic', ref: 'Richard Frye, Bukhara: The Medieval Achievement (1965)', note: 'Classic history of Bukhara' },
      { type: 'academic', ref: 'Jonathan Brown, Hadith: Muhammad\'s Legacy in the Medieval and Modern World (2009)', note: 'Context of hadith scholarship' },
      { type: 'academic', ref: 'Jim Al-Khalili, The House of Wisdom (2011)', note: 'Central Asian scholars in the Golden Age' }
    ],
    certainty: 'established',
    tags: ['abbasid', 'bukhara', 'uzbekistan', 'scholarship', 'hadith', 'medicine', 'silk-road'],
    dayOfYear: null
  }
];

/* ══════════════════════════════════════════════════════════
   COLLECTION 5 — SCHOLARS & SCIENTISTS
   ══════════════════════════════════════════════════════════ */
H.scholars = [
  {
    id: 'ibn-al-haytham',
    type: 'person', collection: 'scholars', era: 'abbasid',
    title: 'Ibn al-Haytham (Alhazen)',
    subtitle: 'Father of modern optics and the experimental scientific method',
    date: { hijri: 'c. 354 – 430 AH', gregorian: 'c. 965 – 1040 CE' },
    startDate: 965, endDate: 1040,
    location: 'Basra (born); Cairo (worked)',
    summary: 'Abu Ali al-Hasan ibn al-Haytham was a Muslim scholar who made foundational contributions to optics, mathematics, and scientific methodology. His Kitab al-Manazir (Book of Optics) established that vision occurs when light enters the eye — overturning the Greek "emission" theory — and deeply influenced European scientists including Roger Bacon, Kepler, and Descartes.',
    details: 'Ibn al-Haytham\'s Kitab al-Manazir, translated into Latin as De Aspectibus, was a standard text in European universities for centuries. His systematic use of controlled experiments and mathematical modelling to test hypotheses is considered by historians of science as an important early articulation of the scientific method. He studied camera obscura, atmospheric refraction, rainbows, and the psychology of visual perception. While working in Cairo under Fatimid rule, he is reported to have feigned madness to avoid punishment when his project to regulate the Nile floods proved impossible. His contributions to optics are unambiguous and well-documented; claims that he "invented" photography or the camera are anachronistic exaggerations.',
    topics: ['optics', 'mathematics', 'scientific-method', 'physics'],
    people: [],
    relatedEvents: ['abbasid-caliphate'],
    relatedPlaces: ['basra', 'cairo'],
    sources: [
      { type: 'academic', ref: 'A.I. Sabra, The Optics of Ibn al-Haytham, Books I–III (1989)', note: 'Definitive English translation with commentary' },
      { type: 'academic', ref: 'David Lindberg, Theories of Vision from al-Kindi to Kepler (1976)', note: 'Historical context of Islamic optics' },
      { type: 'academic', ref: 'Jim Al-Khalili, The House of Wisdom (2011)', note: 'Accessible account' }
    ],
    certainty: 'established',
    tags: ['scholar', 'scientist', 'optics', 'mathematics', 'abbasid', 'cairo'],
    dayOfYear: null
  },
  {
    id: 'al-khwarizmi',
    type: 'person', collection: 'scholars', era: 'abbasid',
    title: 'Muhammad ibn Musa al-Khwarizmi',
    subtitle: 'The father of algebra — whose name gave us "algorithm"',
    date: { hijri: 'c. 164 – 232 AH', gregorian: 'c. 780 – 850 CE' },
    startDate: 780, endDate: 850,
    location: 'Khwarazm (modern Uzbekistan); Baghdad',
    summary: 'Al-Khwarizmi was a Muslim mathematician and astronomer who worked at the House of Wisdom in Baghdad. His treatise Al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala introduced algebra as a systematic discipline. The word "algebra" derives from "al-jabr" in his title. The word "algorithm" derives from the Latin transliteration of his name.',
    details: 'Al-Khwarizmi\'s algebraic work focused on practical problems: land measurement, inheritance distribution, and commercial transactions. His work on Hindu-Arabic numerals — including zero — helped introduce this number system to the Islamic world and subsequently to Europe. His astronomical tables (zij) were translated into Latin and used by European astronomers. His geography work produced a revised version of Ptolemy\'s Geography with coordinates for 2,402 locations. It is important to note that al-Khwarizmi synthesised and systematised existing mathematical traditions (Indian, Babylonian, Greek) rather than creating mathematics from nothing — the contribution is the synthesis and articulation, which was profound.',
    topics: ['mathematics', 'algebra', 'astronomy', 'geography'],
    people: [],
    relatedEvents: ['abbasid-caliphate'],
    relatedPlaces: ['baghdad', 'khwarazm'],
    sources: [
      { type: 'academic', ref: 'Roshdi Rashed, The Development of Arabic Mathematics (1994)', note: 'Authoritative academic study' },
      { type: 'academic', ref: 'Frederick Rosen, The Algebra of Mohammed ben Musa (1831)', note: 'Early English translation of Kitab al-jabr' },
      { type: 'academic', ref: 'Jim Al-Khalili, The House of Wisdom (2011)' }
    ],
    certainty: 'established',
    tags: ['scholar', 'mathematician', 'algebra', 'abbasid', 'baghdad'],
    dayOfYear: null
  },
  {
    id: 'ibn-sina',
    type: 'person', collection: 'scholars', era: 'abbasid',
    title: 'Ibn Sina (Avicenna)',
    subtitle: 'The Prince of Physicians — master of medicine and philosophy',
    date: { hijri: 'c. 370 – 428 AH', gregorian: 'c. 980 – 1037 CE' },
    startDate: 980, endDate: 1037,
    location: 'Bukhara (born); various Persian courts',
    summary: 'Abu Ali al-Husayn ibn Sina was one of the most significant intellectuals of the Islamic world. His Canon of Medicine (Al-Qanun fi al-Tibb) was the standard medical text in both Islamic and European universities for centuries. His philosophical works engaged with Aristotle and Islamic theology and profoundly influenced European scholasticism.',
    details: 'Ibn Sina reportedly memorised the Quran by age 10 and was practicing medicine by 16. The Canon of Medicine systematised Greek, Indian, and Islamic medical knowledge and was translated into Latin, remaining a core medical textbook in Europe until the 17th century. His "flying man" thought experiment — imagining a person suspended in space with all sensory input removed — is a landmark in the philosophy of self-awareness and consciousness, anticipating Descartes\' cogito by six centuries. His theological-philosophical synthesis was critiqued by al-Ghazali in the Incoherence of the Philosophers, to which Ibn Rushd later responded. He died while dictating a medical compendium.',
    topics: ['medicine', 'philosophy', 'logic', 'astronomy', 'mathematics'],
    people: ['al-biruni', 'al-ghazali', 'ibn-rushd'],
    relatedEvents: ['abbasid-caliphate'],
    relatedPlaces: ['bukhara', 'isfahan'],
    sources: [
      { type: 'academic', ref: 'Lenn Goodman, Avicenna (1992)', note: 'Comprehensive intellectual biography' },
      { type: 'academic', ref: 'Peter Adamson, Philosophy in the Islamic World (2016)', note: 'Academic overview of Islamic philosophy' }
    ],
    certainty: 'established',
    tags: ['scholar', 'physician', 'philosopher', 'medicine', 'abbasid', 'persia'],
    dayOfYear: null
  },
  {
    id: 'ibn-khaldun',
    type: 'person', collection: 'scholars', era: 'mamluk',
    title: 'Ibn Khaldun',
    subtitle: 'Founder of sociology — the first philosopher of history',
    date: { hijri: '732 – 808 AH', gregorian: '1332 – 1406 CE' },
    startDate: 1332, endDate: 1406,
    location: 'Tunis (born); North Africa; al-Andalus; Cairo (died)',
    summary: 'Abd al-Rahman ibn Khaldun\'s Muqaddimah (Prolegomena) is considered a founding work of historiography, sociology, economics, and demography. His concept of asabiyyah (group solidarity) as the driver of historical cycles of civilizational rise and fall was unprecedented — and his methodology of seeking causal explanations for historical change remains foundational.',
    details: 'The Muqaddimah was intended as an introduction to his larger historical work, the Kitab al-Ibar. In it, Ibn Khaldun argued that history must be understood through material and social causes — not just the will of rulers or divine intervention in a simplistic sense. He analysed economics, climate, demography, and social psychology as drivers of history. He served at courts across North Africa, in Granada, and as Chief Maliki Judge in Cairo. He met Timur (Tamerlane) outside Damascus in 1401 — an extraordinary encounter documented in his own autobiography. His work influenced Hegel, Marx (social dynamics), Toynbee, and modern economists.',
    topics: ['history', 'sociology', 'economics', 'philosophy', 'politics'],
    people: [],
    relatedEvents: ['mamluk-dynasty'],
    relatedPlaces: ['tunis', 'cairo', 'granada'],
    sources: [
      { type: 'academic', ref: 'Franz Rosenthal, Ibn Khaldun: The Muqaddimah (1958)', note: 'Definitive 3-volume English translation' },
      { type: 'academic', ref: 'Robert Irwin, Ibn Khaldun: An Intellectual Biography (2018)', note: 'Modern scholarly biography' }
    ],
    certainty: 'established',
    tags: ['scholar', 'historian', 'sociologist', 'north-africa', 'cairo', 'muqaddimah'],
    dayOfYear: null
  }
];

/* ══════════════════════════════════════════════════════════
   COLLECTION 6 — DYNASTIES
   ══════════════════════════════════════════════════════════ */
H.dynasties = [
  {
    id: 'rashidun-caliphate',
    type: 'dynasty', collection: 'dynasties', era: 'rashidun',
    title: 'The Rashidun Caliphate',
    subtitle: 'The Rightly-Guided Caliphs — 632 to 661 CE',
    date: { hijri: '11 – 41 AH', gregorian: '632 – 661 CE' },
    startDate: 632, endDate: 661,
    location: 'Madinah (capital), expanding across Arabia, Levant, Persia, Egypt',
    summary: 'The Rashidun (Rightly-Guided) Caliphate was led by Abu Bakr, Umar, Uthman, and Ali. It represented the first Islamic state and saw extraordinary territorial expansion alongside the compilation of the Quran and establishment of Islamic governance. Classical Islamic tradition regards this as the model era of Islamic leadership.',
    details: 'Major achievements include: the Wars of Riddah (consolidating Arabia under Abu Bakr), the conquests of Persia, the Levant, and Egypt (under Umar), the standardisation of the Quranic text (the Uthmanic codex), and the establishment of the Hijri calendar. The period ended with the first fitna — the civil conflict between Ali and Muawiyah — which led to Ali\'s assassination and the Umayyad takeover. The nature of these early disputes and their theological significance is understood differently in Sunni and Shia traditions, and WaqtX presents both the shared historical facts and notes where accounts diverge.',
    topics: ['caliphate', 'expansion', 'quran', 'governance'],
    people: ['abu-bakr-al-siddiq', 'umar-ibn-al-khattab', 'uthman-ibn-affan', 'ali-ibn-abi-talib'],
    relatedEvents: ['death-of-prophet', 'battle-of-yarmouk'],
    relatedPlaces: ['madinah', 'makkah', 'jerusalem'],
    sources: [
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk', note: 'Primary classical source' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)' },
      { type: 'academic', ref: 'Wilferd Madelung, The Succession to Muhammad (1997)' }
    ],
    certainty: 'probable',
    tags: ['rashidun', 'caliphate', 'expansion', 'companions'],
    dayOfYear: null
  },
  {
    id: 'umayyad-caliphate',
    type: 'dynasty', collection: 'dynasties', era: 'umayyad',
    title: 'The Umayyad Caliphate',
    subtitle: 'The first Muslim dynasty — Damascus to Andalus',
    date: { hijri: '41 – 132 AH', gregorian: '661 – 750 CE' },
    startDate: 661, endDate: 750,
    location: 'Damascus (capital), from Iberia to the Indus Valley',
    summary: 'The Umayyad Caliphate saw the greatest territorial expansion of any state up to its time — reaching from al-Andalus (Spain) in the west to the Indus Valley in the east. It built the Dome of the Rock, the Great Mosque of Damascus, and produced major administrative achievements. It ended with the Abbasid Revolution of 750 CE.',
    details: 'The Umayyad period is complex in Islamic historiography — associated with administrative innovation and expansion, but critiqued by classical scholars for departing from early Islamic simplicity. The Dome of the Rock (691 CE) in Jerusalem remains one of the earliest and most magnificent Islamic monuments. The Tragedy of Karbala (680 CE), in which Husayn ibn Ali was martyred, occurred under Umayyad rule and is central to Shia Islam. Umar ibn Abd al-Aziz (r. 717–720 CE) is widely regarded as the most just Umayyad ruler. The caliphate fell to the Abbasid Revolution, though an Umayyad Emirate (later Caliphate) survived in al-Andalus until 1031 CE.',
    topics: ['caliphate', 'expansion', 'architecture', 'damascus', 'andalus'],
    people: ['muawiyah-ibn-abi-sufyan', 'umar-ibn-abd-al-aziz', 'tariq-ibn-ziyad', 'husayn-ibn-ali'],
    relatedEvents: ['battle-of-karbala', 'conquest-of-spain', 'abbasid-revolution'],
    relatedPlaces: ['damascus', 'jerusalem', 'cordoba'],
    sources: [
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk' },
      { type: 'academic', ref: 'G.R. Hawting, The First Dynasty of Islam (1986)' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)' }
    ],
    certainty: 'probable',
    tags: ['umayyad', 'caliphate', 'damascus', 'expansion', 'andalus'],
    dayOfYear: null
  },
  {
    id: 'abbasid-caliphate',
    type: 'dynasty', collection: 'dynasties', era: 'abbasid',
    title: 'The Abbasid Caliphate',
    subtitle: 'The Islamic Golden Age — Baghdad and the House of Wisdom',
    date: { hijri: '132 – 656 AH', gregorian: '750 – 1258 CE' },
    startDate: 750, endDate: 1258,
    location: 'Baghdad (capital)',
    summary: 'The Abbasid Caliphate ruled for over 500 years from Baghdad, overseeing the Islamic Golden Age — an extraordinary flourishing of science, mathematics, medicine, philosophy, literature, and art. The House of Wisdom (Bayt al-Hikma) became a global centre of scholarship. The caliphate was destroyed by the Mongols in 1258 CE.',
    details: 'The Abbasid caliphate began with the Abbasid Revolution overthrowing the Umayyads. Under al-Mansur, al-Mahdi, Harun al-Rashid, and al-Ma\'mun, Baghdad became the world\'s largest city and intellectual capital. The translation movement brought Greek, Indian, and Persian knowledge into Arabic. Muslim scholars then extended and corrected this knowledge across all fields. The caliphate gradually fragmented as regional dynasties (Buyids, Seljuks) held real power while Abbasid caliphs became symbolic figures. The Mongol sack of Baghdad in 1258 ended the dynasty, though a shadow Abbasid caliphate continued in Cairo under the Mamluks.',
    topics: ['caliphate', 'science', 'knowledge', 'architecture', 'philosophy'],
    people: ['al-khwarizmi', 'ibn-sina', 'ibn-al-haytham', 'al-biruni', 'al-razi', 'ibn-khaldun'],
    relatedEvents: ['mongol-sack-of-baghdad', 'house-of-wisdom'],
    relatedPlaces: ['baghdad', 'basra', 'samarra'],
    sources: [
      { type: 'academic', ref: 'Hugh Kennedy, The Court of the Caliphs (2004)' },
      { type: 'academic', ref: 'Jim Al-Khalili, The House of Wisdom (2011)' }
    ],
    certainty: 'established',
    tags: ['abbasid', 'caliphate', 'baghdad', 'golden-age', 'science'],
    dayOfYear: null
  },
  {
    id: 'andalus',
    type: 'dynasty', collection: 'dynasties', era: 'umayyad',
    title: 'Islamic Spain (Al-Andalus)',
    subtitle: 'Eight centuries of Muslim civilization in Europe',
    date: { hijri: '92 – 897 AH', gregorian: '711 – 1492 CE' },
    startDate: 711, endDate: 1492,
    location: 'Iberian Peninsula (modern Spain and Portugal)',
    summary: 'Al-Andalus was the territory of the Iberian Peninsula under Muslim rule for nearly 800 years. At its peak under the Umayyad Caliphate of Córdoba, it was one of the most culturally and intellectually advanced societies in Europe — producing philosophers, physicians, architects, and poets.',
    details: 'The Muslim conquest of Iberia began with Tariq ibn Ziyad at the Battle of Guadalete (711 CE). Córdoba became Europe\'s largest city by the 10th century. The period saw significant cultural exchange between Muslim, Jewish, and Christian scholars. Granada, the last Muslim kingdom, fell in 1492 CE. The legacy of al-Andalus — in architecture (Alhambra, Great Mosque of Córdoba), philosophy (Ibn Rushd), medicine (al-Zahrawi), and literature — is one of the most celebrated in Islamic history. Historians debate the degree of religious tolerance — the reality was varied across different periods and rulers.',
    topics: ['civilization', 'architecture', 'philosophy', 'medicine', 'coexistence'],
    people: ['tariq-ibn-ziyad', 'abd-al-rahman-i', 'ibn-rushd', 'al-zahrawi'],
    relatedEvents: ['conquest-of-spain', 'fall-of-granada', 'caliphate-of-cordoba'],
    relatedPlaces: ['cordoba', 'granada', 'seville'],
    sources: [
      { type: 'academic', ref: 'Richard Fletcher, Moorish Spain (1992)' },
      { type: 'academic', ref: 'Hugh Kennedy, Muslim Spain and Portugal (1996)' },
      { type: 'academic', ref: 'Maria Menocal, The Ornament of the World (2002)' }
    ],
    certainty: 'probable',
    tags: ['andalus', 'spain', 'umayyad', 'cordoba', 'granada', 'civilization'],
    dayOfYear: null
  },
  {
    id: 'ottoman-empire',
    type: 'dynasty', collection: 'dynasties', era: 'ottoman',
    title: 'The Ottoman Empire',
    subtitle: 'Six centuries — from Anatolia to the gates of Vienna',
    date: { hijri: 'c. 700 – 1342 AH', gregorian: 'c. 1299 – 1924 CE' },
    startDate: 1299, endDate: 1924,
    location: 'Anatolia (core); three continents at peak',
    summary: 'The Ottoman Empire was one of the longest-lasting and most powerful empires in history. At its height it controlled southeast Europe, western Asia, and north Africa. Istanbul (Constantinople), conquered by Mehmed II in 1453 CE, was its capital. The Ottoman sultans held the Caliphate title from 1517 until its abolition in 1924.',
    details: 'The Ottomans began as a small Anatolian principality under Osman I (c. 1299) and expanded rapidly. Mehmed II\'s conquest of Constantinople in 1453 ended the Byzantine Empire. Under Suleiman the Magnificent (r. 1520–1566), the empire reached its greatest extent and cultural peak. The Ottoman legal system (kanun), architectural tradition (Sinan\'s masterworks), and literary culture were major contributions. The Caliphate came to the Ottomans with Selim I\'s conquest of Egypt in 1517 — its legitimacy is debated by historians. The empire declined from the 18th century and was dissolved after World War I; the Caliphate was abolished in 1924.',
    topics: ['caliphate', 'empire', 'architecture', 'law', 'expansion'],
    people: ['mehmed-ii', 'suleiman-the-magnificent', 'selim-i'],
    relatedEvents: ['conquest-of-constantinople'],
    relatedPlaces: ['istanbul', 'cairo', 'makkah', 'jerusalem'],
    sources: [
      { type: 'academic', ref: 'Colin Imber, The Ottoman Empire, 1300–1650 (2002)' },
      { type: 'academic', ref: 'Caroline Finkel, Osman\'s Dream (2005)' }
    ],
    certainty: 'established',
    tags: ['ottoman', 'turkey', 'istanbul', 'caliphate', 'empire'],
    dayOfYear: null
  }
];

/* ══════════════════════════════════════════════════════════
   COLLECTION 7 — PLACES
   ══════════════════════════════════════════════════════════ */
H.places = [
  {
    id: 'makkah',
    type: 'place', collection: 'places', era: 'seerah',
    title: 'Makkah al-Mukarramah',
    subtitle: 'The holiest city in Islam — birthplace of the Prophet ﷺ and site of the Kaaba',
    date: { hijri: 'Ancient', gregorian: 'Ancient' },
    startDate: -3000, endDate: null,
    location: 'Hejaz region, Saudi Arabia',
    summary: 'Makkah is the holiest city in Islam, the birthplace of the Prophet Muhammad ﷺ, and the location of the Masjid al-Haram and the Kaaba — the direction of prayer for 1.8 billion Muslims and the destination of the annual Hajj pilgrimage. Non-Muslims are not permitted to enter the city.',
    details: 'The Kaaba, believed in Islamic tradition to have been built by Ibrahim (AS) and Ismail (AS) on the site of the first house of worship on Earth, stands at the centre of Masjid al-Haram. The Zamzam well is within the mosque precincts. Makkah was the centre of Arab tribal and commercial culture before Islam. The Prophet ﷺ was born, received revelation, and preached here for 13 years before the Hijrah. He returned to conquer it peacefully in 630 CE. The city has undergone massive development in the 20th and 21st centuries; much of the historic fabric has been replaced with modern infrastructure to accommodate millions of pilgrims annually.',
    topics: ['pilgrimage', 'kaaba', 'seerah', 'prayer-direction'],
    people: ['muhammad-pbuh', 'ibrahim-pbuh', 'ismail-pbuh'],
    relatedEvents: ['birth-of-prophet', 'first-revelation', 'hijrah', 'conquest-of-makkah', 'farewell-pilgrimage'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Baqarah 2:125–127', note: 'Ibrahim and Ismail building the Kaaba' },
      { type: 'academic', ref: 'F.E. Peters, Mecca: A Literary History of the Muslim Holy Land (1994)' }
    ],
    certainty: 'established',
    tags: ['place', 'holy', 'kaaba', 'hajj', 'seerah', 'hejaz'],
    dayOfYear: null
  },
  {
    id: 'madinah',
    type: 'place', collection: 'places', era: 'seerah',
    title: 'Al-Madinah al-Munawwarah',
    subtitle: 'The Illuminated City — home of the Prophet ﷺ after the Hijrah',
    date: { hijri: '1 AH onwards', gregorian: '622 CE onwards' },
    startDate: 622, endDate: null,
    location: 'Hejaz region, Saudi Arabia',
    summary: 'Madinah (formerly Yathrib) became the political and spiritual capital of the early Muslim community after the Hijrah. The Prophet ﷺ is buried there in what is now the Masjid al-Nabawi. It is the second holiest city in Islam.',
    details: 'Upon arrival in Madinah, the Prophet ﷺ established the first mosque and drafted the Constitution of Madinah — a remarkable civic document establishing rights and responsibilities for the diverse community. The city was the base from which Islam spread across Arabia. The Masjid al-Nabawi, greatly expanded over the centuries, now accommodates millions of visitors annually. The Prophet\'s tomb within the mosque is visited by Muslims from around the world. The city served as the capital of the early Islamic state through the caliphate of Ali.',
    topics: ['hijrah', 'mosque', 'seerah', 'governance'],
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'umar-ibn-al-khattab'],
    relatedEvents: ['hijrah', 'battle-of-badr', 'death-of-prophet'],
    sources: [
      { type: 'academic', ref: 'F.E. Peters, Muhammad and the Origins of Islam (1994)' },
      { type: 'academic', ref: 'W. Montgomery Watt, Muhammad at Medina (1956)' }
    ],
    certainty: 'established',
    tags: ['place', 'holy', 'prophet', 'mosque', 'hejaz'],
    dayOfYear: null
  },
  {
    id: 'jerusalem',
    type: 'place', collection: 'places', era: 'seerah',
    title: 'Jerusalem — Al-Quds al-Sharif',
    subtitle: 'The Noble Sanctuary — first qibla, third holiest city in Islam',
    date: { hijri: 'Ancient', gregorian: 'Ancient' },
    startDate: -3000, endDate: null,
    location: 'Palestine',
    summary: 'Jerusalem (al-Quds — "the Holy") is the third holiest city in Islam and the site of Masjid al-Aqsa. It was the first direction of prayer (qibla) before the change to Makkah. The Prophet ﷺ was taken there during the Night Journey (Isra\'). The city has been the site of Muslim presence and governance across multiple dynasties.',
    details: 'The Quranic reference to "al-Masjid al-Aqsa" in Surah Al-Isra\' 17:1 establishes Jerusalem\'s special significance in Islam. The city was peacefully surrendered to Umar ibn al-Khattab in 638 CE, who guaranteed the safety of its Christian and Jewish inhabitants. The Dome of the Rock (completed 691 CE) on the Temple Mount is one of the oldest surviving Islamic monuments. Salahuddin Ayyubi recaptured it from Crusader rule in 1187 CE with a renowned act of mercy. The city has been under continuous contest for centuries; today it remains one of the most politically sensitive locations in the world.',
    topics: ['prayer', 'isra-miraj', 'al-aqsa', 'prophets', 'pilgrimage'],
    people: ['muhammad-pbuh', 'umar-ibn-al-khattab', 'salahuddin-ayyubi', 'isa-pbuh', 'musa-pbuh'],
    relatedEvents: ['isra-and-miraj', 'caliphate-umar', 'salahuddin-jerusalem', 'conquest-of-constantinople'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Isra\' 17:1', note: '"to al-Masjid al-Aqsa"' },
      { type: 'academic', ref: 'F.E. Peters, Jerusalem (1985)', note: 'Comprehensive history of the city' }
    ],
    certainty: 'established',
    tags: ['place', 'holy', 'jerusalem', 'al-aqsa', 'seerah', 'qibla'],
    dayOfYear: null
  },
  {
    id: 'baghdad',
    type: 'place', collection: 'places', era: 'abbasid',
    title: 'Baghdad',
    subtitle: 'City of Peace — capital of the Islamic Golden Age',
    date: { hijri: 'Founded 145 AH', gregorian: 'Founded 762 CE' },
    startDate: 762, endDate: null,
    location: 'Modern Iraq, on the Tigris River',
    summary: 'Baghdad was founded by Abbasid Caliph al-Mansur in 762 CE. It rapidly became the world\'s largest city and the intellectual capital of the Islamic Golden Age. The House of Wisdom gathered scholars from across the known world. The city was devastated by the Mongols in 1258 CE.',
    topics: ['knowledge', 'science', 'abbasid', 'caliphate'],
    people: ['al-khwarizmi', 'al-razi', 'harun-al-rashid', 'al-mamun'],
    relatedEvents: ['abbasid-caliphate', 'mongol-sack-of-baghdad'],
    sources: [
      { type: 'academic', ref: 'Hugh Kennedy, The Court of the Caliphs (2004)' },
      { type: 'academic', ref: 'Jim Al-Khalili, The House of Wisdom (2011)' }
    ],
    certainty: 'established',
    tags: ['place', 'abbasid', 'golden-age', 'house-of-wisdom', 'iraq'],
    dayOfYear: null
  },
  {
    id: 'cordoba',
    type: 'place', collection: 'places', era: 'umayyad',
    title: 'Córdoba (Qurtuba)',
    subtitle: 'The jewel of al-Andalus — Europe\'s most sophisticated medieval city',
    date: { hijri: 'Muslim rule: 92–422 AH', gregorian: 'Muslim rule: 711–1031 CE' },
    startDate: 711, endDate: 1031,
    location: 'Southern Spain (Andalusia)',
    summary: 'At its 10th-century peak, Córdoba was one of the largest and most sophisticated cities in the world. The Great Mosque of Córdoba, begun in 785 CE, is a masterwork of Islamic architecture. The city was a centre of philosophy, medicine, mathematics, and literature across religious lines.',
    topics: ['architecture', 'philosophy', 'medicine', 'literature'],
    people: ['abd-al-rahman-i', 'ibn-rushd', 'al-zahrawi'],
    relatedEvents: ['andalus', 'conquest-of-spain', 'caliphate-of-cordoba'],
    sources: [
      { type: 'academic', ref: 'Richard Fletcher, Moorish Spain (1992)' },
      { type: 'academic', ref: 'Maria Menocal, The Ornament of the World (2002)' }
    ],
    certainty: 'established',
    tags: ['place', 'andalus', 'spain', 'umayyad', 'cordoba', 'architecture'],
    dayOfYear: null
  }
];

/* ══════════════════════════════════════════════════════════
   ADDITIONAL EVENTS (Phase 1 + Phase 2 entries)
   ══════════════════════════════════════════════════════════ */
H.events = H.events.concat([
  {
    id: 'caliphate-abu-bakr',
    type: 'event', collection: 'events', era: 'rashidun',
    title: 'Caliphate of Abu Bakr al-Siddiq',
    subtitle: 'The first caliph — consolidating the Ummah',
    date: { hijri: '11 – 13 AH', gregorian: '632 – 634 CE' },
    startDate: 632, endDate: 634,
    location: 'Madinah',
    summary: 'Abu Bakr al-Siddiq became the first Caliph after the Prophet\'s passing. His short two-year caliphate saw the Wars of Riddah (consolidating Arabia), the beginning of the systematic Quran compilation, and the start of military campaigns into Persia and the Byzantine Levant.',
    details: 'Abu Bakr\'s selection as Caliph took place at the Saqifah of Banu Sa\'idah. The Wars of Riddah involved tribes who refused to pay zakat after the Prophet\'s death, which Abu Bakr firmly addressed — notably insisting that zakat was a pillar of Islam and not negotiable even for tribes who said they would still pray. The initiation of the Quran\'s compilation was prompted by the deaths of many hafiz (memorisers) at the Battle of Yamama.',
    people: ['abu-bakr-al-siddiq', 'umar-ibn-al-khattab', 'khalid-ibn-al-walid', 'zayd-ibn-thabit'],
    relatedEvents: ['death-of-prophet', 'caliphate-umar'],
    relatedPlaces: ['madinah'],
    topics: ['rashidun', 'caliphate', 'quran', 'expansion'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Hudud', note: 'Wars of Riddah narrations' },
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk', note: 'Primary classical source' },
      { type: 'academic', ref: 'Fred Donner, The Early Islamic Conquests (1981)' }
    ],
    certainty: 'probable',
    tags: ['rashidun', 'caliphate', 'abu-bakr', 'madinah', 'quran-compilation'],
    dayOfYear: null
  },
  {
    id: 'caliphate-umar',
    type: 'event', collection: 'events', era: 'rashidun',
    title: 'Caliphate of Umar ibn al-Khattab',
    subtitle: 'The great administrator — Jerusalem, Persia, and Egypt',
    date: { hijri: '13 – 23 AH', gregorian: '634 – 644 CE' },
    startDate: 634, endDate: 644,
    location: 'Madinah; expanding to Persia, Levant, Egypt',
    summary: 'Umar ibn al-Khattab\'s ten-year caliphate saw the most rapid territorial expansion in early Islamic history. The Islamic state extended across Persia, the Levant (including Jerusalem), and Egypt. Umar was renowned for his justice, simple lifestyle, and administrative innovations.',
    details: 'Major events: Battle of al-Qadisiyyah (defeating the Sassanid Persian Empire), Battle of Yarmouk (defeating the Byzantines in Syria), conquest of Jerusalem (Umar entered personally and refused to pray inside the Church of the Holy Sepulchre), conquest of Egypt under Amr ibn al-As. Umar established the diwan (state register), created the Hijri calendar, and personally walked the streets of Madinah at night. He was assassinated while leading Fajr prayer.',
    people: ['umar-ibn-al-khattab', 'khalid-ibn-al-walid', 'amr-ibn-al-as', 'saad-ibn-abi-waqqas'],
    relatedEvents: ['caliphate-abu-bakr', 'battle-of-yarmouk', 'caliphate-uthman'],
    relatedPlaces: ['madinah', 'jerusalem', 'egypt'],
    topics: ['rashidun', 'caliphate', 'expansion', 'governance', 'justice'],
    sources: [
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk', note: 'Primary classical source' },
      { type: 'classical', ref: 'Al-Baladhuri, Futuh al-Buldan', note: 'Account of the conquests' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)' }
    ],
    certainty: 'probable',
    tags: ['rashidun', 'umar', 'caliphate', 'expansion', 'jerusalem'],
    dayOfYear: null
  },
  {
    id: 'caliphate-uthman',
    type: 'event', collection: 'events', era: 'rashidun',
    title: 'Caliphate of Uthman ibn Affan',
    subtitle: 'The Quran standardised — the empire expanded',
    date: { hijri: '23 – 35 AH', gregorian: '644 – 656 CE' },
    startDate: 644, endDate: 656,
    location: 'Madinah',
    summary: 'Uthman ibn Affan, the third Caliph, oversaw the standardisation of the Quranic manuscript — the defining act of Islamic textual preservation. His caliphate also saw the state expand into North Africa, Cyprus, and Central Asia, before internal dissent led to his assassination.',
    details: 'The Uthmanic codex — distributing authoritative Quranic manuscripts to Kufa, Basra, Damascus, and Makkah — ensured a single standard text. Uthman was assassinated by rebels in 656 CE while reciting the Quran, precipitating the first fitna.',
    people: ['uthman-ibn-affan', 'zayd-ibn-thabit', 'ali-ibn-abi-talib'],
    relatedEvents: ['caliphate-umar', 'caliphate-ali'],
    relatedPlaces: ['madinah'],
    topics: ['rashidun', 'caliphate', 'quran'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Fada\'il al-Quran, Hadith 4987', note: 'Graded sahih' },
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk' }
    ],
    certainty: 'probable',
    tags: ['rashidun', 'caliphate', 'uthman', 'quran-compilation'],
    dayOfYear: 15
  },
  {
    id: 'battle-of-yarmouk',
    type: 'event', collection: 'events', era: 'rashidun',
    title: 'Battle of Yarmouk',
    subtitle: 'The battle that opened the Byzantine Levant to Islam',
    date: { hijri: '15 AH', gregorian: '636 CE' },
    startDate: 636, endDate: null,
    location: 'Yarmouk River, modern Jordan/Syria border',
    summary: 'One of the most strategically significant battles of the early Islamic conquests. The Muslim army defeated a much larger Byzantine force, effectively ending Byzantine rule over Greater Syria and paving the way for the conquest of Jerusalem, Damascus, and the Levant.',
    details: 'The battle lasted several days. Khalid ibn al-Walid\'s tactical role is well-attested, though the timing of Umar\'s replacement of him as commander with Abu Ubayda ibn al-Jarrah during the battle varies in the sources. The Byzantine defeat has been attributed to tactical skill, internal religious tensions, and regional disaffection with Byzantine rule. Exact army sizes are disputed in classical sources.',
    people: ['khalid-ibn-al-walid', 'abu-ubayda-ibn-al-jarrah', 'umar-ibn-al-khattab'],
    relatedEvents: ['caliphate-umar', 'conquest-of-jerusalem'],
    relatedPlaces: ['damascus', 'jerusalem'],
    topics: ['rashidun', 'battle', 'expansion', 'byzantines'],
    sources: [
      { type: 'classical', ref: 'Al-Tabari, Tarikh; Al-Waqidi, Kitab al-Maghazi (reliability debated)', note: 'Classical sources' },
      { type: 'academic', ref: 'David Nicolle, Yarmuk 636 AD (1994)' }
    ],
    certainty: 'probable',
    tags: ['rashidun', 'battle', 'yarmouk', 'byzantines', 'syria'],
    dayOfYear: null
  },
  {
    id: 'battle-of-karbala',
    type: 'event', collection: 'events', era: 'umayyad',
    title: 'The Battle of Karbala',
    subtitle: 'The martyrdom of Husayn ibn Ali — 10 Muharram 61 AH',
    date: { hijri: '10 Muharram 61 AH', gregorian: '10 October 680 CE' },
    startDate: 680, endDate: null,
    location: 'Karbala, modern Iraq',
    summary: 'Husayn ibn Ali — grandson of the Prophet ﷺ — was killed with most of his companions at Karbala by forces loyal to Yazid ibn Muawiyah after refusing to pledge allegiance to an unjust ruler. His martyrdom is one of the most profoundly significant events in Islamic history.',
    details: 'Husayn had left Madinah after refusing to give bay\'a to Yazid. Expected support from Kufa failed to materialise when Umayyad forces cut off the city. Husayn and approximately 72 fighters were killed; women and children were taken captive. The event is universally mourned; its theological significance differs between Sunni and Shia Muslims.',
    people: ['husayn-ibn-ali', 'ali-ibn-abi-talib', 'zaynab-bint-ali'],
    relatedEvents: ['umayyad-caliphate', 'caliphate-ali'],
    relatedPlaces: ['karbala', 'kufa', 'madinah'],
    topics: ['umayyad', 'martyrdom', 'ashura', 'ahl-al-bayt'],
    sources: [
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk, Vol. 19', note: 'Most detailed classical account — drawn from Abu Mikhnaf; reliability of details debated' },
      { type: 'academic', ref: 'Heinz Halm, Shi\'a Islam (1997)' },
      { type: 'disputed', ref: 'Some narrative details vary between classical sources', note: 'Disputed elements' }
    ],
    certainty: 'established',
    tags: ['umayyad', 'karbala', 'husayn', 'ashura', 'martyrdom'],
    dayOfYear: 10
  },
  {
    id: 'conquest-of-constantinople',
    type: 'event', collection: 'events', era: 'ottoman',
    title: 'The Ottoman Conquest of Constantinople',
    subtitle: 'Mehmed II fulfils a prophecy — the Byzantine Empire ends',
    date: { hijri: 'Jumada al-Awwal 857 AH', gregorian: '29 May 1453 CE' },
    startDate: 1453, endDate: null,
    location: 'Constantinople (Istanbul)',
    summary: 'At 21, Ottoman Sultan Mehmed II conquered Constantinople after a 53-day siege, ending the Byzantine Empire and fulfilling a hadith that praised the future commander of this conquest. The city became the Ottoman capital and was transformed by the construction of mosques, colleges, and the Topkapi Palace.',
    details: 'Mehmed used massive cannon including the Basilica cannon to breach the Theodosian Walls. The hadith praising the conquest\'s commander (Musnad Ahmad, 18957) has been cited by Muslim scholars for centuries as applying to Mehmed, though the chain is graded hasan with some discussion. The Hagia Sophia was converted to a mosque. Mehmed allowed the Christian and Jewish populations to remain.',
    people: ['mehmed-ii'],
    relatedEvents: ['ottoman-empire'],
    relatedPlaces: ['istanbul'],
    topics: ['ottoman', 'conquest', 'architecture', 'caliphate'],
    sources: [
      { type: 'hadith', ref: 'Musnad Ahmad, 18957', note: 'Graded hasan; praised the commander of the conquest of Constantinople' },
      { type: 'academic', ref: 'Roger Crowley, 1453 (2005)' },
      { type: 'academic', ref: 'Steven Runciman, The Fall of Constantinople 1453 (1965)' }
    ],
    certainty: 'established',
    tags: ['ottoman', 'istanbul', 'mehmed', 'conquest', 'byzantines'],
    dayOfYear: 149
  },
  {
    id: 'mongol-sack-of-baghdad',
    type: 'event', collection: 'events', era: 'abbasid',
    title: 'The Mongol Sack of Baghdad',
    subtitle: 'The destruction of the Abbasid Caliphate — 1258 CE',
    date: { hijri: 'Safar 656 AH', gregorian: 'February 1258 CE' },
    startDate: 1258, endDate: null,
    location: 'Baghdad, modern Iraq',
    summary: 'Hulagu Khan\'s Mongol army sacked Baghdad, executing the Abbasid Caliph and devastating the intellectual capital of the Islamic world. Libraries were destroyed, canals wrecked, and hundreds of thousands killed. One of the most catastrophic events in Islamic history — yet Islam survived and the Mongols themselves converted within a generation.',
    details: 'Death toll estimates in classical sources range widely and are considered exaggerated by modern historians. The Mongol assault effectively ended the Abbasid Caliphate as a political power. A shadow caliphate continued in Cairo under the Mamluks. The Mongols who settled in the Middle East converted to Islam within decades.',
    people: ['hulagu-khan', 'al-mustasim'],
    relatedEvents: ['abbasid-caliphate', 'mamluk-dynasty'],
    relatedPlaces: ['baghdad'],
    topics: ['abbasid', 'destruction', 'caliphate', 'mongols'],
    sources: [
      { type: 'classical', ref: 'Ibn Kathir, Al-Bidaya wal-Nihaya' },
      { type: 'academic', ref: 'David Morgan, The Mongols (1986)' },
      { type: 'disputed', ref: 'Death toll figures (90,000–800,000) are disputed by modern historians', note: 'Numbers disputed' }
    ],
    certainty: 'established',
    tags: ['abbasid', 'baghdad', 'mongols', 'destruction', 'caliphate'],
    dayOfYear: 40
  },
  {
    id: 'salahuddin-jerusalem',
    type: 'event', collection: 'events', era: 'abbasid',
    title: 'Salahuddin Recaptures Jerusalem',
    subtitle: 'Victory with mercy — 2 October 1187 CE',
    date: { hijri: '27 Rajab 583 AH', gregorian: '2 October 1187 CE' },
    startDate: 1187, endDate: null,
    location: 'Jerusalem (al-Quds)',
    summary: 'Salahuddin Ayyubi recaptured Jerusalem from Crusader rule after the Battle of Hattin. Unlike the Crusader conquest of 1099, he entered peacefully, granted safety to Christians and Jews, and restored Muslim and Jewish access to their holy sites.',
    details: 'Salahuddin\'s conduct on entering Jerusalem — protecting churches, allowing the population to ransom themselves, and immediately restoring the al-Aqsa Mosque — was noted by both Muslim and Christian contemporaries. The contrast with the Crusaders\' massacre of 1099 was stark.',
    people: ['salahuddin-ayyubi'],
    relatedEvents: ['crusades', 'battle-of-hattin'],
    relatedPlaces: ['jerusalem', 'damascus'],
    topics: ['ayyubid', 'jerusalem', 'crusades', 'mercy'],
    sources: [
      { type: 'classical', ref: 'Ibn Shaddad, Al-Nawadir al-Sultaniyya', note: 'Primary biography by Salahuddin\'s secretary' },
      { type: 'academic', ref: 'Anne-Marie Eddé, Saladin (English trans. 2014)' }
    ],
    certainty: 'established',
    tags: ['ayyubid', 'salahuddin', 'jerusalem', 'crusades', 'mercy'],
    dayOfYear: 275
  },
  {
    id: 'fall-of-granada',
    type: 'event', collection: 'events', era: 'umayyad',
    title: 'The Fall of Granada',
    subtitle: 'End of 800 years of Islamic civilization in Europe',
    date: { hijri: 'Rabi\' al-Awwal 897 AH', gregorian: '2 January 1492 CE' },
    startDate: 1492, endDate: null,
    location: 'Granada, Spain',
    summary: 'Sultan Muhammad XII surrendered Granada — the last Muslim kingdom in the Iberian Peninsula — to Ferdinand and Isabella, ending nearly 800 years of Muslim presence in al-Andalus. The Alhambra palace remains as an enduring monument to Islamic civilization in Europe.',
    details: 'The terms of surrender initially promised religious freedom; within a decade these were broken and Muslims faced forced conversion or expulsion. The Alhambra and the Great Mosque of Córdoba survive as architectural testimony to al-Andalus.',
    people: ['muhammad-xii-boabdil'],
    relatedEvents: ['andalus', 'umayyad-caliphate'],
    relatedPlaces: ['granada', 'cordoba'],
    topics: ['andalus', 'spain', 'end', 'reconquista'],
    sources: [
      { type: 'academic', ref: 'L.P. Harvey, Islamic Spain, 1250–1500 (1990)' },
      { type: 'academic', ref: 'Hugh Kennedy, Muslim Spain and Portugal (1996)' }
    ],
    certainty: 'established',
    tags: ['andalus', 'granada', 'spain', 'end', 'alhambra'],
    dayOfYear: 2
  }
]);

/* ══════════════════════════════════════════════════════════
   HELPER FUNCTIONS
   Full backwards-compatible API for explore.js and home.js
   ══════════════════════════════════════════════════════════ */

/** Return ALL items as a flat array across every collection */
H.getAll = function() {
  return [].concat(
    H.events,
    H.people,
    H.prophets,
    H.companions,
    H.scholars,
    H.dynasties,
    H.civilizations,
    H.places
  );
};

/** Find item by id across all collections */
H.findById = function(id) {
  return H.getAll().find(function(item) { return item.id === id; }) || null;
};

/** Filter by era */
H.filterByEra = function(era) {
  return H.getAll().filter(function(item) { return item.era === era; });
};

/** Filter by type */
H.filterByType = function(type) {
  return H.getAll().filter(function(item) { return item.type === type; });
};

/** Filter by collection */
H.filterByCollection = function(collection) {
  return H.getAll().filter(function(item) { return item.collection === collection; });
};

/** Full-text search across titles, summaries, tags, details */
H.search = function(query) {
  if (!query || !query.trim()) return H.getAll();
  var q = query.toLowerCase().trim();
  return H.getAll().filter(function(item) {
    var hay = [
      item.title, item.subtitle, item.summary, item.details,
      (item.tags || []).join(' '), (item.topics || []).join(' ')
    ].filter(Boolean).join(' ').toLowerCase();
    return hay.indexOf(q) > -1;
  });
};

/** Get era CSS class */
H.eraClass = function(era) {
  var meta = H.ERAS[era];
  return (meta && meta.cssClass) ? meta.cssClass : 'era-modern';
};

/** Get source type label */
H.sourceTypeLabel = function(type) {
  var map = {
    quran: 'Quran', hadith: 'Hadith',
    classical: 'Classical Source', academic: 'Academic',
    disputed: 'Disputed'
  };
  return map[type] || type;
};

/** Get evidence badge CSS class */
H.evClass = function(type) {
  var map = {
    quran: 'ev-quran', hadith: 'ev-hadith',
    classical: 'ev-classical', academic: 'ev-academic',
    disputed: 'ev-disputed'
  };
  return map[type] || 'ev-academic';
};

/** Get certainty badge CSS class */
H.certClass = function(certainty) {
  var map = {
    established: 'cert-established',
    probable: 'cert-probable',
    disputed: 'cert-disputed'
  };
  return map[certainty] || 'cert-probable';
};

/**
 * Get "This Day in Islamic History" entry.
 * Tries dayOfYear match first, then falls back to modulo rotation
 * across all events. Prioritises seerah and established entries.
 */
H.getTodayEntry = function() {
  var now   = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var doy   = Math.floor((now - start) / 86400000);

  /* 1. Exact dayOfYear match */
  var exact = H.events.find(function(e) { return e.dayOfYear === doy; });
  if (exact) return exact;

  /* 2. Modulo rotation — prefer seerah and established */
  var pool = H.events.filter(function(e) {
    return e.certainty === 'established';
  });
  if (!pool.length) pool = H.events;
  return pool[doy % pool.length] || H.events[0];
};

/** Get previous and next eras for navigation */
H.getAdjacentEras = function(era) {
  var meta = H.ERAS[era];
  if (!meta) return { prev: null, next: null };
  return {
    prev: meta.prev ? { id: meta.prev, label: H.ERAS[meta.prev].label } : null,
    next: meta.next ? { id: meta.next, label: H.ERAS[meta.next].label } : null
  };
};

/** Get all items for a given era, sorted by startDate */
H.getEraItems = function(era) {
  return H.getAll()
    .filter(function(item) { return item.era === era; })
    .sort(function(a, b) { return (a.startDate || 0) - (b.startDate || 0); });
};

/** Sort any array of items by startDate ascending */
H.sortByDate = function(items) {
  return items.slice().sort(function(a, b) {
    return (a.startDate || 0) - (b.startDate || 0);
  });
};

/** Get statistics summary */
H.getStats = function() {
  return {
    events:        H.events.length,
    prophets:      H.prophets.length,
    companions:    H.companions.length,
    scholars:      H.scholars.length,
    dynasties:     H.dynasties.length,
    civilizations: H.civilizations.length,
    places:        H.places.length,
    total:         H.getAll().length
  };
};
