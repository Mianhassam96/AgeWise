
'use strict';
/* ═══════════════════════════════════════════════
   WaqtX — App Logic v1
   ═══════════════════════════════════════════════ */

var AVG_LIFESPAN_YEARS = 75;
var _birth = null;

/* ── Helpers ── */
function el(id) { return document.getElementById(id); }
function setText(id, v) { var e = el(id); if (e) e.textContent = v; }
function fmt(n) { return Number(n).toLocaleString(); }

function parseDOB(str) {
  var p = str.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}

function getTotals(birth) {
  var ms = Date.now() - birth.getTime();
  var sec = Math.floor(ms / 1000);
  var min = Math.floor(sec / 60);
  var hr  = Math.floor(min / 60);
  var day = Math.floor(hr / 24);
  return { sec: sec, min: min, hr: hr, day: day };
}

function getBreakdown(birth) {
  var n = new Date();
  var yy = n.getFullYear() - birth.getFullYear();
  var mo = n.getMonth()    - birth.getMonth();
  var dd = n.getDate()     - birth.getDate();
  if (dd < 0) { dd += new Date(n.getFullYear(), n.getMonth(), 0).getDate(); mo--; }
  if (mo < 0) { mo += 12; yy--; }
  return { yy: yy, mo: mo, dd: dd };
}

/* ── Gregorian → Hijri ── */
function toHijri(date) {
  var jd = Math.floor((14 + date.getMonth() + 1) / 12);
  var y  = date.getFullYear() + 4800 - jd;
  var m  = date.getMonth() + 1 + 12 * jd - 3;
  var jdn = date.getDate()
    + Math.floor((153 * m + 2) / 5)
    + 365 * y
    + Math.floor(y / 4)
    - Math.floor(y / 100)
    + Math.floor(y / 400)
    - 32045;
  var l = jdn - 1948440 + 10632;
  var n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  var j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719))
        + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l
    - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50))
    - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43))
    + 29;
  var hYear  = 19 * n + Math.floor(j / 4) + Math.floor(l / 29) - 30;
  var hMonth = Math.floor((59 * (l - 1) + 1) / 1771);
  return { year: hYear, month: hMonth };
}

var HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
];

/* ── World Data (Pakistan-focused, 1947–2024) ── */
var WORLD_DATA = {
  1947: { pm: 'Liaquat Ali Khan',        president: 'Muhammad Ali Jinnah',    currency: 'Pakistani Rupee (PKR)', pop: '2.3 Billion', event: 'Pakistan Independence',        tech: 'First Transistor Invented' },
  1948: { pm: 'Liaquat Ali Khan',        president: 'Khawaja Nazimuddin',     currency: 'Pakistani Rupee (PKR)', pop: '2.4 Billion', event: 'State of Israel Founded',       tech: 'Long-Playing Record (LP)' },
  1949: { pm: 'Liaquat Ali Khan',        president: 'Khawaja Nazimuddin',     currency: 'Pakistani Rupee (PKR)', pop: '2.5 Billion', event: 'NATO Founded',                  tech: 'First Stored-Program Computer' },
  1950: { pm: 'Liaquat Ali Khan',        president: 'Khawaja Nazimuddin',     currency: 'Pakistani Rupee (PKR)', pop: '2.5 Billion', event: 'Korean War Began',              tech: 'Credit Card Invented' },
  1951: { pm: 'Liaquat Ali Khan',        president: 'Khawaja Nazimuddin',     currency: 'Pakistani Rupee (PKR)', pop: '2.6 Billion', event: 'First Nuclear Power Plant',     tech: 'Color TV Introduced' },
  1952: { pm: 'Khawaja Nazimuddin',      president: 'Ghulam Mohammad',        currency: 'Pakistani Rupee (PKR)', pop: '2.6 Billion', event: 'Queen Elizabeth II Crowned',    tech: 'Polio Vaccine Developed' },
  1953: { pm: 'Mohammad Ali Bogra',      president: 'Ghulam Mohammad',        currency: 'Pakistani Rupee (PKR)', pop: '2.7 Billion', event: 'Korean War Ended',              tech: 'DNA Double Helix Discovered' },
  1954: { pm: 'Mohammad Ali Bogra',      president: 'Ghulam Mohammad',        currency: 'Pakistani Rupee (PKR)', pop: '2.8 Billion', event: 'First Nuclear Submarine',       tech: 'FORTRAN Language Created' },
  1955: { pm: 'Chaudhry Mohammad Ali',   president: 'Iskander Mirza',         currency: 'Pakistani Rupee (PKR)', pop: '2.8 Billion', event: 'Warsaw Pact Signed',            tech: 'Disneyland Opened' },
  1956: { pm: 'Huseyn Shaheed Suhrawardy', president: 'Iskander Mirza',       currency: 'Pakistani Rupee (PKR)', pop: '2.9 Billion', event: 'Suez Crisis',                   tech: 'Hard Disk Drive Invented' },
  1957: { pm: 'Huseyn Shaheed Suhrawardy', president: 'Iskander Mirza',       currency: 'Pakistani Rupee (PKR)', pop: '3.0 Billion', event: 'Sputnik Launched',              tech: 'First Satellite in Space' },
  1958: { pm: 'Feroz Khan Noon',         president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.0 Billion', event: 'NASA Founded',                  tech: 'Integrated Circuit Invented' },
  1959: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.1 Billion', event: 'Cuban Revolution',              tech: 'Microchip Invented' },
  1960: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.0 Billion', event: 'Islamabad Became Capital',       tech: 'Laser Invented' },
  1961: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.1 Billion', event: 'Berlin Wall Built',             tech: 'First Human in Space' },
  1962: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.2 Billion', event: 'Cuban Missile Crisis',          tech: 'First Communications Satellite' },
  1963: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.2 Billion', event: 'JFK Assassinated',              tech: 'Cassette Tape Invented' },
  1964: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.3 Billion', event: 'Civil Rights Act Signed',       tech: 'BASIC Language Created' },
  1965: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.4 Billion', event: 'Indo-Pak War 1965',             tech: 'Minicomputer Introduced' },
  1966: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.4 Billion', event: 'Cultural Revolution in China',  tech: 'First Soft Landing on Moon' },
  1967: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.5 Billion', event: 'Six-Day War',                   tech: 'First Heart Transplant' },
  1968: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.6 Billion', event: 'Martin Luther King Killed',     tech: 'Intel Founded' },
  1969: { pm: 'Yahya Khan',              president: 'Yahya Khan',             currency: 'Pakistani Rupee (PKR)', pop: '3.7 Billion', event: 'Moon Landing',                  tech: 'ARPANET (Internet) Created' },
  1970: { pm: 'Yahya Khan',              president: 'Yahya Khan',             currency: 'Pakistani Rupee (PKR)', pop: '3.7 Billion', event: 'Bangladesh Liberation War',     tech: 'Floppy Disk Invented' },
  1971: { pm: 'Zulfikar Ali Bhutto',     president: 'Zulfikar Ali Bhutto',    currency: 'Pakistani Rupee (PKR)', pop: '3.8 Billion', event: 'Bangladesh Independence',       tech: 'Email Invented' },
  1972: { pm: 'Zulfikar Ali Bhutto',     president: 'Zulfikar Ali Bhutto',    currency: 'Pakistani Rupee (PKR)', pop: '3.9 Billion', event: 'Nixon Visits China',            tech: 'Pong Video Game Released' },
  1973: { pm: 'Zulfikar Ali Bhutto',     president: 'Fazal Ilahi Chaudhry',   currency: 'Pakistani Rupee (PKR)', pop: '4.0 Billion', event: 'Oil Crisis',                    tech: 'Ethernet Invented' },
  1974: { pm: 'Zulfikar Ali Bhutto',     president: 'Fazal Ilahi Chaudhry',   currency: 'Pakistani Rupee (PKR)', pop: '4.0 Billion', event: 'India Nuclear Test',            tech: 'Barcode Scanner Used' },
  1975: { pm: 'Zulfikar Ali Bhutto',     president: 'Fazal Ilahi Chaudhry',   currency: 'Pakistani Rupee (PKR)', pop: '4.1 Billion', event: 'Vietnam War Ended',             tech: 'Microsoft Founded' },
  1976: { pm: 'Zulfikar Ali Bhutto',     president: 'Fazal Ilahi Chaudhry',   currency: 'Pakistani Rupee (PKR)', pop: '4.2 Billion', event: 'Mao Zedong Died',              tech: 'Apple Computer Founded' },
  1977: { pm: 'Zulfikar Ali Bhutto',     president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.2 Billion', event: 'Zia ul-Haq Coup',              tech: 'Apple II Released' },
  1978: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.3 Billion', event: 'Camp David Accords',            tech: 'First Test-Tube Baby Born' },
  1979: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.4 Billion', event: 'Soviet Invasion of Afghanistan', tech: 'VisiCalc Spreadsheet Released' },
  1980: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.4 Billion', event: 'Iran-Iraq War Began',           tech: 'Pac-Man Released' },
  1981: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.5 Billion', event: 'Reagan Inaugurated',            tech: 'IBM PC Released' },
  1982: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.6 Billion', event: 'Falklands War',                 tech: 'CD Player Released' },
  1983: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.7 Billion', event: 'US Embassy Bombing Beirut',     tech: 'Internet Protocols Established' },
  1984: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.8 Billion', event: 'Bhopal Gas Tragedy',            tech: 'Apple Macintosh Released' },
  1985: { pm: 'Muhammad Khan Junejo',    president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.8 Billion', event: 'Live Aid Concert',              tech: 'Windows 1.0 Released' },
  1986: { pm: 'Muhammad Khan Junejo',    president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.9 Billion', event: 'Chernobyl Disaster',            tech: 'Pixar Founded' },
  1987: { pm: 'Muhammad Khan Junejo',    president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '5.0 Billion', event: 'Black Monday Stock Crash',      tech: 'GIF Format Created' },
  1988: { pm: 'Benazir Bhutto',          president: 'Ghulam Ishaq Khan',      currency: 'Pakistani Rupee (PKR)', pop: '5.1 Billion', event: 'Lockerbie Bombing',             tech: 'World Wide Web Proposed' },
  1989: { pm: 'Benazir Bhutto',          president: 'Ghulam Ishaq Khan',      currency: 'Pakistani Rupee (PKR)', pop: '5.2 Billion', event: 'Berlin Wall Fell',              tech: 'WWW Invented' },
  1990: { pm: 'Nawaz Sharif',            president: 'Ghulam Ishaq Khan',      currency: 'Pakistani Rupee (PKR)', pop: '5.3 Billion', event: 'German Reunification',          tech: 'World Wide Web Created' },
  1991: { pm: 'Nawaz Sharif',            president: 'Ghulam Ishaq Khan',      currency: 'Pakistani Rupee (PKR)', pop: '5.4 Billion', event: 'Soviet Union Dissolved',        tech: 'Linux Released' },
  1992: { pm: 'Nawaz Sharif',            president: 'Ghulam Ishaq Khan',      currency: 'Pakistani Rupee (PKR)', pop: '5.5 Billion', event: 'Maastricht Treaty Signed',      tech: 'SMS Text Messaging' },
  1993: { pm: 'Benazir Bhutto',          president: 'Farooq Leghari',         currency: 'Pakistani Rupee (PKR)', pop: '5.6 Billion', event: 'Oslo Accords Signed',           tech: 'Mosaic Browser Released' },
  1994: { pm: 'Benazir Bhutto',          president: 'Farooq Leghari',         currency: 'Pakistani Rupee (PKR)', pop: '5.6 Billion', event: 'Nelson Mandela Elected',        tech: 'Amazon Founded' },
  1995: { pm: 'Benazir Bhutto',          president: 'Farooq Leghari',         currency: 'Pakistani Rupee (PKR)', pop: '5.7 Billion', event: 'Oklahoma City Bombing',         tech: 'Windows 95 Released' },
  1996: { pm: 'Benazir Bhutto',          president: 'Farooq Leghari',         currency: 'Pakistani Rupee (PKR)', pop: '5.8 Billion', event: 'Summer Olympics in Atlanta',    tech: 'Windows 95 Released' },
  1997: { pm: 'Nawaz Sharif',            president: 'Muhammad Rafiq Tarar',   currency: 'Pakistani Rupee (PKR)', pop: '5.9 Billion', event: 'Hong Kong Handover to China',   tech: 'Deep Blue Beats Kasparov' },
  1998: { pm: 'Nawaz Sharif',            president: 'Muhammad Rafiq Tarar',   currency: 'Pakistani Rupee (PKR)', pop: '5.9 Billion', event: 'Pakistan Nuclear Tests',        tech: 'Google Founded' },
  1999: { pm: 'Pervez Musharraf',        president: 'Muhammad Rafiq Tarar',   currency: 'Pakistani Rupee (PKR)', pop: '6.0 Billion', event: 'NATO Kosovo Campaign',          tech: 'Napster Launched' },
  2000: { pm: 'Pervez Musharraf',        president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.1 Billion', event: 'Y2K Fears Unfounded',           tech: 'USB Flash Drive Invented' },
  2001: { pm: 'Pervez Musharraf',        president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.2 Billion', event: 'September 11 Attacks',          tech: 'Wikipedia Launched' },
  2002: { pm: 'Zafarullah Khan Jamali',  president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.2 Billion', event: 'Euro Coins Introduced',         tech: 'Friendster Launched' },
  2003: { pm: 'Zafarullah Khan Jamali',  president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.3 Billion', event: 'Iraq War Began',                tech: 'Skype Launched' },
  2004: { pm: 'Shaukat Aziz',            president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.4 Billion', event: 'Indian Ocean Tsunami',          tech: 'Facebook Founded' },
  2005: { pm: 'Shaukat Aziz',            president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.5 Billion', event: 'Kashmir Earthquake',            tech: 'YouTube Founded' },
  2006: { pm: 'Shaukat Aziz',            president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.6 Billion', event: 'Saddam Hussein Executed',       tech: 'Twitter Launched' },
  2007: { pm: 'Shaukat Aziz',            president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.6 Billion', event: 'Benazir Bhutto Assassinated',   tech: 'iPhone Released' },
  2008: { pm: 'Yousaf Raza Gillani',     president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '6.7 Billion', event: 'Global Financial Crisis',       tech: 'Android OS Released' },
  2009: { pm: 'Yousaf Raza Gillani',     president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '6.8 Billion', event: 'Obama Inaugurated',             tech: 'WhatsApp Founded' },
  2010: { pm: 'Yousaf Raza Gillani',     president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '6.9 Billion', event: 'Pakistan Floods',               tech: 'Instagram Launched' },
  2011: { pm: 'Yousaf Raza Gillani',     president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '7.0 Billion', event: 'Arab Spring',                   tech: 'Siri Launched' },
  2012: { pm: 'Raja Pervaiz Ashraf',     president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '7.1 Billion', event: 'London Olympics',               tech: 'Raspberry Pi Released' },
  2013: { pm: 'Nawaz Sharif',            president: 'Mamnoon Hussain',        currency: 'Pakistani Rupee (PKR)', pop: '7.2 Billion', event: 'Malala Nobel Prize',            tech: 'Snapchat Launched' },
  2014: { pm: 'Nawaz Sharif',            president: 'Mamnoon Hussain',        currency: 'Pakistani Rupee (PKR)', pop: '7.3 Billion', event: 'ISIS Declared Caliphate',       tech: 'Apple Watch Announced' },
  2015: { pm: 'Nawaz Sharif',            president: 'Mamnoon Hussain',        currency: 'Pakistani Rupee (PKR)', pop: '7.4 Billion', event: 'Paris Climate Agreement',       tech: 'Windows 10 Released' },
  2016: { pm: 'Nawaz Sharif',            president: 'Mamnoon Hussain',        currency: 'Pakistani Rupee (PKR)', pop: '7.4 Billion', event: 'Brexit Vote',                   tech: 'Pokemon Go Released' },
  2017: { pm: 'Shahid Khaqan Abbasi',    president: 'Mamnoon Hussain',        currency: 'Pakistani Rupee (PKR)', pop: '7.5 Billion', event: 'Rohingya Crisis',               tech: 'Bitcoin Surged' },
  2018: { pm: 'Imran Khan',              president: 'Arif Alvi',              currency: 'Pakistani Rupee (PKR)', pop: '7.6 Billion', event: 'Saudi Arabia Reforms',          tech: '5G Networks Launched' },
  2019: { pm: 'Imran Khan',              president: 'Arif Alvi',              currency: 'Pakistani Rupee (PKR)', pop: '7.7 Billion', event: 'Notre Dame Fire',               tech: 'Foldable Phones Released' },
  2020: { pm: 'Imran Khan',              president: 'Arif Alvi',              currency: 'Pakistani Rupee (PKR)', pop: '7.8 Billion', event: 'COVID-19 Pandemic',             tech: 'Zoom Became Essential' },
  2021: { pm: 'Imran Khan',              president: 'Arif Alvi',              currency: 'Pakistani Rupee (PKR)', pop: '7.9 Billion', event: 'Taliban Retook Afghanistan',    tech: 'NFTs Exploded' },
  2022: { pm: 'Shehbaz Sharif',          president: 'Arif Alvi',              currency: 'Pakistani Rupee (PKR)', pop: '8.0 Billion', event: 'Russia-Ukraine War',            tech: 'ChatGPT Launched' },
  2023: { pm: 'Anwaar-ul-Haq Kakar',     president: 'Arif Alvi',              currency: 'Pakistani Rupee (PKR)', pop: '8.1 Billion', event: 'Gaza Conflict',                 tech: 'AI Revolution' },
  2024: { pm: 'Shehbaz Sharif',          president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '8.2 Billion', event: 'Global Elections Year',         tech: 'AI Everywhere' },
  2025: { pm: 'Shehbaz Sharif',          president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '8.2 Billion', event: 'AI Reshaping the World',        tech: 'Agentic AI Era' }
};

function getWorldData(year) {
  if (WORLD_DATA[year]) return WORLD_DATA[year];
  if (year < 1947) return {
    pm: 'British Colonial Rule', president: 'N/A (Pre-Independence)',
    currency: 'British Indian Rupee', pop: 'Below 2.3 Billion',
    event: 'World War II Era', tech: 'Early Radio & Aviation'
  };
  return WORLD_DATA[2024];
}

/* ── Islamic Dates ── */
function getNextRamadan() {
  var today = new Date();
  // Approximate Ramadan start dates (calculated)
  var ramadans = [
    new Date(2025, 2, 1),   // 1 Mar 2025
    new Date(2026, 1, 18),  // 18 Feb 2026
    new Date(2027, 1, 7),   // 7 Feb 2027
    new Date(2028, 0, 27),  // 27 Jan 2028
    new Date(2029, 0, 16)   // 16 Jan 2029
  ];
  for (var i = 0; i < ramadans.length; i++) {
    if (ramadans[i] > today) {
      return ramadans[i].toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }
  return '2030';
}

function getNextJumua() {
  var today = new Date();
  var day = today.getDay(); // 0=Sun, 5=Fri
  var daysUntil = (5 - day + 7) % 7;
  if (daysUntil === 0) daysUntil = 7; // already Friday, next one
  var next = new Date(today);
  next.setDate(today.getDate() + daysUntil);
  return next.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function getMilestoneDate(birth, targetDays) {
  var d = new Date(birth.getTime());
  d.setDate(d.getDate() + targetDays);
  if (d <= new Date()) return 'Achieved \u2713';
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Ring Animation ── */
function animateRing(pct) {
  var ring = el('ring-fill');
  if (!ring) return;
  var circumference = 314;
  var offset = circumference - (pct / 100) * circumference;
  setTimeout(function () { ring.style.strokeDashoffset = offset; }, 400);
}

/* ── Counter Animation ── */
function animateCounter(elId, target, duration) {
  var e = el(elId);
  if (!e) return;
  var steps = 60;
  var step = Math.ceil(target / steps);
  var current = 0;
  var interval = Math.floor(duration / steps);
  var timer = setInterval(function () {
    current = Math.min(current + step, target);
    e.textContent = Number(current).toLocaleString();
    if (current >= target) clearInterval(timer);
  }, interval);
}

/* ── Main Render ── */
function renderAll(birth) {
  _birth = birth;
  var t = getTotals(birth);
  var b = getBreakdown(birth);
  var ageYears = b.yy + b.mo / 12 + b.dd / 365;
  var pct = Math.min(100, (ageYears / AVG_LIFESPAN_YEARS) * 100);
  var pctRound = Math.round(pct * 10) / 10;
  var pctInt = Math.round(pct);

  var hijriBirth = toHijri(birth);
  var hijriNow   = toHijri(new Date());
  var islamicYears = hijriNow.year - hijriBirth.year;
  var ramadans = Math.floor(ageYears);

  var worldData = getWorldData(birth.getFullYear());
  var sleepYears = (ageYears * 0.333).toFixed(1);
  var heartBillions = (t.day * 24 * 60 * 70 / 1e9).toFixed(2);
  var secondsMillion = (t.sec / 1e6).toFixed(1);

  var dayName = birth.toLocaleDateString('en-US', { weekday: 'long' });
  var daySubMap = {
    Friday:    "Jumu'ah \u2013 the best day of the week.",
    Monday:    'A blessed day of the week.',
    Thursday:  'A day of fasting for many.',
    Wednesday: 'A day of remembrance.',
    Saturday:  'A day of rest.',
    Sunday:    'A new beginning.',
    Tuesday:   'A day of strength.'
  };

  /* Show results */
  el('results-section').classList.remove('hidden');
  el('hero').style.minHeight = 'auto';

  /* Glance */
  setText('g-days',    fmt(t.day));
  setText('g-hours',   fmt(t.hr));
  setText('g-sleep',   sleepYears);
  setText('g-hearts',  heartBillions);
  setText('g-sunsets', fmt(t.day));
  setText('g-seconds', secondsMillion);

  /* Islamic */
  setText('ih-hijri-year',    hijriBirth.year + ' AH');
  setText('ih-hijri-month',   HIJRI_MONTHS[(hijriBirth.month - 1) || 0]);
  setText('ih-day',           dayName);
  setText('ih-day-sub',       daySubMap[dayName] || 'A blessed day.');
  setText('ih-ramadans',      ramadans);
  setText('ih-ramadans2',     ramadans);
  setText('ih-hajj',          ramadans);
  setText('ih-hajj2',         ramadans);
  setText('ih-islamic-years', islamicYears);
  setText('ih-hijri-range',   hijriBirth.year + ' AH \u2013 ' + hijriNow.year + ' AH');
  setText('ih-next-ramadan',  getNextRamadan());

  /* World */
  setText('w-pm',         worldData.pm);
  setText('w-president',  worldData.president);
  setText('w-currency',   worldData.currency);
  setText('w-population', worldData.pop);
  setText('w-event',      worldData.event);
  setText('w-tech',       worldData.tech);

  /* Journey ring */
  setText('journey-pct',  pctInt + '%');
  setText('journey-pct2', pctRound + '%');
  animateRing(pctInt);

  /* Milestones */
  setText('ms-jumua',  getNextJumua());
  setText('ms-10k',    getMilestoneDate(birth, 10000));
  var age30 = new Date(birth.getFullYear() + 30, birth.getMonth(), birth.getDate());
  setText('ms-age30',  age30 <= new Date() ? 'Achieved \u2713' : age30.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
  setText('ms-1b',     getMilestoneDate(birth, Math.floor(1e9 / 86400)));

  /* Share preview */
  setText('sp-days',  fmt(t.day));
  setText('sp-hijri', hijriBirth.year + ' AH \u2013 ' + hijriNow.year + ' AH');

  /* Modal card */
  setText('scdl-pct',   pctInt + '%');
  setText('scdl-days',  fmt(t.day) + ' Days Lived');
  setText('scdl-hijri', hijriBirth.year + ' AH \u2013 ' + hijriNow.year + ' AH');

  /* Animate day counter */
  setTimeout(function () { animateCounter('g-days', t.day, 1200); }, 500);

  /* Live tick every second */
  clearInterval(window._ticker);
  window._ticker = setInterval(function () {
    var t2 = getTotals(_birth);
    setText('g-hours',   fmt(t2.hr));
    setText('g-seconds', (t2.sec / 1e6).toFixed(1));
  }, 1000);

  /* Save DOB */
  try { localStorage.setItem('waqtx_dob', birth.toISOString().split('T')[0]); } catch(e) {}

  /* Scroll to results */
  setTimeout(function () {
    var gs = el('results-section');
    if (gs) gs.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}

/* ── Loading Sequence ── */
function showLoading(cb) {
  var overlay = el('loading-overlay');
  var textEl  = el('loading-text');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  var msgs = [
    'Analyzing your time\u2026',
    'Calculating your Islamic history\u2026',
    'Building your timeline\u2026'
  ];
  var i = 0;
  textEl.textContent = msgs[0];

  var seq = setInterval(function () {
    i++;
    if (i < msgs.length) {
      textEl.style.opacity = '0';
      setTimeout(function () {
        textEl.textContent = msgs[i];
        textEl.style.opacity = '1';
      }, 300);
    } else {
      clearInterval(seq);
      setTimeout(function () {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
        cb();
      }, 600);
    }
  }, 900);
}

/* ── Event Listeners ── */
el('btn-calculate').addEventListener('click', function () {
  var dob   = el('hero-dob').value;
  var errEl = el('hero-error');
  errEl.classList.add('hidden');

  if (!dob) {
    errEl.textContent = 'Please select your date of birth.';
    errEl.classList.remove('hidden');
    return;
  }
  var birth = parseDOB(dob);
  if (birth > new Date()) {
    errEl.textContent = 'Date of birth cannot be in the future.';
    errEl.classList.remove('hidden');
    return;
  }
  var minYear = 1900;
  if (birth.getFullYear() < minYear) {
    errEl.textContent = 'Please enter a year after ' + minYear + '.';
    errEl.classList.remove('hidden');
    return;
  }
  showLoading(function () { renderAll(birth); });
});

el('hero-dob').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') el('btn-calculate').click();
});

el('btn-start-again').addEventListener('click', function () {
  el('results-section').classList.add('hidden');
  el('hero').style.minHeight = '';
  el('hero-dob').value = '';
  _birth = null;
  clearInterval(window._ticker);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Share nav button */
el('btn-share-nav').addEventListener('click', function () {
  if (!_birth) { el('hero-dob').focus(); return; }
  el('share-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
});

/* Download image button */
el('btn-download').addEventListener('click', function () {
  if (!_birth) return;
  el('share-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
});

/* Copy link */
el('btn-copy-link').addEventListener('click', function () {
  var btn = this;
  var url = 'https://mianhassam96.github.io/MultiMian-WaqtX/';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function () {
      btn.textContent = '\u2713 Copied!';
      setTimeout(function () { btn.textContent = '\uD83D\uDD17 Copy Link'; }, 2000);
    }).catch(function () {
      btn.textContent = 'Copy failed';
      setTimeout(function () { btn.textContent = '\uD83D\uDD17 Copy Link'; }, 2000);
    });
  } else {
    /* Fallback */
    var ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); btn.textContent = '\u2713 Copied!'; } catch(e) { btn.textContent = 'Copy failed'; }
    document.body.removeChild(ta);
    setTimeout(function () { btn.textContent = '\uD83D\uDD17 Copy Link'; }, 2000);
  }
});

/* Modal close */
el('share-close').addEventListener('click', function () {
  el('share-modal').classList.add('hidden');
  document.body.style.overflow = '';
});
el('share-modal').addEventListener('click', function (e) {
  if (e.target === this) {
    el('share-modal').classList.add('hidden');
    document.body.style.overflow = '';
  }
});

/* Download card */
el('btn-dl-card').addEventListener('click', function () {
  var card = el('share-card-dl');
  if (typeof html2canvas === 'undefined') {
    alert('Please take a screenshot to save your card.');
    return;
  }
  var btn = this;
  btn.textContent = 'Generating\u2026';
  btn.disabled = true;
  html2canvas(card, { backgroundColor: '#061008', scale: 2 }).then(function (canvas) {
    var a = document.createElement('a');
    a.download = 'waqtx-timeline.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    btn.textContent = 'Downloaded!';
    setTimeout(function () { btn.textContent = '\u2B07 Download Card'; btn.disabled = false; }, 2000);
  }).catch(function () {
    btn.textContent = '\u2B07 Download Card';
    btn.disabled = false;
  });
});

/* Hamburger */
el('hamburger').addEventListener('click', function () {
  var links = el('nav-links');
  if (links) links.classList.toggle('open');
});

/* Close mobile menu on link click */
document.querySelectorAll('.nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    var links = el('nav-links');
    if (links) links.classList.remove('open');
  });
});

/* Navbar scroll effect */
window.addEventListener('scroll', function () {
  var nav = el('navbar');
  if (nav) {
    if (window.scrollY > 20) {
      nav.style.borderBottomColor = 'rgba(201,168,76,0.2)';
    } else {
      nav.style.borderBottomColor = 'rgba(201,168,76,0.12)';
    }
  }
});

/* PWA Install */
var _deferredInstall = null;
window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  _deferredInstall = e;
  setTimeout(function () {
    var p = el('pwa-prompt');
    if (p) p.classList.remove('hidden');
  }, 10000);
});

var pwaInstall = el('pwa-install');
var pwaDismiss = el('pwa-dismiss');
if (pwaInstall) pwaInstall.addEventListener('click', function () {
  if (!_deferredInstall) return;
  _deferredInstall.prompt();
  _deferredInstall.userChoice.then(function () {
    _deferredInstall = null;
    var p = el('pwa-prompt');
    if (p) p.classList.add('hidden');
  });
});
if (pwaDismiss) pwaDismiss.addEventListener('click', function () {
  var p = el('pwa-prompt');
  if (p) p.classList.add('hidden');
  try { localStorage.setItem('pwa_dismissed', Date.now()); } catch(e) {}
});

/* Restore last DOB */
(function () {
  try {
    var saved = localStorage.getItem('waqtx_dob');
    if (saved) {
      var inp = el('hero-dob');
      if (inp) inp.value = saved;
    }
  } catch(e) {}
})();
