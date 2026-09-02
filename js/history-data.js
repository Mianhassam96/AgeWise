'use strict';
/* ═══════════════════════════════════════════════
   WaqtX V2 — Islamic History Data
   Structured knowledge base with source attribution
   and evidence certainty levels.

   Schema per entry:
   {
     id, type, era, title, subtitle,
     date: { hijri, gregorian },
     location,
     summary, details,
     people[], relatedEvents[], relatedPlaces[],
     sources: [{ type, ref, note }],
     certainty,   // established | probable | disputed
     tags[],
     dayOfYear    // 1–365 for "This Day" matching
   }

   Source types:
     quran     — direct Quranic reference
     hadith    — referenced hadith with grading
     classical — classical Muslim scholarly source
     academic  — modern historical scholarship
     disputed  — multiple conflicting accounts exist

   Certainty levels:
     established — Quran and/or mutawatir hadith
     probable    — well-attested classical sources
     disputed    — conflicting historical accounts
   ═══════════════════════════════════════════════ */

window.WAQTX_HISTORY = window.WAQTX_HISTORY || {};

/* ══════════════════════════════════════
   EVENTS
   ══════════════════════════════════════ */
WAQTX_HISTORY.events = [
  {
    id: 'birth-of-prophet',
    type: 'event',
    era: 'seerah',
    title: 'Birth of the Prophet Muhammad ﷺ',
    subtitle: 'The beginning of the most consequential life in history',
    date: { hijri: '53 BH (Before Hijrah)', gregorian: 'c. 570 CE' },
    location: 'Makkah, Arabian Peninsula',
    summary: 'Muhammad ibn Abdullah ﷺ was born in Makkah into the Banu Hashim clan of the Quraysh tribe. His father Abdullah had died before his birth, and his mother Aminah passed away when he was six years old. He was subsequently raised by his grandfather Abd al-Muttalib, and then by his uncle Abu Talib.',
    details: 'The exact date of the Prophet\'s birth is a matter of scholarly discussion. The traditional date of 12 Rabi\' al-Awwal is followed by many Muslims, though some classical scholars placed it on other dates within the same month. The year itself, often associated with the Year of the Elephant (\'Am al-Fil), is generally accepted as approximately 570 CE, though some modern academic historians place it slightly earlier. His early life was marked by personal loss and simplicity — qualities that would shape his later character.',
    people: ['muhammad-pbuh', 'aminah-bint-wahb', 'abd-al-muttalib', 'abu-talib'],
    relatedEvents: ['first-revelation', 'year-of-elephant'],
    relatedPlaces: ['makkah'],
    sources: [
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah (abridgement of Ibn Ishaq)', note: 'Primary classical biography, compiled 2nd century AH' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 1', note: 'Detailed early biography' },
      { type: 'academic', ref: 'W. Montgomery Watt, Muhammad at Mecca (1953)', note: 'Landmark academic study' },
      { type: 'academic', ref: 'Martin Lings, Muhammad: His Life Based on the Earliest Sources (1983)', note: 'Widely respected narrative biography' }
    ],
    certainty: 'probable',
    tags: ['seerah', 'makkah', 'birth', 'prophet'],
    dayOfYear: null
  },
  {
    id: 'year-of-elephant',
    type: 'event',
    era: 'seerah',
    title: 'The Year of the Elephant',
    subtitle: 'Abraha\'s army turned back from Makkah',
    date: { hijri: '53 BH', gregorian: 'c. 570 CE' },
    location: 'Near Makkah',
    summary: 'Abraha al-Ashram, a ruler from Yemen (then an Aksumite vassal), led a large army including war elephants toward Makkah, reportedly intending to destroy the Kaaba. According to Islamic tradition and the Quranic account, the army was repelled by flocks of birds (ababil) that pelted them with stones.',
    details: 'The Quran refers to this event directly in Surah Al-Fil (Chapter 105). The historical details beyond the Quranic account — including the exact political motivations and precise sequence of events — are drawn primarily from classical Islamic sources. Some academic historians have noted that the expedition of Abraha against Arabia is also referenced in South Arabian inscriptions, giving the general historical campaign some external corroboration, though the miraculous details are a matter of faith.',
    people: ['abraha'],
    relatedEvents: ['birth-of-prophet'],
    relatedPlaces: ['makkah', 'kaaba'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Fil, 105:1–5', note: 'Direct Quranic account' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Narrative account' },
      { type: 'academic', ref: 'Christian Robin, "Arabia and Ethiopia" in The Oxford Handbook of Late Antiquity (2012)', note: 'Historical context of Abraha\'s campaigns in South Arabian inscriptions' }
    ],
    certainty: 'established',
    tags: ['seerah', 'makkah', 'kaaba', 'quran'],
    dayOfYear: null
  },
  {
    id: 'first-revelation',
    type: 'event',
    era: 'seerah',
    title: 'The First Revelation',
    subtitle: 'Iqra — the word that changed the world',
    date: { hijri: '13 BH', gregorian: 'c. 610 CE' },
    location: 'Cave of Hira, near Makkah',
    summary: 'At the age of approximately 40, while in spiritual retreat in the Cave of Hira on the mountain of Jabal al-Nour, the Prophet Muhammad ﷺ received the first revelation of the Quran through the angel Jibreel (Gabriel). The first words revealed were: "Read in the name of your Lord who created."',
    details: 'The first revelation is described in detail in classical sources. The Prophet ﷺ returned to Khadijah deeply shaken and said "Cover me, cover me." She comforted him and took him to her cousin Waraqah ibn Nawfal, who recognized the revelation as the same that had been given to Musa (Moses). The classical accounts are consistent in their main outline. The month of Ramadan is identified in the Quran itself as the month the Quran began to be revealed.',
    people: ['muhammad-pbuh', 'khadijah-bint-khuwaylid', 'jibreel', 'waraqah-ibn-nawfal'],
    relatedEvents: ['birth-of-prophet', 'beginning-of-dawah', 'night-of-power'],
    relatedPlaces: ['cave-of-hira', 'makkah'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Alaq 96:1–5', note: 'First verses revealed' },
      { type: 'quran', ref: 'Surah Al-Baqarah 2:185', note: 'Ramadan identified as month of revelation' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Hadith 3, Kitab Bad\' al-Wahy', note: 'Detailed narration of the first revelation by Aisha (RA), graded sahih (authentic)' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Narrative account' }
    ],
    certainty: 'established',
    tags: ['seerah', 'quran', 'revelation', 'hira', 'makkah', 'ramadan'],
    dayOfYear: null
  },
  {
    id: 'hijrah',
    type: 'event',
    era: 'seerah',
    title: 'The Hijrah',
    subtitle: 'The migration that marked the beginning of the Islamic calendar',
    date: { hijri: '1 AH', gregorian: '622 CE' },
    location: 'Makkah to Madinah',
    summary: 'Facing increasing persecution in Makkah, the Prophet Muhammad ﷺ and his companion Abu Bakr al-Siddiq migrated to Madinah (then Yathrib), having sent the other Muslims ahead. This migration — the Hijrah — became so significant that Umar ibn al-Khattab later established it as the starting point of the Islamic lunar calendar.',
    details: 'The Hijrah took place after the Quraysh learned of the plan and tried to prevent the Prophet\'s departure. The Prophet ﷺ and Abu Bakr hid in the Cave of Thawr for three days before making the journey. The Quran refers to this moment directly. Upon arrival in Madinah, the Prophet ﷺ established the first mosque and created the Constitution of Madinah, a foundational civic document establishing rights and responsibilities for the Muslim and non-Muslim communities of the city.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'ali-ibn-abi-talib', 'aisha-bint-abi-bakr'],
    relatedEvents: ['first-revelation', 'battle-of-badr', 'constitution-of-madinah'],
    relatedPlaces: ['makkah', 'madinah', 'cave-of-thawr'],
    sources: [
      { type: 'quran', ref: 'Surah At-Tawbah 9:40', note: 'Cave of Thawr — "the second of two when they were in the cave"' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Manaqib', note: 'Multiple narrations of the Hijrah, graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Primary narrative source' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir', note: 'Supporting biographical detail' },
      { type: 'academic', ref: 'W. Montgomery Watt, Muhammad at Medina (1956)', note: 'Academic analysis of the Medinan period' }
    ],
    certainty: 'established',
    tags: ['seerah', 'hijrah', 'makkah', 'madinah', 'calendar', 'abu-bakr'],
    dayOfYear: 245
  },
  {
    id: 'battle-of-badr',
    type: 'event',
    era: 'seerah',
    title: 'The Battle of Badr',
    subtitle: 'The first major battle of Islam — the day of distinction',
    date: { hijri: '2 AH', gregorian: '624 CE' },
    location: 'Badr, 130km southwest of Madinah',
    summary: 'The Battle of Badr was the first significant armed engagement between the early Muslim community and the Quraysh of Makkah. A Muslim force of approximately 313 men faced a Quraysh army of around 1,000. The Muslims won a decisive victory. The Quran refers to this day as "Yawm al-Furqan" — the Day of Distinction.',
    details: 'The engagement began when the Quraysh sent a large force to intercept a Muslim raid on a caravan. The Quran addresses this battle in detail in Surah Al-Anfal. The victory was significant not only militarily but symbolically — it demonstrated to both Muslims and their opponents that the Muslim community could defend itself and was a force to be reckoned with. Several prominent Quraysh leaders were killed. The Quran mentions divine assistance at Badr.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'umar-ibn-al-khattab', 'ali-ibn-abi-talib', 'abu-jahl'],
    relatedEvents: ['hijrah', 'battle-of-uhud'],
    relatedPlaces: ['badr', 'madinah', 'makkah'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Anfal 8:5–19, 41–44', note: 'Extensive Quranic account of Badr' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Maghazi', note: 'Multiple detailed narrations, graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Primary narrative' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)', note: 'Historical context' }
    ],
    certainty: 'established',
    tags: ['seerah', 'battle', 'badr', 'quraysh', 'victory'],
    dayOfYear: null
  },
  {
    id: 'farewell-pilgrimage',
    type: 'event',
    era: 'seerah',
    title: 'The Farewell Pilgrimage',
    subtitle: 'The Prophet\'s final Hajj and the completion of the religion',
    date: { hijri: '10 AH', gregorian: '632 CE' },
    location: 'Makkah — Arafat — Mina',
    summary: 'In the tenth year after Hijrah, the Prophet Muhammad ﷺ performed his first and only Hajj. On the plain of Arafat, he delivered the Farewell Sermon — one of the most important speeches in Islamic history. The Quran was completed with the revelation of the verse: "Today I have perfected your religion for you."',
    details: 'The Farewell Sermon addressed fundamental principles: the inviolability of life, property and honor; the equality of all people regardless of race or origin; the rights of women; the prohibition of usury; the authority of the Quran and Sunnah. Different narrations preserve slightly different wordings of parts of the sermon, though the core themes are consistent across sources. The verse of Surah Al-Ma\'idah 5:3 was revealed during this occasion according to multiple hadith.',
    people: ['muhammad-pbuh'],
    relatedEvents: ['conquest-of-makkah', 'death-of-prophet'],
    relatedPlaces: ['makkah', 'arafat', 'mina', 'kaaba'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Ma\'idah 5:3', note: '"Today I have perfected your religion for you" — revealed at Arafat' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Hajj; Sahih Muslim, Kitab al-Hajj', note: 'Multiple narrations of the Farewell Sermon, graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Extended narrative account' }
    ],
    certainty: 'established',
    tags: ['seerah', 'hajj', 'makkah', 'sermon', 'completion'],
    dayOfYear: null
  },
  {
    id: 'death-of-prophet',
    type: 'event',
    era: 'seerah',
    title: 'Passing of the Prophet Muhammad ﷺ',
    subtitle: 'The end of prophethood — the beginning of the Ummah\'s responsibility',
    date: { hijri: '11 AH', gregorian: '632 CE' },
    location: 'Madinah',
    summary: 'The Prophet Muhammad ﷺ passed away in Madinah on 12 Rabi\' al-Awwal, 11 AH, in the house of his wife Aisha (RA). He was approximately 63 years old. His final days were spent in illness. Abu Bakr al-Siddiq announced his death to the community, reciting the verse: "Muhammad is not but a messenger; messengers have passed on before him."',
    details: 'The passing of the Prophet ﷺ was profoundly difficult for the Muslim community. Umar ibn al-Khattab initially refused to believe it until Abu Bakr reminded the community of Surah Al-Imran 3:144. The Prophet was buried in the house of Aisha, which later became incorporated into the Masjid al-Nabawi. The community then faced the immediate question of leadership, resolved in the Saqifah discussions.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'umar-ibn-al-khattab', 'aisha-bint-abi-bakr', 'ali-ibn-abi-talib'],
    relatedEvents: ['farewell-pilgrimage', 'caliphate-abu-bakr', 'compilation-of-quran'],
    relatedPlaces: ['madinah', 'masjid-al-nabawi'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Imran 3:144', note: 'Verse recited by Abu Bakr on announcing the Prophet\'s death' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Maghazi and Kitab al-Jana\'iz', note: 'Multiple narrations, graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Detailed account of final days' }
    ],
    certainty: 'established',
    tags: ['seerah', 'prophet', 'madinah', 'passing', 'abu-bakr'],
    dayOfYear: null
  },
  {
    id: 'caliphate-abu-bakr',
    type: 'event',
    era: 'rashidun',
    title: 'Caliphate of Abu Bakr al-Siddiq',
    subtitle: 'The first caliph — consolidating the Ummah',
    date: { hijri: '11–13 AH', gregorian: '632–634 CE' },
    location: 'Madinah',
    summary: 'Abu Bakr al-Siddiq became the first Caliph of Islam after the Prophet\'s passing. His short two-year caliphate was marked by the Wars of Riddah (apostasy wars), the consolidation of Muslim Arabia, and the beginning of the systematic compilation of the Quran. He dispatched armies into Persia and the Byzantine Levant.',
    details: 'Abu Bakr\'s selection as Caliph took place at the Saqifah of Banu Sa\'idah, in discussions among the Ansar and Muhajirun. The historical accounts of exactly how this selection occurred differ in some classical sources and have been a point of theological discussion among different Muslim communities. The Wars of Riddah are well-documented and involved tribes who refused to pay zakat after the Prophet\'s death. The compilation initiative — gathering the Quran from written records and memorizers — was famously prompted by the deaths of many Quran memorizers at the Battle of Yamama.',
    people: ['abu-bakr-al-siddiq', 'umar-ibn-al-khattab', 'khalid-ibn-al-walid', 'zayd-ibn-thabit'],
    relatedEvents: ['death-of-prophet', 'wars-of-riddah', 'compilation-of-quran', 'caliphate-umar'],
    relatedPlaces: ['madinah'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Hudud (Wars of Riddah narratives)', note: 'Graded sahih' },
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk (History of the Prophets and Kings)', note: 'Primary classical historical source for the Rashidun period' },
      { type: 'academic', ref: 'Fred Donner, The Early Islamic Conquests (1981)', note: 'Academic analysis of early Muslim expansion' }
    ],
    certainty: 'probable',
    tags: ['rashidun', 'caliphate', 'abu-bakr', 'madinah', 'quran-compilation'],
    dayOfYear: null
  },
  {
    id: 'caliphate-umar',
    type: 'event',
    era: 'rashidun',
    title: 'Caliphate of Umar ibn al-Khattab',
    subtitle: 'The great administrator — Jerusalem, Persia, and Egypt',
    date: { hijri: '13–23 AH', gregorian: '634–644 CE' },
    location: 'Madinah (capital), with expansion across Persia, Levant, Egypt',
    summary: 'Umar ibn al-Khattab\'s ten-year caliphate saw the most rapid territorial expansion in early Islamic history. The Islamic state extended across Persia, the Levant (including Jerusalem), and Egypt. Umar was renowned for his justice, simple lifestyle, and administrative innovations including the diwan (state register) and the establishment of the Hijri calendar.',
    details: 'Major events under Umar include: the Battle of al-Qadisiyyah (defeating the Sasanian Persian Empire), the Battle of Yarmouk (defeating the Byzantine forces in Syria), the conquest of Jerusalem — where Umar entered personally and famously refused to pray inside the Church of the Holy Sepulchre to prevent it becoming a precedent for its conversion — and the conquest of Egypt under Amr ibn al-As. Umar was assassinated in 644 CE by a Persian slave named Abu Lu\'lu\'a.',
    people: ['umar-ibn-al-khattab', 'khalid-ibn-al-walid', 'amr-ibn-al-as', 'saad-ibn-abi-waqqas'],
    relatedEvents: ['caliphate-abu-bakr', 'battle-of-yarmouk', 'battle-of-qadisiyyah', 'caliphate-uthman'],
    relatedPlaces: ['madinah', 'jerusalem', 'ctesiphon', 'egypt'],
    sources: [
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk', note: 'Primary classical historical source' },
      { type: 'classical', ref: 'Al-Baladhuri, Futuh al-Buldan (Conquests of Lands)', note: 'Detailed account of the conquests' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)', note: 'Comprehensive academic history' },
      { type: 'academic', ref: 'Fred Donner, The Early Islamic Conquests (1981)' }
    ],
    certainty: 'probable',
    tags: ['rashidun', 'umar', 'caliphate', 'expansion', 'persia', 'jerusalem', 'egypt'],
    dayOfYear: null
  },
  {
    id: 'battle-of-yarmouk',
    type: 'event',
    era: 'rashidun',
    title: 'Battle of Yarmouk',
    subtitle: 'The battle that opened the Byzantine Levant to Islam',
    date: { hijri: '15 AH', gregorian: '636 CE' },
    location: 'Yarmouk River, modern Jordan/Syria border',
    summary: 'One of the most strategically significant battles of the early Islamic conquests. The Muslim army under Khalid ibn al-Walid defeated a much larger Byzantine force at the Yarmouk River, effectively ending Byzantine rule over Greater Syria. This paved the way for the Muslim conquest of Jerusalem, Damascus, and the rest of the Levant.',
    details: 'The exact size of the armies is disputed in sources, with classical Islamic sources often giving very large numbers that modern historians consider likely exaggerated. The battle lasted several days. The Byzantine defeat has been attributed to multiple factors including tactical brilliance, internal religious tensions within Byzantine forces, and regional disaffection with Byzantine rule. Khalid ibn al-Walid\'s role is well-attested, though Umar ibn al-Khattab had replaced him as commander with Abu Ubayda ibn al-Jarrah before the battle — the exact timing and circumstances of this command change vary in the sources.',
    people: ['khalid-ibn-al-walid', 'abu-ubayda-ibn-al-jarrah', 'umar-ibn-al-khattab'],
    relatedEvents: ['caliphate-umar', 'conquest-of-jerusalem'],
    relatedPlaces: ['yarmouk', 'damascus', 'jerusalem'],
    sources: [
      { type: 'classical', ref: 'Al-Tabari, Tarikh', note: 'Primary narrative source' },
      { type: 'classical', ref: 'Al-Waqidi, Kitab al-Maghazi', note: 'Early Islamic military history source, though his reliability is debated by hadith scholars' },
      { type: 'academic', ref: 'David Nicolle, Yarmuk 636 AD (1994)', note: 'Military history analysis' },
      { type: 'academic', ref: 'John Haldon, Byzantium at War (2002)', note: 'Byzantine perspective' }
    ],
    certainty: 'probable',
    tags: ['rashidun', 'battle', 'khalid', 'byzantines', 'syria', 'levant'],
    dayOfYear: null
  }
];

/* ══════════════════════════════════════
   PEOPLE
   ══════════════════════════════════════ */
WAQTX_HISTORY.people = [
  {
    id: 'abu-bakr-al-siddiq',
    type: 'person',
    era: 'rashidun',
    title: 'Abu Bakr al-Siddiq (RA)',
    subtitle: 'The Truthful — First Caliph of Islam',
    date: { hijri: 'c. 573–13 AH', gregorian: 'c. 573–634 CE' },
    location: 'Makkah, then Madinah',
    summary: 'Abu Bakr Abdullah ibn Abi Quhafa was the closest companion of the Prophet Muhammad ﷺ, the first adult male to accept Islam, and the first Caliph after the Prophet\'s passing. He was known for his unwavering faith, gentleness, and administrative ability. The Prophet ﷺ said of him: "If I were to take a khalil (intimate friend) from among my Ummah, I would have taken Abu Bakr."',
    details: 'Abu Bakr was one of the wealthiest merchants in Makkah who gave much of his wealth in the service of Islam, including purchasing enslaved Muslims like Bilal ibn Rabah to free them. He accompanied the Prophet on the Hijrah, hiding with him in the Cave of Thawr. His two-year caliphate saw the consolidation of the Arabian Peninsula and the beginning of the major conquests. The compilation of the Quran into a single manuscript was initiated under his caliphate.',
    people: ['muhammad-pbuh', 'umar-ibn-al-khattab', 'aisha-bint-abi-bakr'],
    relatedEvents: ['hijrah', 'death-of-prophet', 'caliphate-abu-bakr', 'wars-of-riddah'],
    relatedPlaces: ['makkah', 'madinah', 'cave-of-thawr'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Fada\'il al-Sahabah', note: 'Multiple narrations about Abu Bakr, graded sahih' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 3', note: 'Biographical entry' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)' }
    ],
    certainty: 'established',
    tags: ['companion', 'caliph', 'rashidun', 'sahabah', 'makkah', 'madinah'],
    dayOfYear: null
  },
  {
    id: 'umar-ibn-al-khattab',
    type: 'person',
    era: 'rashidun',
    title: 'Umar ibn al-Khattab (RA)',
    subtitle: 'Al-Faruq — The Distinguisher of Truth from Falsehood',
    date: { hijri: 'c. 584–23 AH', gregorian: 'c. 584–644 CE' },
    location: 'Makkah, then Madinah',
    summary: 'Umar ibn al-Khattab was one of the most influential figures in Islamic history. Initially a fierce opponent of the Prophet ﷺ, his conversion to Islam was considered a turning point for the Muslim community. As the second Caliph, he oversaw the greatest territorial expansion of the early Islamic state and was known for his austere lifestyle, strict justice, and administrative genius.',
    details: 'Umar\'s conversion is described in several classical sources — he had gone intending to harm the Prophet ﷺ but was moved upon hearing verses of the Quran being recited by his sister. As Caliph, he established the diwan (state register for distributing revenues), created the system of appointed governors, and established the Hijri calendar. He was known for personally walking the streets of Madinah at night to check on his people\'s welfare. He was assassinated by Abu Lu\'lu\'a al-Fayruz while leading the Fajr prayer.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'khalid-ibn-al-walid', 'ali-ibn-abi-talib'],
    relatedEvents: ['caliphate-umar', 'battle-of-yarmouk', 'battle-of-qadisiyyah'],
    relatedPlaces: ['makkah', 'madinah', 'jerusalem'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, multiple chapters; Sahih Muslim, Kitab Fada\'il al-Sahabah', note: 'Numerous authentic narrations' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 3', note: 'Extensive biographical account' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)' }
    ],
    certainty: 'established',
    tags: ['companion', 'caliph', 'rashidun', 'sahabah', 'madinah', 'conversion'],
    dayOfYear: null
  },
  {
    id: 'ali-ibn-abi-talib',
    type: 'person',
    era: 'rashidun',
    title: 'Ali ibn Abi Talib (RA)',
    subtitle: 'The Gate of Knowledge — Fourth Caliph and first Imam',
    date: { hijri: 'c. 600–40 AH', gregorian: 'c. 600–661 CE' },
    location: 'Makkah, then Madinah, then Kufa',
    summary: 'Ali ibn Abi Talib was the cousin and son-in-law of the Prophet Muhammad ﷺ, the husband of Fatimah al-Zahra (RA), and the father of Hasan and Husayn. He was among the first to accept Islam. He served as the fourth Caliph of the Rashidun and is deeply revered in both Sunni and Shia Islam, though his position holds distinct significance in each tradition.',
    details: 'Ali\'s caliphate (656–661 CE) was marked by the first civil wars within the Muslim community — the Battle of the Camel (involving Aisha, Talha, and Zubayr) and the Battle of Siffin (against Muawiyah ibn Abi Sufyan). These events are a matter of continuing historical and theological discussion. Ali is revered for his eloquence (the Nahj al-Balagha collects attributed sayings and letters), his profound knowledge, and his piety. His assassination in the mosque of Kufa by Abd al-Rahman ibn Muljam marked the end of the Rashidun Caliphate.',
    people: ['muhammad-pbuh', 'fatimah-al-zahra', 'hasan-ibn-ali', 'husayn-ibn-ali'],
    relatedEvents: ['hijrah', 'caliphate-ali', 'battle-of-siffin', 'death-of-prophet'],
    relatedPlaces: ['makkah', 'madinah', 'kufa'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Sahih Muslim — multiple chapters', note: 'Many narrations from and about Ali (RA)' },
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk', note: 'Primary historical source for his caliphate' },
      { type: 'classical', ref: 'Nahj al-Balagha (compiled by al-Sharif al-Radi, 4th century AH)', note: 'Collection of attributed sermons and letters — authenticity of individual pieces varies' },
      { type: 'academic', ref: 'Wilferd Madelung, The Succession to Muhammad (1997)', note: 'Detailed academic analysis of the succession question' }
    ],
    certainty: 'established',
    tags: ['companion', 'caliph', 'rashidun', 'ahl-al-bayt', 'madinah', 'kufa'],
    dayOfYear: null
  },
  {
    id: 'ibn-al-haytham',
    type: 'person',
    era: 'abbasid',
    title: 'Ibn al-Haytham (Alhazen)',
    subtitle: 'Father of modern optics and the scientific method',
    date: { hijri: 'c. 354–430 AH', gregorian: 'c. 965–1040 CE' },
    location: 'Basra (born), Cairo (worked)',
    summary: 'Abu Ali al-Hasan ibn al-Hasan ibn al-Haytham was a Muslim scholar from Basra who made foundational contributions to optics, mathematics, and scientific methodology. His major work, Kitab al-Manazir (Book of Optics), fundamentally advanced the understanding of vision and light — establishing that vision occurs when light enters the eye rather than rays emanating from the eye.',
    details: 'Ibn al-Haytham worked under Fatimid rule in Cairo, where he attempted to regulate the Nile flooding (feigning madness to avoid punishment when the project proved impossible). His Kitab al-Manazir was translated into Latin as De Aspectibus and deeply influenced later European scholars including Roger Bacon and Johannes Kepler. His systematic approach to experiment and observation is often cited as an early articulation of scientific method. His contributions to understanding camera obscura, perspective, and atmospheric refraction are well-documented and acknowledged by modern historians of science.',
    people: [],
    relatedEvents: ['abbasid-golden-age'],
    relatedPlaces: ['basra', 'cairo'],
    sources: [
      { type: 'academic', ref: 'A.I. Sabra, The Optics of Ibn al-Haytham, Books I-III (1989)', note: 'Definitive English translation and commentary' },
      { type: 'academic', ref: 'David Lindberg, Theories of Vision from al-Kindi to Kepler (1976)', note: 'Historical context of Islamic optics' },
      { type: 'academic', ref: 'Jim Al-Khalili, The House of Wisdom (2011)', note: 'Accessible account of Islamic Golden Age science' }
    ],
    certainty: 'established',
    tags: ['scholar', 'scientist', 'optics', 'mathematics', 'abbasid', 'egypt'],
    dayOfYear: null
  },
  {
    id: 'al-khwarizmi',
    type: 'person',
    era: 'abbasid',
    title: 'Muhammad ibn Musa al-Khwarizmi',
    subtitle: 'The father of algebra',
    date: { hijri: 'c. 164–232 AH', gregorian: 'c. 780–850 CE' },
    location: 'Khwarazm (modern Uzbekistan), Baghdad',
    summary: 'Al-Khwarizmi was a Muslim mathematician, astronomer, and scholar who worked at the House of Wisdom in Baghdad. His treatise Al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala (The Compendious Book on Calculation by Completion and Balancing) introduced algebra as a systematic mathematical discipline. The word "algebra" derives from "al-jabr" in his title. The word "algorithm" derives from the Latin transliteration of his name.',
    details: 'Al-Khwarizmi\'s work on Hindu-Arabic numerals — including the concept of zero — helped introduce this number system to the Islamic world and subsequently to Europe, transforming mathematics. His work on astronomy produced refined astronomical tables (zij). He also wrote on geography, producing a revised and corrected version of Ptolemy\'s Geography. His algebraic work focused on practical problems including land measurement, inheritance distribution, and commercial transactions.',
    people: [],
    relatedEvents: ['abbasid-golden-age', 'house-of-wisdom'],
    relatedPlaces: ['baghdad', 'khwarazm'],
    sources: [
      { type: 'academic', ref: 'Frederick Rosen, The Algebra of Mohammed ben Musa (1831)', note: 'Early English translation of Kitab al-jabr' },
      { type: 'academic', ref: 'Roshdi Rashed, The Development of Arabic Mathematics (1994)', note: 'Authoritative academic study' },
      { type: 'academic', ref: 'Jim Al-Khalili, The House of Wisdom (2011)' }
    ],
    certainty: 'established',
    tags: ['scholar', 'mathematician', 'algebra', 'abbasid', 'baghdad', 'house-of-wisdom'],
    dayOfYear: null
  },
  {
    id: 'ibn-sina',
    type: 'person',
    era: 'abbasid',
    title: 'Ibn Sina (Avicenna)',
    subtitle: 'The Prince of Physicians — master of medicine and philosophy',
    date: { hijri: 'c. 370–428 AH', gregorian: 'c. 980–1037 CE' },
    location: 'Bukhara (born), various courts across Persia',
    summary: 'Abu Ali al-Husayn ibn Sina was one of the most significant intellectuals of the Islamic Golden Age. His Canon of Medicine (Al-Qanun fi al-Tibb) became the standard medical text in both the Islamic world and Europe for centuries. His philosophical works engaged with Aristotle, Neoplatonism, and Islamic theology in ways that influenced both Islamic and European scholastic thought.',
    details: 'Ibn Sina was a prodigy who reportedly mastered the Quran by age 10 and was practicing medicine by 16. His Canon of Medicine systematized Greek, Indian, and Islamic medical knowledge and was translated into Latin, remaining a core medical textbook in European universities until the 17th century. His philosophical work, particularly the "flying man" thought experiment exploring self-awareness, influenced later European debates on consciousness. His theological-philosophical synthesis was challenged by al-Ghazali in his Incoherence of the Philosophers.',
    people: ['al-ghazali', 'ibn-rushd'],
    relatedEvents: ['abbasid-golden-age'],
    relatedPlaces: ['bukhara', 'isfahan'],
    sources: [
      { type: 'academic', ref: 'Lenn Goodman, Avicenna (1992)', note: 'Comprehensive intellectual biography' },
      { type: 'academic', ref: 'Seyyed Hossein Nasr, An Introduction to Islamic Cosmological Doctrines (1964)' },
      { type: 'academic', ref: 'Peter Adamson, Al-Kindi (2007) and Great Medieval Thinkers series' }
    ],
    certainty: 'established',
    tags: ['scholar', 'physician', 'philosopher', 'medicine', 'abbasid', 'persia'],
    dayOfYear: null
  },
  {
    id: 'ibn-khaldun',
    type: 'person',
    era: 'mamluk',
    title: 'Ibn Khaldun',
    subtitle: 'Founder of sociology and the philosophy of history',
    date: { hijri: 'c. 732–808 AH', gregorian: '1332–1406 CE' },
    location: 'Tunis (born), various courts of North Africa and al-Andalus, Cairo',
    summary: 'Abd al-Rahman ibn Muhammad ibn Khaldun was a North African Muslim historian, sociologist, and philosopher. His Muqaddimah (Prolegomena) is considered a founding work of historiography, sociology, economics, and demography. He developed the concept of asabiyyah (group solidarity/social cohesion) as a key driver of historical change and the rise and fall of civilizations.',
    details: 'The Muqaddimah was the introduction to his larger historical work, the Kitab al-Ibar (Book of Lessons). Ibn Khaldun\'s analysis of history was unprecedented in its systematic attempt to identify causes and patterns — examining economics, climate, social dynamics, and the life-cycles of dynasties and civilizations. He served at various courts in North Africa and Spain, and later as the Chief Maliki Judge in Egypt under the Mamluks. He famously met Timur (Tamerlane) outside Damascus in 1401. His work influenced later Western sociologists including Hegel and Toynbee.',
    people: [],
    relatedEvents: ['mamluk-dynasty', 'fall-of-granada'],
    relatedPlaces: ['tunis', 'cairo', 'granada'],
    sources: [
      { type: 'academic', ref: 'Franz Rosenthal, Ibn Khaldun: The Muqaddimah — An Introduction to History (1958)', note: 'Definitive English translation in 3 volumes' },
      { type: 'academic', ref: 'Robert Irwin, Ibn Khaldun: An Intellectual Biography (2018)', note: 'Modern scholarly biography' }
    ],
    certainty: 'established',
    tags: ['scholar', 'historian', 'sociologist', 'north-africa', 'egypt', 'mamluk', 'muqaddimah'],
    dayOfYear: null
  }
];

/* ══════════════════════════════════════
   DYNASTIES / ERAS
   ══════════════════════════════════════ */
WAQTX_HISTORY.dynasties = [
  {
    id: 'rashidun-caliphate',
    type: 'dynasty',
    era: 'rashidun',
    title: 'The Rashidun Caliphate',
    subtitle: 'The Rightly-Guided Caliphs — 632 to 661 CE',
    date: { hijri: '11–41 AH', gregorian: '632–661 CE' },
    location: 'Madinah (capital), expanding across Arabia, Levant, Persia, Egypt',
    summary: 'The Rashidun (Rightly-Guided) Caliphate was led by the four caliphs: Abu Bakr, Umar, Uthman, and Ali. It represented the first Islamic state and saw the religion spread from the Arabian Peninsula across a vast territory. The period is defined in Islamic tradition by its closeness to prophetic guidance and the personal piety of the caliphs.',
    details: 'The Rashidun period saw the compilation of the Quran into a single authoritative manuscript (under Abu Bakr, completed under Uthman), the establishment of the Hijri calendar (under Umar), and the standardization of the Quranic text (the Uthmanic codex). The period ended with the first civil war (fitna) within the Muslim community — the conflict between Ali and Muawiyah ibn Abi Sufyan — which led to Ali\'s assassination and the transfer of the caliphate to the Umayyad dynasty. The nature of these early disputes and their theological significance is understood differently in Sunni and Shia traditions.',
    people: ['abu-bakr-al-siddiq', 'umar-ibn-al-khattab', 'uthman-ibn-affan', 'ali-ibn-abi-talib'],
    relatedEvents: ['death-of-prophet', 'battle-of-yarmouk', 'battle-of-qadisiyyah', 'compilation-of-quran'],
    relatedPlaces: ['madinah', 'makkah', 'jerusalem', 'ctesiphon', 'kufa'],
    sources: [
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk', note: 'Primary classical source' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)', note: 'Standard academic overview' },
      { type: 'academic', ref: 'Wilferd Madelung, The Succession to Muhammad (1997)', note: 'Detailed analysis of the succession and early caliphate' }
    ],
    certainty: 'probable',
    tags: ['rashidun', 'caliphate', 'expansion', 'companions'],
    dayOfYear: null
  },
  {
    id: 'umayyad-caliphate',
    type: 'dynasty',
    era: 'umayyad',
    title: 'The Umayyad Caliphate',
    subtitle: 'The first Muslim dynasty — from Damascus to Andalus',
    date: { hijri: '41–132 AH', gregorian: '661–750 CE' },
    location: 'Damascus (capital), extending from Iberia to Central Asia',
    summary: 'The Umayyad Caliphate, founded by Muawiyah ibn Abi Sufyan, was the first hereditary Muslim dynasty. Based in Damascus, it oversaw the greatest territorial expansion of any state in history up to that point — reaching from Iberia (al-Andalus) in the west to the Indus Valley in the east. It ended with the Abbasid Revolution of 750 CE.',
    details: 'The Umayyad period is complex in Islamic historiography. It is associated with significant administrative and cultural achievements — including the construction of the Dome of the Rock in Jerusalem, the Great Mosque of Damascus, and the introduction of Arabic as the official administrative language. At the same time, classical Islamic scholars often critiqued Umayyad rulers for departing from the simplicity of earlier Islamic governance. The Umayyad period saw the tragedy of Karbala (680 CE) in which Husayn ibn Ali, grandson of the Prophet ﷺ, was killed along with his companions — an event of profound theological significance in Shia Islam and mourned by Muslims broadly.',
    people: ['muawiyah-ibn-abi-sufyan', 'husayn-ibn-ali', 'umar-ibn-abd-al-aziz', 'tariq-ibn-ziyad'],
    relatedEvents: ['battle-of-karbala', 'conquest-of-spain', 'dome-of-the-rock', 'abbasid-revolution'],
    relatedPlaces: ['damascus', 'jerusalem', 'cordoba', 'samarkand'],
    sources: [
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk', note: 'Primary classical source' },
      { type: 'academic', ref: 'G.R. Hawting, The First Dynasty of Islam: The Umayyad Caliphate AD 661-750 (1986)', note: 'Standard academic history' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)' }
    ],
    certainty: 'probable',
    tags: ['umayyad', 'caliphate', 'damascus', 'expansion', 'andalus', 'dynasty'],
    dayOfYear: null
  },
  {
    id: 'abbasid-caliphate',
    type: 'dynasty',
    era: 'abbasid',
    title: 'The Abbasid Caliphate',
    subtitle: 'The Islamic Golden Age — Baghdad, the House of Wisdom',
    date: { hijri: '132–656 AH', gregorian: '750–1258 CE' },
    location: 'Baghdad (capital)',
    summary: 'The Abbasid Caliphate, which overthrew the Umayyads in 750 CE, ruled for over 500 years from Baghdad. It is associated with the Islamic Golden Age — an extraordinary flourishing of science, mathematics, medicine, philosophy, literature, and art. The House of Wisdom (Bayt al-Hikma) in Baghdad became a major center of translation and scholarship.',
    details: 'The Abbasid caliphate at its height saw scholars from across the known world gather in Baghdad to translate, study, and advance knowledge in every field. The works of Aristotle, Galen, Euclid, and Ptolemy were translated into Arabic and built upon. Muslim scholars like al-Khwarizmi, Ibn Sina, al-Farabi, al-Razi, and al-Biruni made foundational contributions. The caliphate gradually weakened as regional powers gained autonomy; it was ultimately ended when the Mongols under Hulagu Khan sacked Baghdad in 1258 CE — one of the most catastrophic events in Islamic history.',
    people: ['harun-al-rashid', 'al-mamun', 'al-khwarizmi', 'ibn-sina', 'ibn-al-haytham', 'al-biruni'],
    relatedEvents: ['house-of-wisdom', 'mongol-sack-of-baghdad', 'abbasid-revolution'],
    relatedPlaces: ['baghdad', 'basra', 'bukhara', 'samarra'],
    sources: [
      { type: 'academic', ref: 'Hugh Kennedy, The Court of the Caliphs (2004)', note: 'Accessible history of Abbasid Baghdad' },
      { type: 'academic', ref: 'Jim Al-Khalili, The House of Wisdom (2011)', note: 'Islamic Golden Age science' },
      { type: 'academic', ref: 'Philip Hitti, History of the Arabs (1937/10th ed. 2002)', note: 'Classic comprehensive history' }
    ],
    certainty: 'established',
    tags: ['abbasid', 'caliphate', 'baghdad', 'golden-age', 'science', 'knowledge'],
    dayOfYear: null
  },
  {
    id: 'andalus',
    type: 'dynasty',
    era: 'umayyad',
    title: 'Islamic Spain (Al-Andalus)',
    subtitle: 'Eight centuries of Muslim civilization in Europe',
    date: { hijri: '92–897 AH', gregorian: '711–1492 CE' },
    location: 'Iberian Peninsula (modern Spain and Portugal)',
    summary: 'Al-Andalus was the name given to the parts of the Iberian Peninsula under Muslim rule, from the initial conquest in 711 CE to the fall of Granada in 1492 CE — nearly 800 years. At its peak, particularly under the Umayyad Emirate and Caliphate of Córdoba, it was one of the most culturally and intellectually advanced societies in Europe.',
    details: 'The Muslim conquest of Iberia began under the Umayyad general Tariq ibn Ziyad at the Battle of Guadalete in 711 CE. Córdoba became the largest and most sophisticated city in Western Europe during the 10th century — with an estimated population of 500,000, a functioning sewerage system, public libraries, and advanced hospitals. The convivencia (coexistence) of Muslims, Jews, and Christians, though not without tensions, produced a remarkable cultural flowering. The gradual Christian Reconquista reduced Muslim territory over centuries; Granada, the last Muslim kingdom, fell in January 1492 CE.',
    people: ['tariq-ibn-ziyad', 'abd-al-rahman-i', 'ibn-rushd', 'ibn-tufayl', 'maimonides'],
    relatedEvents: ['conquest-of-spain', 'battle-of-guadalete', 'fall-of-granada', 'caliphate-of-cordoba'],
    relatedPlaces: ['cordoba', 'granada', 'seville', 'toledo'],
    sources: [
      { type: 'academic', ref: 'Richard Fletcher, Moorish Spain (1992)', note: 'Accessible popular history' },
      { type: 'academic', ref: 'Hugh Kennedy, Muslim Spain and Portugal (1996)', note: 'Academic political history' },
      { type: 'academic', ref: 'Maria Menocal, The Ornament of the World (2002)', note: 'Cultural history of al-Andalus' },
      { type: 'disputed', ref: 'Note: The degree of inter-religious tolerance in al-Andalus is debated among modern historians — "convivencia" is both celebrated and critiqued as an idealized narrative', note: 'Contested historiographical concept' }
    ],
    certainty: 'probable',
    tags: ['andalus', 'spain', 'umayyad', 'cordoba', 'granada', 'civilization', 'europe'],
    dayOfYear: null
  },
  {
    id: 'ottoman-empire',
    type: 'dynasty',
    era: 'ottoman',
    title: 'The Ottoman Empire',
    subtitle: 'Six centuries of Islamic rule — from Anatolia to the gates of Vienna',
    date: { hijri: 'c. 700–1342 AH', gregorian: 'c. 1299–1924 CE' },
    location: 'Anatolia (core), extending across three continents at peak',
    summary: 'The Ottoman Empire was one of the longest-lasting and most powerful empires in history. At its height, it controlled southeast Europe, western Asia, and north Africa. Istanbul (Constantinople), conquered by Sultan Mehmed II in 1453 CE, served as its capital. The Ottoman sultans also held the title of Caliph from 1517 until the caliphate\'s abolition in 1924.',
    details: 'The Ottomans began as a small Anatolian principality and rapidly grew into a world empire. Key figures include Osman I (founder), Mehmed II (conqueror of Constantinople), Suleiman the Magnificent (peak of empire), and Selim I (who brought the caliphate title to the Ottomans). The conquest of Constantinople in 1453 ended the Byzantine Empire and was a transformative moment in world history. Ottoman architecture, law, administration, and art represent a major contribution to human civilization. The empire\'s decline from the 18th century onward — and the abolition of the caliphate in 1924 by Mustafa Kemal Ataturk — marked the end of an era for the Muslim world.',
    people: ['osman-i', 'mehmed-ii', 'suleiman-the-magnificent', 'selim-i'],
    relatedEvents: ['conquest-of-constantinople', 'abolition-of-caliphate'],
    relatedPlaces: ['istanbul', 'bursa', 'cairo', 'jerusalem', 'makkah'],
    sources: [
      { type: 'academic', ref: 'Colin Imber, The Ottoman Empire, 1300–1650 (2002)', note: 'Standard academic history' },
      { type: 'academic', ref: 'Caroline Finkel, Osman\'s Dream: The History of the Ottoman Empire (2005)', note: 'Comprehensive narrative history' },
      { type: 'academic', ref: 'Jason Goodwin, Lords of the Horizons (1998)', note: 'Accessible popular history' }
    ],
    certainty: 'established',
    tags: ['ottoman', 'turkey', 'istanbul', 'caliphate', 'empire', 'suleiman', 'mehmed'],
    dayOfYear: null
  }
];

/* ══════════════════════════════════════
   PLACES
   ══════════════════════════════════════ */
WAQTX_HISTORY.places = [
  {
    id: 'makkah',
    type: 'place',
    era: 'seerah',
    title: 'Makkah al-Mukarramah',
    subtitle: 'The holiest city in Islam — birthplace of the Prophet ﷺ',
    date: { hijri: 'Ancient', gregorian: 'Ancient' },
    location: 'Hejaz region, modern Saudi Arabia',
    summary: 'Makkah is the holiest city in Islam, the birthplace of the Prophet Muhammad ﷺ, and the location of the Masjid al-Haram and the Kaaba — the direction Muslims face in prayer and the destination of the annual Hajj pilgrimage.',
    details: 'The Kaaba, believed in Islamic tradition to have been originally built by Ibrahim (Abraham) and his son Ismail, stands at the center of the Masjid al-Haram. The Zamzam well, also within the mosque precincts, is associated with Hajar (Hagar) and Ismail. Makkah was the center of Arab trading culture before Islam. Non-Muslims are not permitted to enter Makkah.',
    people: ['muhammad-pbuh', 'ibrahim-pbuh', 'ismail-pbuh'],
    relatedEvents: ['birth-of-prophet', 'first-revelation', 'hijrah', 'conquest-of-makkah', 'farewell-pilgrimage'],
    relatedPlaces: ['kaaba', 'madinah', 'cave-of-hira'],
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
    type: 'place',
    era: 'seerah',
    title: 'Al-Madinah al-Munawwarah',
    subtitle: 'The illuminated city — home of the Prophet ﷺ after the Hijrah',
    date: { hijri: '1 AH onwards', gregorian: '622 CE onwards' },
    location: 'Hejaz region, modern Saudi Arabia',
    summary: 'Madinah (formerly Yathrib) became the political and spiritual capital of the early Muslim community after the Hijrah. The Prophet ﷺ is buried there in what is now the Masjid al-Nabawi (Prophet\'s Mosque). It is the second holiest city in Islam.',
    details: 'Upon arrival in Madinah, the Prophet ﷺ established the first mosque (built on the site now occupied by Masjid al-Nabawi) and drafted the Constitution of Madinah. The city served as the capital of the Islamic state for the Rashidun caliphate until Umar ibn al-Khattab, and later under Ali. The Prophet\'s mosque, greatly expanded over the centuries, attracts millions of visitors annually.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'umar-ibn-al-khattab', 'ali-ibn-abi-talib'],
    relatedEvents: ['hijrah', 'battle-of-badr', 'death-of-prophet'],
    relatedPlaces: ['makkah', 'masjid-al-nabawi'],
    sources: [
      { type: 'academic', ref: 'F.E. Peters, Muhammad and the Origins of Islam (1994)' },
      { type: 'academic', ref: 'W. Montgomery Watt, Muhammad at Medina (1956)' }
    ],
    certainty: 'established',
    tags: ['place', 'holy', 'prophet', 'mosque', 'hejaz'],
    dayOfYear: null
  },
  {
    id: 'baghdad',
    type: 'place',
    era: 'abbasid',
    title: 'Baghdad',
    subtitle: 'The City of Peace — capital of the Islamic Golden Age',
    date: { hijri: 'Founded 145 AH', gregorian: 'Founded 762 CE' },
    location: 'Modern Iraq, on the Tigris River',
    summary: 'Baghdad was founded by the Abbasid Caliph al-Mansur in 762 CE as a planned circular city called Madinat al-Salam (City of Peace). It rapidly became the largest city in the world and the intellectual capital of the Islamic Golden Age, home to the famous House of Wisdom.',
    details: 'At its peak in the 9th-10th centuries, Baghdad had a population estimated at 1-2 million and was the global center of scholarship, trade, and culture. The House of Wisdom gathered scholars who translated and advanced knowledge in mathematics, medicine, philosophy, astronomy, and literature. The city was catastrophically sacked by Mongol forces under Hulagu Khan in 1258 CE — one of the most destructive events in Islamic history. The Abbasid Caliph al-Musta\'sim was killed, and the city\'s libraries, canals, and population were largely destroyed.',
    people: ['al-mansur', 'harun-al-rashid', 'al-mamun', 'al-khwarizmi', 'ibn-al-haytham'],
    relatedEvents: ['abbasid-caliphate', 'house-of-wisdom', 'mongol-sack-of-baghdad'],
    relatedPlaces: ['basra', 'samarra', 'ctesiphon'],
    sources: [
      { type: 'academic', ref: 'Guy Le Strange, Baghdad During the Abbasid Caliphate (1900)', note: 'Classic historical geography' },
      { type: 'academic', ref: 'Hugh Kennedy, The Court of the Caliphs (2004)' },
      { type: 'academic', ref: 'Jim Al-Khalili, The House of Wisdom (2011)' }
    ],
    certainty: 'established',
    tags: ['place', 'abbasid', 'golden-age', 'knowledge', 'house-of-wisdom', 'iraq'],
    dayOfYear: null
  },
  {
    id: 'cordoba',
    type: 'place',
    era: 'umayyad',
    title: 'Córdoba (Qurtuba)',
    subtitle: 'The jewel of al-Andalus — Europe\'s most sophisticated medieval city',
    date: { hijri: 'Muslim rule: 92–368 AH', gregorian: 'Muslim rule: 711–978 CE as capital' },
    location: 'Southern Spain (Andalusia)',
    summary: 'Córdoba (Arabic: Qurtuba) was the capital of Islamic Spain and, at its 10th century peak, one of the largest and most sophisticated cities in the world. The Great Mosque of Córdoba (La Mezquita), begun under Abd al-Rahman I in 785 CE and expanded over centuries, stands as one of the finest examples of Islamic architecture.',
    details: 'Under Abd al-Rahman III (912-961 CE), who proclaimed himself Caliph in 929 CE, Córdoba reached its zenith with an estimated population of 500,000. The city had public baths, street lighting, paved roads, and a major library. It was a center of scholarship in medicine, philosophy, botany, and poetry. Scholars like Ibn Rushd (Averroes), Ibn Tufayl, and Maimonides (Jewish philosopher) lived and worked there. The caliphate collapsed in the early 11th century in a period called the taifa (party) kingdoms.',
    people: ['abd-al-rahman-i', 'abd-al-rahman-iii', 'ibn-rushd', 'ibn-tufayl'],
    relatedEvents: ['conquest-of-spain', 'caliphate-of-cordoba', 'fall-of-cordoba'],
    relatedPlaces: ['granada', 'seville', 'toledo'],
    sources: [
      { type: 'academic', ref: 'Richard Fletcher, Moorish Spain (1992)' },
      { type: 'academic', ref: 'Maria Menocal, The Ornament of the World (2002)' },
      { type: 'academic', ref: 'Hugh Kennedy, Muslim Spain and Portugal (1996)' }
    ],
    certainty: 'established',
    tags: ['place', 'andalus', 'spain', 'umayyad', 'civilization', 'mosque', 'europe'],
    dayOfYear: null
  }
];

/* ══════════════════════════════════════
   HELPER FUNCTIONS
   ══════════════════════════════════════ */

/** Return all items as a flat array */
WAQTX_HISTORY.getAll = function() {
  return [].concat(
    WAQTX_HISTORY.events,
    WAQTX_HISTORY.people,
    WAQTX_HISTORY.dynasties,
    WAQTX_HISTORY.places
  );
};

/** Find item by id across all categories */
WAQTX_HISTORY.findById = function(id) {
  return WAQTX_HISTORY.getAll().find(function(item) { return item.id === id; }) || null;
};

/** Filter by era */
WAQTX_HISTORY.filterByEra = function(era) {
  return WAQTX_HISTORY.getAll().filter(function(item) { return item.era === era; });
};

/** Filter by type */
WAQTX_HISTORY.filterByType = function(type) {
  return WAQTX_HISTORY.getAll().filter(function(item) { return item.type === type; });
};

/** Search across titles, summaries, tags */
WAQTX_HISTORY.search = function(query) {
  if (!query) return WAQTX_HISTORY.getAll();
  var q = query.toLowerCase();
  return WAQTX_HISTORY.getAll().filter(function(item) {
    return (item.title + ' ' + (item.subtitle||'') + ' ' + (item.summary||'') + ' ' +
            (item.tags||[]).join(' ')).toLowerCase().indexOf(q) > -1;
  });
};

/** Get era label */
WAQTX_HISTORY.ERA_LABELS = {
  seerah:    'Seerah',
  rashidun:  'Rashidun Era',
  umayyad:   'Umayyad Era',
  abbasid:   'Abbasid Era',
  ottoman:   'Ottoman Era',
  mamluk:    'Mamluk Era',
  scholars:  'Scholars & Scientists',
  modern:    'Modern Era'
};

/** Get CSS era class */
WAQTX_HISTORY.eraClass = function(era) {
  var map = {
    seerah:'era-seerah', rashidun:'era-rashidun', umayyad:'era-umayyad',
    abbasid:'era-abbasid', ottoman:'era-ottoman', mamluk:'era-abbasid',
    scholars:'era-scholars', modern:'era-modern'
  };
  return map[era] || 'era-modern';
};

/** Get source type label */
WAQTX_HISTORY.sourceTypeLabel = function(type) {
  var map = {
    quran:'Quran', hadith:'Hadith', classical:'Classical Source',
    academic:'Academic', disputed:'Disputed'
  };
  return map[type] || type;
};

/** Get evidence badge CSS class */
WAQTX_HISTORY.evClass = function(type) {
  var map = {
    quran:'ev-quran', hadith:'ev-hadith', classical:'ev-classical',
    academic:'ev-academic', disputed:'ev-disputed'
  };
  return map[type] || 'ev-academic';
};

/** Get certainty badge class */
WAQTX_HISTORY.certClass = function(certainty) {
  var map = { established:'cert-established', probable:'cert-probable', disputed:'cert-disputed' };
  return map[certainty] || 'cert-probable';
};

/* ══════════════════════════════════════
   PHASE 2 ADDITIONS — Events
   ══════════════════════════════════════ */
WAQTX_HISTORY.events.push(
  {
    id: 'caliphate-uthman',
    type: 'event',
    era: 'rashidun',
    title: 'Caliphate of Uthman ibn Affan',
    subtitle: 'The Quran standardised — the empire expanded',
    date: { hijri: '23–35 AH', gregorian: '644–656 CE' },
    location: 'Madinah',
    summary: 'Uthman ibn Affan, the third Caliph and son-in-law of the Prophet ﷺ, oversaw the most far-reaching achievement in Islamic textual history: the standardisation of the Quranic manuscript. Under his leadership, an authoritative text was compiled and copies sent to major cities. His caliphate also saw the Islamic state expand into North Africa, Cyprus, and Central Asia.',
    details: 'Uthman was selected as Caliph by a shura (consultative council) of six. His greatest legacy is the Uthmanic codex — establishing the single authoritative text of the Quran from the earlier compilation of Abu Bakr, and sending copies (masahif) to Kufa, Basra, Damascus, and Makkah, with the original retained in Madinah. His later years saw increasing internal dissent, and he was assassinated in 656 CE by rebels who had travelled from Egypt — a moment that precipitated the first fitna (civil strife) in the Muslim community.',
    people: ['uthman-ibn-affan', 'zayd-ibn-thabit', 'ali-ibn-abi-talib'],
    relatedEvents: ['caliphate-umar', 'caliphate-ali', 'compilation-of-quran'],
    relatedPlaces: ['madinah'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Fada\'il al-Quran', note: 'Narrations about the Quran compilation, graded sahih' },
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk', note: 'Primary historical source' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)' }
    ],
    certainty: 'probable',
    tags: ['rashidun', 'caliph', 'uthman', 'quran', 'madinah', 'compilation'],
    dayOfYear: 15
  },
  {
    id: 'battle-of-karbala',
    type: 'event',
    era: 'umayyad',
    title: 'The Battle of Karbala',
    subtitle: 'The martyrdom of Husayn ibn Ali — a day that shaped Islamic history',
    date: { hijri: '10 Muharram 61 AH', gregorian: '10 October 680 CE' },
    location: 'Karbala, modern Iraq',
    summary: 'On the 10th of Muharram (Ashura), Husayn ibn Ali — grandson of the Prophet Muhammad ﷺ and son of Ali ibn Abi Talib — was killed along with most of his male companions near Karbala by forces loyal to Yazid ibn Muawiyah. Husayn had refused to pledge allegiance to Yazid, whom he considered an unjust ruler. His death became the defining event of Shia Islam and is mourned annually as Ashura.',
    details: 'Husayn had left Madinah after refusing to give bay\'a (allegiance) to Yazid. He received letters from supporters in Kufa promising support, but when he arrived in Iraq with a small group of family and companions (around 72 fighters), the Kufan support failed to materialise. The Umayyad army surrounded them at Karbala and cut off their water supply. Husayn and the men with him were killed; the women and children were taken captive to Yazid\'s court in Damascus. The event is universally mourned in Islamic tradition, though its theological significance differs between Sunni and Shia Muslims. The classical sources for this event include both pro-Umayyad and pro-Alid perspectives.',
    people: ['husayn-ibn-ali', 'yazid-ibn-muawiyah', 'ali-ibn-abi-talib', 'zaynab-bint-ali'],
    relatedEvents: ['umayyad-caliphate', 'caliphate-ali', 'battle-of-siffin'],
    relatedPlaces: ['karbala', 'kufa', 'madinah', 'damascus'],
    sources: [
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk, Vol. 19', note: 'Most detailed classical account, drawn from Abu Mikhnaf (pro-Alid source) — reliability debated by some scholars' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir', note: 'Biographical detail' },
      { type: 'academic', ref: 'Heinz Halm, Shi\'a Islam: From Religion to Revolution (1997)', note: 'Academic analysis of the theological significance' },
      { type: 'disputed', ref: 'Note: Some narrative details about the number of letters from Kufa and exact troop numbers vary between classical sources', note: 'Disputed elements in classical accounts' }
    ],
    certainty: 'established',
    tags: ['umayyad', 'karbala', 'husayn', 'ashura', 'martyrdom', 'ahl-al-bayt', 'shia'],
    dayOfYear: 10
  },
  {
    id: 'conquest-of-makkah',
    type: 'event',
    era: 'seerah',
    title: 'The Opening of Makkah',
    subtitle: 'Victory without bloodshed — forgiveness at the peak of power',
    date: { hijri: 'Ramadan 8 AH', gregorian: 'January 630 CE' },
    location: 'Makkah',
    summary: 'Eight years after the Hijrah, the Prophet Muhammad ﷺ returned to Makkah with an army of ten thousand. The Quraysh offered little resistance. The Prophet ﷺ entered the city peacefully, went to the Kaaba, removed the idols, and declared a general amnesty — famously forgiving those who had persecuted him and his followers for over two decades.',
    details: 'The conquest of Makkah is one of the most celebrated events in Islamic history. The Prophet\'s declaration of amnesty — "Go, for you are free" — to the Quraysh leaders who had persecuted Muslims for years exemplified the Quranic injunction to repel evil with good. The Quran describes this as a "manifest victory." Bilal ibn Rabah, the freed Abyssinian slave, gave the adhan from the top of the Kaaba — one of history\'s most powerful symbolic moments. Abu Sufyan, who had led the opposition to Islam for years, accepted Islam on the day of the conquest.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'khalid-ibn-al-walid', 'bilal-ibn-rabah', 'abu-sufyan'],
    relatedEvents: ['hijrah', 'battle-of-badr', 'farewell-pilgrimage'],
    relatedPlaces: ['makkah', 'kaaba', 'madinah'],
    sources: [
      { type: 'quran', ref: 'Surah Al-Fath 48:1', note: '"Indeed We have granted you a manifest victory"' },
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab al-Maghazi', note: 'Multiple narrations, graded sahih' },
      { type: 'classical', ref: 'Ibn Hisham, Sirat Rasul Allah', note: 'Primary narrative account' }
    ],
    certainty: 'established',
    tags: ['seerah', 'makkah', 'victory', 'conquest', 'forgiveness', 'bilal', 'kaaba'],
    dayOfYear: 62
  },
  {
    id: 'mongol-sack-of-baghdad',
    type: 'event',
    era: 'abbasid',
    title: 'The Mongol Sack of Baghdad',
    subtitle: 'The destruction of the Abbasid Caliphate and the House of Wisdom',
    date: { hijri: 'Safar 656 AH', gregorian: 'February 1258 CE' },
    location: 'Baghdad, modern Iraq',
    summary: 'Hulagu Khan\'s Mongol army sacked Baghdad, executing the Abbasid Caliph al-Musta\'sim and devastating what had been the intellectual capital of the Islamic world for five centuries. The libraries of the House of Wisdom were destroyed, the canals of Mesopotamia were wrecked, and hundreds of thousands were killed. It was one of the most catastrophic events in Islamic history.',
    details: 'The Mongol assault on Baghdad lasted from January to February 1258. Classical sources describe the Tigris running black with the ink of destroyed books and red with blood. The exact death toll is disputed in classical and modern sources — figures ranging from 90,000 to 800,000 appear, and modern historians generally consider the highest numbers exaggerated. The event effectively ended the Abbasid Caliphate as a political power, though a puppet Abbasid caliphate continued in Cairo under the Mamluks. Islam itself survived: within a generation, the Mongols who settled in Persia and the Middle East converted to Islam, and the Ilkhanid state became a Muslim polity.',
    people: ['hulagu-khan', 'al-mustasim', 'ibn-al-alqami'],
    relatedEvents: ['abbasid-caliphate', 'house-of-wisdom', 'mamluk-dynasty'],
    relatedPlaces: ['baghdad'],
    sources: [
      { type: 'classical', ref: 'Ibn Kathir, Al-Bidaya wal-Nihaya (The Beginning and the End)', note: 'Major classical historical source' },
      { type: 'classical', ref: 'Ibn al-Athir, Al-Kamil fi al-Tarikh', note: 'Earlier classical source, contemporary to the events' },
      { type: 'academic', ref: 'David Morgan, The Mongols (1986)', note: 'Standard academic history' },
      { type: 'disputed', ref: 'Death toll figures (90,000–800,000) vary widely across sources and are debated by modern historians', note: 'Numbers disputed' }
    ],
    certainty: 'established',
    tags: ['abbasid', 'baghdad', 'mongols', 'destruction', 'caliphate', 'house-of-wisdom'],
    dayOfYear: 40
  },
  {
    id: 'conquest-of-constantinople',
    type: 'event',
    era: 'ottoman',
    title: 'The Ottoman Conquest of Constantinople',
    subtitle: 'Sultan Mehmed II fulfils a prophecy — the fall of the Byzantine Empire',
    date: { hijri: 'Jumada al-Awwal 857 AH', gregorian: '29 May 1453 CE' },
    location: 'Constantinople (Istanbul), modern Turkey',
    summary: 'At the age of 21, Ottoman Sultan Mehmed II conquered Constantinople — the capital of the Byzantine Empire for over a thousand years — after a 53-day siege. The Prophet Muhammad ﷺ had praised in hadith the commander who would conquer the city. The conquest ended the Byzantine Empire and marked the beginning of the Ottoman Empire\'s dominance of the eastern Mediterranean.',
    details: 'The conquest of Constantinople had been attempted by Muslim rulers multiple times since the Umayyad period. Mehmed II employed massive cannons (including the famous Basilica cannon, designed by a Hungarian engineer) to breach the Theodosian Walls — previously considered impregnable. After the conquest, Mehmed converted the Hagia Sophia into a mosque and declared himself "Kayser-i Rum" (Caesar of Rome). The Prophet\'s hadith praising the commander of this conquest — narrated in Musnad Ahmad — has been cited by Muslim scholars for centuries as fulfilled by Mehmed, though the hadith\'s chain is discussed in hadith science.',
    people: ['mehmed-ii', 'constantine-xi', 'khalid-ibn-al-walid'],
    relatedEvents: ['ottoman-empire', 'fall-of-constantinople'],
    relatedPlaces: ['istanbul', 'hagia-sophia'],
    sources: [
      { type: 'hadith', ref: 'Musnad Ahmad, 18957', note: '"Verily, Constantinople shall be conquered... What a wonderful commander its commander shall be, and what a wonderful army that army shall be" — graded hasan by most hadith scholars, though its chain is discussed' },
      { type: 'academic', ref: 'Roger Crowley, 1453: The Holy War for Constantinople (2005)', note: 'Accessible narrative history' },
      { type: 'academic', ref: 'Steven Runciman, The Fall of Constantinople 1453 (1965)', note: 'Classic academic study' }
    ],
    certainty: 'established',
    tags: ['ottoman', 'istanbul', 'mehmed', 'byzantines', 'conquest', 'hagia-sophia'],
    dayOfYear: 149
  },
  {
    id: 'salahuddin-jerusalem',
    type: 'event',
    era: 'abbasid',
    title: 'Salahuddin Recaptures Jerusalem',
    subtitle: 'Victory with mercy — the exemplary conduct of an Islamic ruler',
    date: { hijri: '27 Rajab 583 AH', gregorian: '2 October 1187 CE' },
    location: 'Jerusalem (al-Quds)',
    summary: 'Salahuddin Ayyubi (Saladin) recaptured Jerusalem from Crusader rule after 88 years, following his decisive victory at the Battle of Hattin. Unlike the Crusader conquest of 1099 — in which thousands of Muslims and Jews were massacred — Salahuddin entered peacefully, allowed Christian residents to ransom themselves, and protected the city\'s churches. His conduct became a byword for Islamic chivalry.',
    details: 'The Battle of Hattin (July 1187) had destroyed the main Crusader army. Jerusalem fell without significant resistance. The contrast between the Crusader conquest of 1099 (described in graphic terms by both Muslim and Christian sources) and Salahuddin\'s entry was noted by contemporaries. He allowed the Crusader garrison and civilian population to leave safely. Salahuddin restored the al-Aqsa Mosque to its function as a mosque, and reinstated Muslim and Jewish access to their holy sites. He is remembered by both Muslim and Western historians as one of the most honourable military commanders in medieval history.',
    people: ['salahuddin-ayyubi', 'guy-of-lusignan', 'reginald-of-chatillon'],
    relatedEvents: ['crusades', 'battle-of-hattin', 'ayyubid-dynasty'],
    relatedPlaces: ['jerusalem', 'damascus', 'egypt'],
    sources: [
      { type: 'classical', ref: 'Ibn Shaddad, Al-Nawadir al-Sultaniyya (biography of Salahuddin)', note: 'Written by Salahuddin\'s personal secretary and companion' },
      { type: 'classical', ref: 'Imad al-Din al-Isfahani, Al-Barq al-Shami', note: 'Contemporary account by a court secretary' },
      { type: 'academic', ref: 'Jonathan Phillips, Holy Warriors: A Modern History of the Crusades (2009)', note: 'Academic overview' },
      { type: 'academic', ref: 'Anne-Marie Eddé, Saladin (2011, English trans. 2014)', note: 'Major academic biography' }
    ],
    certainty: 'established',
    tags: ['ayyubid', 'salahuddin', 'jerusalem', 'crusades', 'mercy', 'al-aqsa'],
    dayOfYear: 275
  },
  {
    id: 'fall-of-granada',
    type: 'event',
    era: 'umayyad',
    title: 'The Fall of Granada',
    subtitle: 'The end of 800 years of Islamic civilization in Europe',
    date: { hijri: 'Rabi\' al-Awwal 897 AH', gregorian: '2 January 1492 CE' },
    location: 'Granada, modern Spain',
    summary: 'Sultan Muhammad XII (Boabdil) surrendered Granada — the last Muslim kingdom in the Iberian Peninsula — to Ferdinand and Isabella of Spain, ending nearly 800 years of Muslim presence in al-Andalus. It was the culmination of the Christian Reconquista and one of the most significant geopolitical shifts of the 15th century.',
    details: 'The fall of Granada in 1492 — the same year Columbus sailed to the Americas — marked the end of a long era. The Nasrid dynasty had ruled Granada since 1230, maintaining a sophisticated court culture. The terms of surrender initially promised religious freedom for Muslims; within a decade these promises were broken, and forced conversion or expulsion followed. The "Last Sigh of the Moor" — Boabdil allegedly weeping as he looked back at the Alhambra — is a famous story that appears in later Spanish chronicles, though its historicity is uncertain. The Alhambra palace remains one of the greatest examples of Islamic architecture in the world.',
    people: ['muhammad-xii-boabdil', 'ferdinand-ii-of-aragon', 'isabella-i-of-castile'],
    relatedEvents: ['andalus', 'umayyad-caliphate'],
    relatedPlaces: ['granada', 'cordoba', 'seville'],
    sources: [
      { type: 'academic', ref: 'L.P. Harvey, Islamic Spain, 1250–1500 (1990)', note: 'Standard academic history of late al-Andalus' },
      { type: 'academic', ref: 'Hugh Kennedy, Muslim Spain and Portugal (1996)' },
      { type: 'disputed', ref: 'The "Last Sigh" story appears in later chronicles; its historicity is uncertain', note: 'Famous but disputed detail' }
    ],
    certainty: 'established',
    tags: ['andalus', 'granada', 'spain', 'end', 'reconquista', 'alhambra'],
    dayOfYear: 2
  }
);

/* ══════════════════════════════════════
   PHASE 2 ADDITIONS — People
   ══════════════════════════════════════ */
WAQTX_HISTORY.people.push(
  {
    id: 'uthman-ibn-affan',
    type: 'person',
    era: 'rashidun',
    title: 'Uthman ibn Affan (RA)',
    subtitle: 'Dhul-Nurayn — The one with two lights. Third Caliph of Islam',
    date: { hijri: 'c. 576–35 AH', gregorian: 'c. 576–656 CE' },
    location: 'Makkah, then Madinah',
    summary: 'Uthman ibn Affan was among the earliest converts to Islam and married two daughters of the Prophet ﷺ (hence "Dhul-Nurayn" — possessor of two lights). He was known for his extraordinary generosity, equipping the Army of Hardship (Jaysh al-Usra) largely from his own wealth. As the third Caliph, his greatest achievement was the standardisation of the Quranic text.',
    details: 'Uthman financed the expansion of the Masjid al-Nabawi and purchased the well of Ruma to provide free water to the Muslim community in Madinah. His selection as Caliph followed a consultative process after Umar\'s assassination. The standardisation of the Quran under his supervision is considered one of the most consequential acts in Islamic history, ensuring a single authoritative text across the expanding Muslim world. His later caliphate was marked by growing dissent, partly over appointments of relatives to governorships. He was killed by rebels in 656 CE while reciting the Quran — a detail attested in multiple classical sources.',
    people: ['muhammad-pbuh', 'abu-bakr-al-siddiq', 'umar-ibn-al-khattab', 'ali-ibn-abi-talib', 'zayd-ibn-thabit'],
    relatedEvents: ['caliphate-uthman', 'compilation-of-quran', 'death-of-prophet'],
    relatedPlaces: ['makkah', 'madinah'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Fada\'il al-Sahabah and Kitab Fada\'il al-Quran', note: 'Multiple authentic narrations' },
      { type: 'classical', ref: 'Ibn Sa\'d, Kitab al-Tabaqat al-Kabir, Vol. 3', note: 'Primary biographical source' },
      { type: 'academic', ref: 'Hugh Kennedy, The Prophet and the Age of the Caliphates (1986)' }
    ],
    certainty: 'established',
    tags: ['companion', 'caliph', 'rashidun', 'quran', 'madinah', 'generosity'],
    dayOfYear: null
  },
  {
    id: 'husayn-ibn-ali',
    type: 'person',
    era: 'umayyad',
    title: 'Husayn ibn Ali (RA)',
    subtitle: 'Sayyid al-Shuhada — Grandson of the Prophet ﷺ, martyr of Karbala',
    date: { hijri: 'c. 4–61 AH', gregorian: 'c. 626–680 CE' },
    location: 'Madinah (born), Makkah, Karbala',
    summary: 'Husayn ibn Ali was the younger son of Ali ibn Abi Talib and Fatimah al-Zahra, and the grandson of the Prophet Muhammad ﷺ. The Prophet ﷺ said of him and his brother Hasan: "They are the masters of the youth of Paradise." His refusal to pledge allegiance to Yazid ibn Muawiyah, and his martyrdom at Karbala on 10 Muharram 61 AH, is one of the most profoundly significant events in Islamic history.',
    details: 'The Prophet ﷺ expressed deep love for Husayn, and multiple hadith attest to his status. His martyrdom at Karbala — surrounded and outnumbered, standing for what he saw as justice against an unjust ruler — is commemorated annually as Ashura. In Sunni Islam, Husayn is honoured as a grandson of the Prophet and a martyr; in Shia Islam, his martyrdom carries deep theological significance as the central act of sacrifice for truth. The classical Sunni sources (Bukhari, Muslim, Tirmidhi) contain many narrations of the Prophet\'s love for Husayn.',
    people: ['ali-ibn-abi-talib', 'fatimah-al-zahra', 'hasan-ibn-ali', 'muhammad-pbuh'],
    relatedEvents: ['battle-of-karbala', 'caliphate-ali', 'umayyad-caliphate'],
    relatedPlaces: ['madinah', 'karbala', 'makkah'],
    sources: [
      { type: 'hadith', ref: 'Sahih al-Bukhari, Kitab Fada\'il al-Sahabah, 3753; Sahih Muslim, Kitab Fada\'il al-Sahabah, 2422', note: 'Prophetic narrations about Husayn, graded sahih' },
      { type: 'classical', ref: 'Al-Tabari, Tarikh al-Rusul wal-Muluk, Vol. 19', note: 'Detailed account of Karbala' },
      { type: 'academic', ref: 'Heinz Halm, Shi\'a Islam: From Religion to Revolution (1997)' }
    ],
    certainty: 'established',
    tags: ['ahl-al-bayt', 'prophet-family', 'martyr', 'karbala', 'ashura'],
    dayOfYear: null
  },
  {
    id: 'salahuddin-ayyubi',
    type: 'person',
    era: 'abbasid',
    title: 'Salahuddin Ayyubi (Saladin)',
    subtitle: 'Founder of the Ayyubid dynasty — liberator of Jerusalem',
    date: { hijri: 'c. 532–589 AH', gregorian: 'c. 1137–1193 CE' },
    location: 'Tikrit (born), Damascus (capital), Egypt and the Levant',
    summary: 'Salah al-Din Yusuf ibn Ayyub — known in the West as Saladin — was a Kurdish Muslim military commander who founded the Ayyubid dynasty and united Egypt and Syria under one rule. He defeated the Crusaders at the Battle of Hattin in 1187 and recaptured Jerusalem, treating the city\'s population with a mercy that contrasted sharply with the Crusaders\' conquest of 1099.',
    details: 'Salahuddin rose to power as vizier of Egypt under the Fatimid Caliphate, which he then replaced with Sunni Abbasid suzerainty. He is remembered for both his military genius and his personal piety and generosity — his biographer Ibn Shaddad described him spending his entire treasury on others, leaving almost nothing for his own family when he died. His conduct in warfare — ransoming prisoners, honoring agreements, protecting non-combatants — set a standard that even his Crusader opponents acknowledged. Richard I of England and Salahuddin exchanged messages during the Third Crusade that became legendary examples of chivalry across cultures.',
    people: ['ibn-shaddad', 'nur-ad-din-zangi'],
    relatedEvents: ['salahuddin-jerusalem', 'battle-of-hattin', 'third-crusade'],
    relatedPlaces: ['jerusalem', 'damascus', 'cairo', 'hattin'],
    sources: [
      { type: 'classical', ref: 'Ibn Shaddad, Al-Nawadir al-Sultaniyya wal-Mahasin al-Yusufiyya', note: 'Primary biography by a companion and secretary' },
      { type: 'academic', ref: 'Anne-Marie Eddé, Saladin (English trans. Jane Marie Todd, 2014)', note: 'Most thorough modern academic biography' },
      { type: 'academic', ref: 'Jonathan Riley-Smith, The Crusades: A History (1987)' }
    ],
    certainty: 'established',
    tags: ['scholar', 'commander', 'jerusalem', 'crusades', 'ayyubid', 'mercy'],
    dayOfYear: null
  },
  {
    id: 'imam-al-bukhari',
    type: 'person',
    era: 'abbasid',
    title: 'Imam al-Bukhari',
    subtitle: 'Compiler of the most authentic book after the Quran',
    date: { hijri: '194–256 AH', gregorian: '810–870 CE' },
    location: 'Bukhara (born), Samarkand (died)',
    summary: 'Muhammad ibn Ismail al-Bukhari was a 9th-century Muslim scholar from Bukhara who compiled the Sahih al-Bukhari — considered by Sunni Muslims to be the most rigorously authenticated collection of hadith and the most authentic book after the Quran. He travelled extensively across the Muslim world, collecting narrations and applying meticulous standards of authentication.',
    details: 'Al-Bukhari reportedly evaluated over 600,000 hadith reports and included approximately 7,275 in his Sahih (with repetitions; around 2,602 unique hadith). He is said to have performed ghusl and prayed two rak\'at before recording each hadith, and to have spent 16 years compiling the collection. His methodology — examining the chain of narrators (isnad) and assessing the character and memory of each narrator (rijal criticism) — established the science of hadith authentication. He died in 870 CE near Samarkand while reportedly being expelled from Bukhara due to a political dispute.',
    people: [],
    relatedEvents: ['abbasid-caliphate'],
    relatedPlaces: ['bukhara', 'samarkand', 'madinah', 'baghdad'],
    sources: [
      { type: 'academic', ref: 'Jonathan Brown, Hadith: Muhammad\'s Legacy in the Medieval and Modern World (2009)', note: 'Best academic overview of hadith science' },
      { type: 'academic', ref: 'Gibril Fouad Haddad, The Four Imams and Their Schools (2007)', note: 'Context of classical Islamic scholarship' }
    ],
    certainty: 'established',
    tags: ['scholar', 'hadith', 'abbasid', 'bukhara', 'sunnah', 'authentication'],
    dayOfYear: null
  },
  {
    id: 'al-biruni',
    type: 'person',
    era: 'abbasid',
    title: 'Al-Biruni',
    subtitle: 'Master of geodesy, history, and comparative religion',
    date: { hijri: 'c. 362–440 AH', gregorian: 'c. 973–1048 CE' },
    location: 'Khwarazm (born), Ghazni (worked)',
    summary: 'Abu Rayhan Muhammad ibn Ahmad al-Biruni was one of the most extraordinary scholars of the Islamic Golden Age — a polymath who made original contributions to mathematics, astronomy, physics, geography, history, pharmacology, and the systematic study of other cultures and religions. He accompanied Mahmud of Ghazni on his campaigns to India and produced the Kitab al-Hind — a comprehensive ethnography of Indian civilization.',
    details: 'Al-Biruni calculated the circumference of the Earth using a method of his own devising from a single mountain observation — arriving at a figure remarkably close to the modern value. His Kitab al-Hind (Book of India) is considered a landmark in the history of ethnography and comparative religion — he learned Sanskrit and interviewed Indian scholars to produce an objective, systematic account of Indian science, religion, and culture. His Chronology of Ancient Nations examined the calendar systems of multiple civilizations. He corresponded in debate with Ibn Sina. His works on mineralogy and pharmacology were translated into Latin and influenced European scholarship.',
    people: ['ibn-sina', 'mahmud-of-ghazni'],
    relatedEvents: ['abbasid-golden-age', 'ghaznavid-dynasty'],
    relatedPlaces: ['bukhara', 'ghazni', 'india'],
    sources: [
      { type: 'academic', ref: 'Edward Sachau, Alberuni\'s India (1888, English trans.)', note: 'Classic translation of Kitab al-Hind' },
      { type: 'academic', ref: 'Jim Al-Khalili, The House of Wisdom (2011)', note: 'Accessible overview of Golden Age science' },
      { type: 'academic', ref: 'S.H. Nasr, An Introduction to Islamic Cosmological Doctrines (1964)' }
    ],
    certainty: 'established',
    tags: ['scholar', 'scientist', 'geographer', 'astronomer', 'abbasid', 'india', 'khwarazm'],
    dayOfYear: null
  },
  {
    id: 'al-razi',
    type: 'person',
    era: 'abbasid',
    title: 'Al-Razi (Rhazes)',
    subtitle: 'The greatest physician of the medieval world',
    date: { hijri: 'c. 251–313 AH', gregorian: 'c. 865–925 CE' },
    location: 'Ray (near modern Tehran), Baghdad',
    summary: 'Muhammad ibn Zakariyya al-Razi was a Persian Muslim physician and philosopher, widely regarded as the greatest clinician of the medieval world. He was the first to distinguish smallpox from measles through systematic clinical observation. He directed major hospitals in Ray and Baghdad and produced the Kitab al-Hawi (Comprehensive Book of Medicine) — the largest medical encyclopedia of the medieval period.',
    details: 'Al-Razi\'s Kitab al-Hawi (Liber Continens in Latin) ran to over 20 volumes and was translated into Latin in 1279, remaining a standard medical reference in Europe for centuries. He was the first physician to use animal gut for sutures, and pioneered the use of alcohol in medicine. His essay on smallpox and measles (Al-Judari wal-Hasba) was the first clinical description distinguishing these two diseases — translated into Latin and published in multiple editions in Europe through the 18th century. He was known for treating poor patients free of charge and using clinical observation rather than pure theory.',
    people: ['ibn-sina'],
    relatedEvents: ['abbasid-caliphate', 'house-of-wisdom'],
    relatedPlaces: ['ray', 'baghdad'],
    sources: [
      { type: 'academic', ref: 'Lenn Goodman, Islamic Humanism (2003)', note: 'Analysis of al-Razi\'s philosophy and medicine' },
      { type: 'academic', ref: 'Michael Dols, Medieval Islamic Medicine (1984)', note: 'Context of Islamic medical tradition' },
      { type: 'academic', ref: 'Jim Al-Khalili, The House of Wisdom (2011)' }
    ],
    certainty: 'established',
    tags: ['scholar', 'physician', 'scientist', 'abbasid', 'persia', 'medicine', 'baghdad'],
    dayOfYear: null
  },
  {
    id: 'ibn-rushd',
    type: 'person',
    era: 'umayyad',
    title: 'Ibn Rushd (Averroes)',
    subtitle: 'The Commentator — whose work reshaped European philosophy',
    date: { hijri: 'c. 520–595 AH', gregorian: 'c. 1126–1198 CE' },
    location: 'Córdoba (born), Marrakesh (died)',
    summary: 'Abu al-Walid Muhammad ibn Ahmad ibn Rushd — known in Latin as Averroes — was an Andalusian Muslim philosopher, physician, and jurist whose extensive commentaries on Aristotle\'s works profoundly influenced both Islamic and European scholastic philosophy. He served as the chief judge (qadi) of Seville and Córdoba and as court physician.',
    details: 'Ibn Rushd wrote commentaries on nearly all of Aristotle\'s works — earning the title "The Commentator" from European scholars including Thomas Aquinas. His rational approach to reconciling Aristotelian philosophy with Islamic theology was critiqued by al-Ghazali\'s earlier Incoherence of the Philosophers; Ibn Rushd responded with his Incoherence of the Incoherence. His medical work Al-Kulliyat (Colliget in Latin) was a standard textbook in European universities. Near the end of his life he was briefly exiled by the Almohad Caliph due to concerns about his philosophical views — a reminder of the complexity of scholars\' relationships with political power.',
    people: ['ibn-tufayl', 'al-ghazali', 'maimonides'],
    relatedEvents: ['andalus', 'caliphate-of-cordoba'],
    relatedPlaces: ['cordoba', 'seville', 'marrakesh'],
    sources: [
      { type: 'academic', ref: 'Oliver Leaman, Averroes and His Philosophy (1988)', note: 'Standard academic study' },
      { type: 'academic', ref: 'Dominique Urvoy, Ibn Rushd (Averroes) (1991, English trans.)' },
      { type: 'academic', ref: 'Maria Menocal, The Ornament of the World (2002)', note: 'Cultural context in al-Andalus' }
    ],
    certainty: 'established',
    tags: ['scholar', 'philosopher', 'physician', 'andalus', 'cordoba', 'aristotle', 'europe'],
    dayOfYear: null
  }
);

/** Get "This Day" entry by current date (approximate matching by dayOfYear) */
WAQTX_HISTORY.getTodayEntry = function() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var doy = Math.floor((now - start) / 86400000);
  var match = WAQTX_HISTORY.events.find(function(e) { return e.dayOfYear === doy; });
  if (!match) {
    /* Fallback: pick from events by day of year modulo */
    var all = WAQTX_HISTORY.events;
    match = all[doy % all.length];
  }
  return match;
};
