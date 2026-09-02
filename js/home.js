'use strict';
/* ═══════════════════════════════════════════════
   WaqtX — Home Page Logic  (js/home.js)
   V2: extracted from app.js, now delegates ALL
   shared infrastructure to js/core.js.

   Responsibilities:
   ─ Hero dashboard card (DOB-based stats)
   ─ Prayer rhythm section (timeline + cards + countdown)
   ─ Today's Guidance (Ayah / Dua / Action / Reflection)
   ─ Journey Snapshot (ring, counters, remaining)
   ─ Home Muhasabah (quick 3-question save)
   ─ This Day in Islamic History
   ─ Spiritual Progress section
   ─ Home prayer countdown ticker
   ═══════════════════════════════════════════════ */

/* ── Shorthand — core.js is loaded first ── */
var S = WaqtX.storage;
var PRAYERS_5 = ['Fajr','Dhuhr','Asr','Maghrib','Isha'];
var PRAYERS_6 = ['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'];
var PRAYER_ICONS = { Fajr:'🌙', Sunrise:'🌅', Dhuhr:'☀️', Asr:'🌤️', Maghrib:'🌇', Isha:'🌃' };

/* ══════════════════════════════════════
   HERO DASHBOARD CARD
   ══════════════════════════════════════ */
function initHeroDashboard() {
  var name = S.get('name') || '';
  var dob  = S.get('dob')  || '';

  /* Greeting */
  var nameEl = el('hdc-name');
  if (nameEl) nameEl.textContent = name ? '— ' + name : '— Welcome';

  if (dob) {
    var birth = _parseDOB(dob);
    if (birth) {
      var stats = _calcHomeStats(birth);
      setText('hdc-ramadans', stats.ramadans);
      setText('hdc-jumuahs',  stats.fridays.toLocaleString());
      setText('hdc-prayers',  stats.prayerMoments.toLocaleString());
      /* Hide "no dob" prompt */
      var noDob = el('hdc-no-dob');
      if (noDob) noDob.classList.add('hidden');
    }
  } else {
    /* Show "enter DOB" prompt */
    var noDob = el('hdc-no-dob');
    if (noDob) noDob.classList.remove('hidden');
  }

  /* Spiritual snapshot bars */
  _renderHeroSnapshot();
}

function _parseDOB(str) {
  try {
    var p = str.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    if (isNaN(d.getTime())) return null;
    return d;
  } catch(e) { return null; }
}

function _calcHomeStats(birth) {
  var ms     = Date.now() - birth.getTime();
  var days   = Math.floor(ms / 86400000);
  var ageYrs = days / 365.25;
  return {
    ramadans:      Math.floor(ageYrs),
    fridays:       Math.floor(days / 7),
    prayerMoments: days * 5
  };
}

function _renderHeroSnapshot() {
  /* Prayer consistency — last 30 days */
  var prayerPct = _calcConsistency(30);
  var muhasabahPct = _calcMuhasabahDays(30);
  var gratitudePct = _calcGratitudeDays(30);

  setText('hdc-prayer-consistency',  prayerPct + '%');
  setText('hdc-muhasabah-streak',    muhasabahPct + '%');
  setText('hdc-gratitude-streak',    gratitudePct + '%');

  _setBarWidth('hdc-bar-prayer',     prayerPct);
  _setBarWidth('hdc-bar-muhasabah',  muhasabahPct);
  _setBarWidth('hdc-bar-gratitude',  gratitudePct);
}

function _setBarWidth(id, pct) {
  var bar = el(id);
  if (bar) {
    /* Use rAF so transition fires */
    requestAnimationFrame(function() {
      bar.style.width = Math.min(100, pct) + '%';
    });
  }
}

function _calcConsistency(days) {
  var done = 0;
  for (var i = 0; i < days; i++) {
    var data = S.get('tracker_' + getDateKey(-i)) || {};
    PRAYERS_5.forEach(function(p) { if (data[p]) done++; });
  }
  return days > 0 ? Math.round((done / (days * 5)) * 100) : 0;
}

function _calcMuhasabahDays(days) {
  var count = 0;
  for (var i = 0; i < days; i++) {
    var data = S.get('muhasabah_' + getDateKey(-i)) || {};
    var hasAny = ['gratitude','mistake','deed'].some(function(k) {
      return (data[k] || '').trim().length > 0;
    });
    if (hasAny) count++;
  }
  return Math.round((count / days) * 100);
}

function _calcGratitudeDays(days) {
  var count = 0;
  for (var i = 0; i < days; i++) {
    var data = S.get('gratitude_' + getDateKey(-i)) || {};
    if (data.b1 || data.b2 || data.b3) count++;
  }
  return Math.round((count / days) * 100);
}

/* ══════════════════════════════════════
   PRAYER RHYTHM SECTION
   Timeline + Status Cards + Next Prayer Ticker
   ══════════════════════════════════════ */
var _homePrayerTicker = null;

function initHomePrayerSection() {
  var timings = WaqtX.prayer.getCached();

  if (timings) {
    _renderPrayerTimeline(timings);
    _renderPrayerStatusCards(timings);
    _startHomePrayerTicker(timings);
  } else {
    _setPrayerSectionPlaceholder();
  }

  /* Auto-fetch if location saved and no cache */
  if (!timings) {
    var lat = S.get('location_lat');
    var lng = S.get('location_lng');
    if (lat && lng) {
      WaqtX.prayer.fetch(lat, lng, function(t) {
        _renderPrayerTimeline(t);
        _renderPrayerStatusCards(t);
        _startHomePrayerTicker(t);
      }, function() {
        _setPrayerSectionError();
      });
    } else {
      _setPrayerSectionNoLocation();
    }
  }
}

function _setPrayerSectionPlaceholder() {
  /* Pills stay as static labels — no times visible yet */
  setText('hnp-name', 'Set Location');
  setText('hnp-countdown', '—');
}

function _setPrayerSectionNoLocation() {
  var card = el('home-next-prayer-card');
  if (!card) return;
  card.innerHTML =
    '<div class="empty-state">' +
      '<div class="empty-state-icon">📍</div>' +
      '<div>Enable location in <a href="settings.html">Settings</a> to see your prayer times.</div>' +
    '</div>';
  /* Also clear prayer time cells */
  ['Fajr','Dhuhr','Asr','Maghrib','Isha'].forEach(function(p) {
    var t = el('hps-time-' + p);
    if (t) { t.textContent = '--:--'; t.classList.remove('skeleton-val','skeleton-md'); }
  });
}

function _setPrayerSectionError() {
  var card = el('home-next-prayer-card');
  if (!card) return;
  card.innerHTML =
    '<div class="error-state">' +
      '<span class="error-state-icon">⚠️</span>' +
      '<span>Could not load prayer times. Check your connection or <a href="settings.html" style="color:var(--gold)">update location</a>.</span>' +
    '</div>';
}

function _renderPrayerTimeline(timings) {
  var now    = new Date();
  var nowMin = now.getHours() * 60 + now.getMinutes();
  var next   = WaqtX.prayer.getNext(timings);

  PRAYERS_6.forEach(function(name) {
    var pill = el('ht-' + name);
    if (!pill) return;
    var pMin   = WaqtX.prayer.timeToMin(timings[name] || '');
    var isPast = pMin < nowMin && !next.isTomorrow;
    var isNext = next && name === next.name && !next.isTomorrow;
    pill.className = 'ht-pill' +
      (isNext  ? ' ht-next'     : '') +
      (isPast  ? ' ht-past'     : ' ht-upcoming');

    /* Show time in pill tooltip */
    if (timings[name]) {
      var clean = timings[name].split(' ')[0];
      pill.title = name + ' · ' + clean;
    }
  });
}

function _renderPrayerStatusCards(timings) {
  var now    = new Date();
  var nowMin = now.getHours() * 60 + now.getMinutes();
  var next   = WaqtX.prayer.getNext(timings);

  PRAYERS_5.forEach(function(name) {
    if (!timings[name]) return;
    var timeEl  = el('hps-time-' + name);
    var badgeEl = el('hps-badge-' + name);
    var clean   = timings[name].split(' ')[0];
    var pMin    = WaqtX.prayer.timeToMin(timings[name]);
    var isPast  = pMin < nowMin && !next.isTomorrow;
    var isNext  = next && name === next.name && !next.isTomorrow;

    if (timeEl) timeEl.textContent = clean;
    if (badgeEl) {
      if (isNext) {
        badgeEl.textContent = 'Next';
        badgeEl.className = 'hps-badge hps-next';
      } else if (isPast) {
        badgeEl.textContent = '✓ Done';
        badgeEl.className = 'hps-badge hps-done';
      } else {
        badgeEl.textContent = 'Upcoming';
        badgeEl.className = 'hps-badge hps-upcoming';
      }
    }
  });
}

function _startHomePrayerTicker(timings) {
  clearInterval(_homePrayerTicker);

  function tick() {
    var now    = new Date();
    var nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    var next   = WaqtX.prayer.getNext(timings);
    var nextSec = next.minutes * 60;
    var diff   = nextSec - nowSec;
    if (diff < 0) diff += 86400;

    var formatted = WaqtX.prayer.formatCountdown(diff);
    var label     = next.name + (next.isTomorrow ? ' (tomorrow)' : '');

    /* Hero dashboard card */
    setText('hdc-prayer-name',      label);
    setText('hdc-prayer-countdown', formatted);
    var iconEl = el('hdc-prayer-icon');
    if (iconEl) iconEl.textContent = PRAYER_ICONS[next.name] || '🕌';

    /* Home prayer section */
    setText('hnp-name',      label);
    setText('hnp-countdown', formatted);
    var hnpIcon = el('hnp-icon');
    if (hnpIcon) hnpIcon.textContent = PRAYER_ICONS[next.name] || '🕌';

    /* Refresh status cards once per minute */
    if (now.getSeconds() === 0) {
      _renderPrayerTimeline(timings);
      _renderPrayerStatusCards(timings);
    }
  }

  tick();
  _homePrayerTicker = setInterval(tick, 1000);
}

/* ══════════════════════════════════════
   TODAY'S GUIDANCE
   Ayah / Dua / Action — from daily-islam.js
   ══════════════════════════════════════ */
function initDailyGuidance() {
  if (!window.DAILY_AYAHS || !window.DAILY_DUAS || !window.DAILY_ACTIONS) return;

  var dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );

  var ayah   = DAILY_AYAHS[dayOfYear % DAILY_AYAHS.length];
  var dua    = DAILY_DUAS[dayOfYear % DAILY_DUAS.length];
  var action = DAILY_ACTIONS[dayOfYear % DAILY_ACTIONS.length];

  /* Ayah */
  setText('dd-ayah-arabic',      ayah.arabic);
  setText('dd-ayah-translation', ayah.translation);
  setText('dd-ayah-source',      ayah.source);
  setText('dd-ayah-reflection',  ayah.reflection || '');

  /* Dua */
  setText('dd-dua-situation',       dua.situation);
  setText('dd-dua-arabic',          dua.arabic);
  setText('dd-dua-transliteration', dua.transliteration || '');
  setText('dd-dua-translation',     dua.translation);
  setText('dd-dua-source',          dua.source);

  /* Action */
  setText('dd-action-text', action.action);
  setText('dd-action-why',  action.why || '');

  /* Done button */
  var doneKey = 'action_done_' + getTodayKey();
  var doneBtn = el('dd-done-btn');
  var doneMsg = el('dd-done-msg');

  if (S.get(doneKey)) {
    if (doneBtn) doneBtn.classList.add('hidden');
    if (doneMsg) doneMsg.classList.remove('hidden');
  }

  if (doneBtn) {
    doneBtn.addEventListener('click', function() {
      S.set(doneKey, true);
      doneBtn.classList.add('hidden');
      if (doneMsg) doneMsg.classList.remove('hidden');
    });
  }

  /* Share action */
  var shareBtn = el('dd-share-action-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      var text = action.action + '\n\n— WaqtX Daily Action · mianhassam96.github.io/WaqtX/';
      if (navigator.share) {
        navigator.share({ title: 'WaqtX — One Action Today', text: text });
      } else {
        navigator.clipboard.writeText(text).then(function() {
          var orig = shareBtn.textContent;
          shareBtn.textContent = '✓ Copied!';
          setTimeout(function() { shareBtn.textContent = orig; }, 2000);
        }).catch(function() {});
      }
    });
  }
}

/* ══════════════════════════════════════
   JOURNEY SNAPSHOT SECTION
   Counters + Ring + Remaining stats
   ══════════════════════════════════════ */
function initJourneySnapshot() {
  var dob = S.get('dob');
  if (!dob) {
    /* Show prompts with dashes — no DOB yet */
    return;
  }

  var birth = _parseDOB(dob);
  if (!birth) return;

  var ms      = Date.now() - birth.getTime();
  var days    = Math.floor(ms / 86400000);
  var ageYrs  = days / 365.25;

  var ramadans  = Math.floor(ageYrs);
  var fridays   = Math.floor(days / 7);
  var prayers   = days * 5;
  var laylatul  = ramadans;

  setText('hov-ramadans',    ramadans);
  setText('hov-jumuahs',     fridays.toLocaleString());
  setText('hov-prayer-opps', prayers.toLocaleString());
  setText('hov-laylatul',    laylatul);

  /* Ring — life percentage */
  var AVG_LIFESPAN = 70;
  var pct          = Math.min(100, Math.round((ageYrs / AVG_LIFESPAN) * 100));
  var circumference = 414.69; /* 2π × 66 */

  setText('jsn-ring-pct', pct + '%');
  var ringFill = el('jsn-ring-fill');
  if (ringFill) {
    requestAnimationFrame(function() {
      ringFill.style.strokeDashoffset = circumference - (pct / 100) * circumference;
    });
  }

  /* Remaining */
  var remaining        = Math.max(0, AVG_LIFESPAN - ageYrs);
  var remRamadans      = Math.round(remaining);
  var remJumuahs       = Math.round(remaining * 52);

  setText('jsn-rem-ramadans', '~' + remRamadans);
  setText('jsn-rem-jumuahs',  '~' + remJumuahs.toLocaleString());
}

/* ══════════════════════════════════════
   HOME MUHASABAH (quick 3-question widget)
   ══════════════════════════════════════ */
function initHomeMuhasabah() {
  var today  = getTodayKey();
  var saved  = S.get('muhasabah_' + today) || {};

  var fields = [
    { id: 'hm-q1', key: 'gratitude' },
    { id: 'hm-q2', key: 'mistake'   },
    { id: 'hm-q3', key: 'deed'      }
  ];

  fields.forEach(function(f) {
    var ta = el(f.id);
    if (!ta) return;
    ta.value = saved[f.key] || '';
    ta.addEventListener('input', function() {
      var data  = S.get('muhasabah_' + today) || {};
      data[f.key] = ta.value;
      S.set('muhasabah_' + today, data);
      _updateHomeMuhasabahStatus();
    });
  });

  _updateHomeMuhasabahStatus();
}

function _updateHomeMuhasabahStatus() {
  var today  = getTodayKey();
  var saved  = S.get('muhasabah_' + today) || {};
  var filled = ['gratitude','mistake','deed'].filter(function(k) {
    return (saved[k] || '').trim().length > 0;
  }).length;

  var status = el('hm-save-status');
  if (!status) return;
  if (filled === 0) {
    status.textContent = '';
  } else if (filled < 3) {
    status.textContent = '✓ ' + filled + ' of 3 saved';
  } else {
    status.textContent = '✓ All saved. Alhamdulillah.';
  }
}

/* ══════════════════════════════════════
   THIS DAY IN ISLAMIC HISTORY
   Pulls from WAQTX_HISTORY (history-data.js)
   with dayOfYear matching, falling back to
   a modulo rotation across all events.
   ══════════════════════════════════════ */
function initThisDaySection() {
  var card = el('this-day-card');
  if (!card) return;

  /* Use structured history data if available */
  if (window.WAQTX_HISTORY && WAQTX_HISTORY.getTodayEntry) {
    var entry = WAQTX_HISTORY.getTodayEntry();
    if (entry) {
      _renderThisDayFromHistory(entry);
      return;
    }
  }

  /* Fallback static list (shown if history-data.js not loaded) */
  var FALLBACK = [
    { year: '622 CE · 1 AH', title: 'The Hijrah — A Journey of Faith',
      body: 'The Prophet ﷺ and his companions departed Makkah for Madinah — sacrificing home, wealth, and comfort for the sake of Allah. This migration marked the beginning of the Islamic calendar.',
      reflection: 'The believer is always willing to leave behind what is comfortable for what is right.',
      sources: [] },
    { year: '610 CE · 13 BH', title: 'The First Revelation',
      body: 'In the Cave of Hira, the Angel Jibreel appeared to the Prophet ﷺ with the first verses of the Quran: "Recite in the name of your Lord who created." A single night that changed history forever.',
      reflection: 'Every great journey begins with a single moment of clarity. Be present for yours.',
      sources: [] },
    { year: '630 CE · 8 AH', title: 'The Opening of Makkah',
      body: 'The Prophet ﷺ entered Makkah with ten thousand companions — not as a conqueror, but as a mercy. He forgave those who had persecuted him and his companions for over two decades.',
      reflection: 'Forgiveness at the peak of power is the highest form of character.',
      sources: [] },
    { year: '624 CE · 2 AH', title: 'The Battle of Badr',
      body: 'A Muslim army of 313 faced a Quraysh force of 1,000. Against all odds, they were victorious. The Quran calls it "Yawm al-Furqan" — the Day of Distinction.',
      reflection: 'Numbers do not determine victory. Tawakkul and character do.',
      sources: [] },
    { year: '1258 CE · 656 AH', title: 'The Fall of Baghdad',
      body: 'The Mongols destroyed the Abbasid caliphate and the House of Wisdom. But Islam survived — within a generation, the Mongols themselves had embraced the faith.',
      reflection: 'Institutions can fall. Iman cannot be conquered.',
      sources: [] },
    { year: '1187 CE · 583 AH', title: 'Salahuddin Recaptures Jerusalem',
      body: 'Salahuddin Ayyubi entered Jerusalem peacefully after defeating the Crusaders at Hattin — granting safety to its people where the Crusaders had once shown none.',
      reflection: 'The most powerful statement is not a sword — it is your character when you win.',
      sources: [] }
  ];

  var doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  var entry = FALLBACK[doy % FALLBACK.length];
  _renderThisDayStatic(entry);
}

function _renderThisDayFromHistory(entry) {
  var H = window.WAQTX_HISTORY;

  /* Era band — inject before date */
  var tdYear = el('td-year');
  if (tdYear) {
    var eraLabel = H && H.ERA_LABELS ? (H.ERA_LABELS[entry.era] || entry.era) : entry.era;
    var eraClass = H && H.eraClass  ? H.eraClass(entry.era) : 'era-seerah';
    var dateStr  = entry.date.gregorian;
    if (entry.date.hijri) dateStr += ' \u00b7 ' + entry.date.hijri;
    tdYear.innerHTML =
      '<span class="era-band ' + _escHtml(eraClass) + '" style="display:inline-flex;margin-bottom:6px;">' +
      _escHtml(eraLabel) + '</span><br>' + _escHtml(dateStr);
  }

  /* Title + body */
  setText('td-title', entry.title);
  setText('td-body',  entry.summary);

  /* Reflection — use subtitle as teaser, then a prompt */
  var tdRefl = el('td-reflection');
  if (tdRefl) {
    tdRefl.textContent = entry.subtitle ||
      'What does this moment in Islamic history mean for your life today?';
  }

  /* Source badges */
  var badgeContainer = el('td-sources');
  if (badgeContainer && H) {
    if (entry.sources && entry.sources.length) {
      var badges = entry.sources.slice(0, 3).map(function(src) {
        return '<span class="ev-badge ' + H.evClass(src.type) + '">' +
               '<span class="ev-badge-dot"></span>' +
               _escHtml(H.sourceTypeLabel(src.type)) +
               (src.ref ? ': ' + _escHtml(src.ref.substring(0, 36)) + (src.ref.length > 36 ? '\u2026' : '') : '') +
               '</span>';
      }).join('');
      badgeContainer.innerHTML = badges;
    } else {
      badgeContainer.innerHTML = '';
    }
  }

  /* CTA — links to search page pre-filled with the entry title */
  var tdCta = document.querySelector('#this-day-card .td-cta');
  if (tdCta && entry.id) {
    var searchQ = encodeURIComponent(entry.title.replace(/\s*[\u2014\u2013].*$/, '').trim());
    tdCta.href = 'search.html?q=' + searchQ;
    tdCta.textContent = 'Explore full entry \u2192';
  }
}

function _renderThisDayStatic(entry) {
  if (!entry) return;
  setText('td-year',       entry.year);
  setText('td-title',      entry.title);
  setText('td-body',       entry.body);
  setText('td-reflection', entry.reflection);
}

/* Simple HTML escaper used by This Day renderer */
function _escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ══════════════════════════════════════
   SPIRITUAL PROGRESS SECTION
   ══════════════════════════════════════ */
function initSpiritualProgress() {
  var prayerPct    = _calcConsistency(30);
  var reflectPct   = _calcMuhasabahDays(30);
  var gratitudePct = _calcGratitudeDays(30);
  /* Guard: recalcStreak is defined in core.js — check it exists */
  var streak = (typeof recalcStreak === 'function') ? recalcStreak() : getStreakCount();

  /* IDs match index.html: sp-prayer, sp-reflect, sp-gratitude, sp-streak */
  setText('sp-prayer',    prayerPct + '%');
  setText('sp-reflect',   reflectPct + '%');
  setText('sp-gratitude', gratitudePct + '%');
  setText('sp-streak',    streak);

  _setProgressBar('sp-bar-prayer',    prayerPct);
  _setProgressBar('sp-bar-reflect',   reflectPct);
  _setProgressBar('sp-bar-gratitude', gratitudePct);
}

function _setProgressBar(id, pct) {
  var bar = el(id);
  if (!bar) return;
  requestAnimationFrame(function() {
    bar.style.width = Math.min(100, pct) + '%';
  });
}

/* ══════════════════════════════════════
   GREG DATE IN HERO (top badge)
   ══════════════════════════════════════ */
function initHeroBadge() {
  var now  = new Date();
  var greg = now.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
  setText('hero-greg-date', greg);
  /* Set Hijri date directly (core.js also sets this when prayer times load) */
  if (typeof toHijri === 'function' && typeof hijriStr === 'function') {
    setText('hero-hijri-date', hijriStr(toHijri(now)));
  }
}

/* ══════════════════════════════════════
   BOOT
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  initHeroBadge();
  initHeroDashboard();
  initHomePrayerSection();
  initDailyGuidance();
  initJourneySnapshot();
  initHomeMuhasabah();
  initThisDaySection();
  initSpiritualProgress();

  /* Re-render prayer section every minute */
  setInterval(function() {
    var t = WaqtX.prayer.getCached();
    if (t) {
      _renderPrayerTimeline(t);
      _renderPrayerStatusCards(t);
    }
  }, 60000);
});
