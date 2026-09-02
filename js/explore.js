'use strict';
/* ═══════════════════════════════════════════════
   WaqtX V2A — Islamic History Explorer
   Era system · Search · Filter · Detail Modal
   Requires: js/history-data.js loaded first
   ═══════════════════════════════════════════════ */

/* ── State ── */
var _activeView   = 'grid';   /* 'grid' | 'era' */
var _activeEra    = 'all';
var _activeType   = 'all';
var _searchQuery  = '';
var _currentItem  = null;

var H; /* set on DOMContentLoaded */

/* ══════════════════════════════════════
   ERA CARDS (top of explore page)
   ══════════════════════════════════════ */
function renderEraCards() {
  var container = el('era-cards-container');
  if (!container) return;

  var eras = ['seerah','rashidun','umayyad','abbasid','ottoman','scholars'];
  var icons = {
    seerah:'🌿', rashidun:'⭐', umayyad:'🏛️',
    abbasid:'📜', ottoman:'🕌', scholars:'🔬'
  };

  var html = '';
  eras.forEach(function(era) {
    var meta  = H.ERAS[era];
    var items = H.getEraItems(era);
    var count = items.length;
    html += '<button class="era-card" data-era="' + era + '" aria-label="Explore ' + escHtml(meta.label) + '">';
    html += '<span class="era-card-icon">' + (icons[era] || '📚') + '</span>';
    html += '<span class="era-band ' + H.eraClass(era) + '">' + escHtml(meta.label) + '</span>';
    html += '<span class="era-card-dates">' + escHtml(meta.startYear < 0 ? 'Ancient' : meta.startYear + ' CE') + ' – ' + escHtml(meta.endYear > 3000 ? 'Present' : meta.endYear + ' CE') + '</span>';
    html += '<span class="era-card-count">' + count + ' entries</span>';
    html += '</button>';
  });
  container.innerHTML = html;

  container.querySelectorAll('.era-card').forEach(function(btn) {
    btn.addEventListener('click', function() {
      openEraView(btn.dataset.era);
    });
  });
}

/* ══════════════════════════════════════
   ERA VIEW
   Full era page: overview + timeline + people + places
   ══════════════════════════════════════ */
function openEraView(era) {
  _activeView = 'era';
  _activeEra  = era;

  var panel = el('era-view-panel');
  var gridSection = el('explore-all');
  var eraSection  = el('era-view-section');

  if (gridSection) gridSection.classList.add('hidden');
  if (eraSection)  eraSection.classList.remove('hidden');
  if (panel) panel.innerHTML = buildEraView(era);

  attachEraViewListeners(era);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeEraView() {
  _activeView = 'grid';
  _activeEra  = 'all';

  var gridSection = el('explore-all');
  var eraSection  = el('era-view-section');
  if (gridSection) gridSection.classList.remove('hidden');
  if (eraSection)  eraSection.classList.add('hidden');
}

function buildEraView(era) {
  var meta      = H.ERAS[era];
  var allItems  = H.sortByDate(H.getEraItems(era));
  var events    = allItems.filter(function(i) { return i.type === 'event'; });
  var people    = allItems.filter(function(i) { return i.type === 'person' || i.collection === 'prophets' || i.collection === 'companions' || i.collection === 'scholars'; });
  var places    = allItems.filter(function(i) { return i.type === 'place'; });
  var civs      = allItems.filter(function(i) { return i.type === 'civilization'; });
  var adjacent  = H.getAdjacentEras(era);

  var html = '';

  /* Era header */
  html += '<div class="ev-header">';
  html += '<div class="ev-nav-row">';
  html += '<button class="ev-back-btn" id="ev-back-btn">← Back to all eras</button>';
  html += '<div class="ev-era-nav">';
  if (adjacent.prev) {
    html += '<button class="ev-adj-btn" data-era="' + adjacent.prev.id + '">← ' + escHtml(adjacent.prev.label) + '</button>';
  }
  if (adjacent.next) {
    html += '<button class="ev-adj-btn" data-era="' + adjacent.next.id + '">' + escHtml(adjacent.next.label) + ' →</button>';
  }
  html += '</div></div>';

  html += '<span class="era-band ' + H.eraClass(era) + '" style="margin-bottom:12px;display:inline-flex;">' + escHtml(meta.label) + '</span>';
  html += '<h2 class="ev-era-title">' + escHtml(meta.label) + '</h2>';
  html += '<div class="ev-era-dates">';
  html += escHtml(meta.startYear < 0 ? 'Ancient' : meta.startYear + ' CE');
  html += ' – ';
  html += escHtml(meta.endYear > 3000 ? 'Present' : meta.endYear + ' CE');
  html += '</div>';
  html += '</div>';

  /* Civilizations */
  if (civs.length) {
    html += '<div class="ev-section">';
    html += '<div class="ev-section-title">Civilization</div>';
    civs.forEach(function(civ) {
      html += '<div class="ev-civ-card card card-gold" data-id="' + escHtml(civ.id) + '" role="button" tabindex="0">';
      html += '<div class="hc-title">' + escHtml(civ.title) + '</div>';
      html += '<div class="hc-subtitle">' + escHtml(civ.subtitle || '') + '</div>';
      html += '<p class="hc-summary" style="margin-top:8px;">' + escHtml(civ.summary.substring(0, 200)) + (civ.summary.length > 200 ? '…' : '') + '</p>';
      if (civ.topics && civ.topics.length) {
        html += '<div class="ev-topic-row">';
        civ.topics.slice(0, 6).forEach(function(t) {
          html += '<span class="ev-topic-chip">' + escHtml(t.replace(/-/g,' ')) + '</span>';
        });
        html += '</div>';
      }
      html += '</div>';
    });
    html += '</div>';
  }

  /* Timeline of events */
  if (events.length) {
    html += '<div class="ev-section">';
    html += '<div class="ev-section-title">Timeline</div>';
    html += '<div class="timeline" role="list">';
    events.forEach(function(evt) {
      var featured = evt.certainty === 'established' ? ' featured' : '';
      html += '<div class="timeline-item' + featured + '" data-id="' + escHtml(evt.id) + '" role="listitem button" tabindex="0">';
      html += '<div class="timeline-card">';
      html += '<div class="timeline-date">' + escHtml(evt.date.gregorian) + (evt.date.hijri ? ' · ' + escHtml(evt.date.hijri) : '') + '</div>';
      html += '<div class="timeline-title">' + escHtml(evt.title) + '</div>';
      html += '<div class="timeline-body">' + escHtml(evt.summary.substring(0, 160)) + (evt.summary.length > 160 ? '…' : '') + '</div>';
      if (evt.sources && evt.sources.length) {
        html += '<div class="source-badges" style="margin-top:10px;">';
        evt.sources.slice(0, 3).forEach(function(src) {
          html += '<span class="ev-badge ' + H.evClass(src.type) + '"><span class="ev-badge-dot"></span>' + escHtml(H.sourceTypeLabel(src.type)) + '</span>';
        });
        html += '</div>';
      }
      html += '<div style="margin-top:10px;font-size:0.75rem;color:var(--teal);font-weight:700;">Read full entry →</div>';
      html += '</div></div>';
    });
    html += '</div></div>';
  }

  /* People */
  if (people.length) {
    html += '<div class="ev-section">';
    html += '<div class="ev-section-title">Key Figures</div>';
    html += '<div class="ev-people-grid">';
    people.forEach(function(p) {
      html += '<div class="ev-person-card" data-id="' + escHtml(p.id) + '" role="button" tabindex="0">';
      html += '<div class="ev-person-name">' + escHtml(p.title) + '</div>';
      html += '<div class="ev-person-sub">' + escHtml(p.subtitle || '') + '</div>';
      html += '<div class="ev-person-dates">' + escHtml(p.date.gregorian) + '</div>';
      html += '<div class="ev-person-summary">' + escHtml(p.summary.substring(0, 120)) + '…</div>';
      html += '</div>';
    });
    html += '</div></div>';
  }

  /* Places */
  if (places.length) {
    html += '<div class="ev-section">';
    html += '<div class="ev-section-title">Important Places</div>';
    html += '<div class="ev-places-grid">';
    places.forEach(function(pl) {
      html += '<div class="ev-place-card" data-id="' + escHtml(pl.id) + '" role="button" tabindex="0">';
      html += '<div class="ev-place-name">📍 ' + escHtml(pl.title) + '</div>';
      html += '<div class="ev-place-loc">' + escHtml(pl.location || '') + '</div>';
      html += '<div class="ev-place-summary">' + escHtml(pl.summary.substring(0, 100)) + '…</div>';
      html += '</div>';
    });
    html += '</div></div>';
  }

  /* Era sources note */
  html += '<div class="ev-section">';
  html += '<div class="ev-section-title">On Sources</div>';
  html += '<div class="card" style="font-size:0.85rem;color:var(--text2);line-height:1.8;">';
  html += 'All entries in this era carry source badges — ';
  html += '<span class="ev-badge ev-quran" style="display:inline-flex;vertical-align:middle;"><span class="ev-badge-dot"></span>Quran</span> ';
  html += '<span class="ev-badge ev-hadith" style="display:inline-flex;vertical-align:middle;"><span class="ev-badge-dot"></span>Hadith</span> ';
  html += '<span class="ev-badge ev-classical" style="display:inline-flex;vertical-align:middle;"><span class="ev-badge-dot"></span>Classical</span> ';
  html += '<span class="ev-badge ev-academic" style="display:inline-flex;vertical-align:middle;"><span class="ev-badge-dot"></span>Academic</span>';
  html += '. Click any entry to see full references. Where accounts differ, we say so — marked ';
  html += '<span class="ev-badge ev-disputed" style="display:inline-flex;vertical-align:middle;"><span class="ev-badge-dot"></span>Disputed</span>.';
  html += '</div></div>';

  return html;
}

function attachEraViewListeners(era) {
  var panel = el('era-view-panel');
  if (!panel) return;

  var backBtn = el('ev-back-btn');
  if (backBtn) backBtn.addEventListener('click', closeEraView);

  panel.querySelectorAll('.ev-adj-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { openEraView(btn.dataset.era); });
  });

  panel.querySelectorAll('[data-id]').forEach(function(el2) {
    el2.addEventListener('click',   function() { openModal(el2.dataset.id); });
    el2.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(el2.dataset.id); }
    });
  });
}

/* ══════════════════════════════════════
   CARDS GRID
   ══════════════════════════════════════ */
function renderGrid() {
  var grid  = el('history-grid');
  var empty = el('explore-empty');
  var count = el('explore-count');
  if (!grid) return;

  /* Build pool based on filters */
  var items = H.getAll().filter(function(item) {
    if (_activeType !== 'all' && item.type !== _activeType) return false;
    if (_activeEra  !== 'all' && item.era  !== _activeEra)  return false;
    if (_searchQuery) {
      var q   = _searchQuery.toLowerCase();
      var hay = [item.title, item.subtitle, item.summary,
                 (item.tags||[]).join(' '), (item.topics||[]).join(' ')]
                .filter(Boolean).join(' ').toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });

  items = H.sortByDate(items);

  if (count) {
    count.textContent = items.length + ' entr' + (items.length !== 1 ? 'ies' : 'y') +
      (_searchQuery ? ' matching "' + _searchQuery + '"' : '');
  }

  if (!items.length) {
    grid.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }
  if (empty) empty.classList.add('hidden');

  var html = '';
  items.forEach(function(item) {
    var eraLabel  = H.ERA_LABELS[item.era] || item.era;
    var eraClass  = H.eraClass(item.era);
    var certClass = H.certClass(item.certainty);

    html += '<div class="history-card" data-id="' + escHtml(item.id) + '" role="button" tabindex="0" aria-label="' + escHtml(item.title) + '">';
    html += '<div class="hc-era"><span class="era-band ' + eraClass + '">' + escHtml(eraLabel) + '</span>';
    /* Collection badge */
    if (item.collection && item.collection !== 'events') {
      html += ' <span style="font-size:0.65rem;color:var(--text4);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">' + escHtml(item.collection) + '</span>';
    }
    html += '</div>';
    html += '<div class="hc-date">' + escHtml(item.date.gregorian) + '</div>';
    html += '<div class="hc-title">' + escHtml(item.title) + '</div>';
    if (item.subtitle) html += '<div class="hc-subtitle">' + escHtml(item.subtitle) + '</div>';
    html += '<div class="hc-summary">' + escHtml(item.summary.substring(0, 130)) + (item.summary.length > 130 ? '…' : '') + '</div>';
    if (item.sources && item.sources.length) {
      html += '<div class="source-badges" style="margin-top:8px;">';
      item.sources.slice(0, 2).forEach(function(src) {
        html += '<span class="ev-badge ' + H.evClass(src.type) + '"><span class="ev-badge-dot"></span>' + escHtml(H.sourceTypeLabel(src.type)) + '</span>';
      });
      html += '</div>';
    }
    html += '<div class="hc-footer">';
    html += '<span class="hc-explore">Read entry →</span>';
    html += '<span class="hc-certainty ' + certClass + '">' + escHtml(item.certainty) + '</span>';
    html += '</div>';
    html += '</div>';
  });

  grid.innerHTML = html;

  grid.querySelectorAll('.history-card').forEach(function(card) {
    card.addEventListener('click',   function() { openModal(card.dataset.id); });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.id); }
    });
  });
}

/* ══════════════════════════════════════
   FILTER CONTROLS
   ══════════════════════════════════════ */
function initEraFilter() {
  /* Era chips above timeline */
  var bar = el('era-filter-bar');
  if (!bar) return;

  var urlParams = new URLSearchParams(window.location.search);
  var paramEra  = urlParams.get('filter');
  if (paramEra && paramEra !== 'all') {
    /* If it's an era, open era view directly */
    var eraKeys = Object.keys(H.ERAS);
    if (eraKeys.indexOf(paramEra) > -1) {
      setTimeout(function() { openEraView(paramEra); }, 50);
    }
  }

  bar.querySelectorAll('.filter-chip[data-era]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      bar.querySelectorAll('.filter-chip[data-era]').forEach(function(b) {
        b.classList.remove('active'); b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
      var era = btn.dataset.era;
      if (era === 'all') { _activeEra = 'all'; renderGrid(); }
      else { openEraView(era); }
    });
  });
}

function initTypeFilter() {
  var bar = el('explore-filter-bar');
  if (!bar) return;

  var urlParams = new URLSearchParams(window.location.search);
  var paramType = urlParams.get('type');
  var collectionTypeMap = {
    seerah: 'event', companions: 'person', caliphates: 'dynasty',
    scholars: 'person', places: 'place', prophets: 'person',
    civilizations: 'civilization'
  };
  if (paramType && collectionTypeMap[paramType]) {
    _activeType = collectionTypeMap[paramType];
    var btn = bar.querySelector('[data-type="' + _activeType + '"]');
    if (btn) { bar.querySelectorAll('.filter-chip[data-type]').forEach(function(b) { b.classList.remove('active'); }); btn.classList.add('active'); }
  }

  bar.querySelectorAll('.filter-chip[data-type]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      bar.querySelectorAll('.filter-chip[data-type]').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      _activeType = btn.dataset.type;
      renderGrid();
    });
  });
}

function initSearch() {
  var input = el('explore-search');
  if (!input) return;
  var timer;
  input.addEventListener('input', function() {
    clearTimeout(timer);
    timer = setTimeout(function() {
      _searchQuery = input.value.trim();
      /* Switch back to grid view if in era view */
      if (_activeView === 'era') closeEraView();
      renderGrid();
    }, 200);
  });
}

function initStatsBar() {
  var bar = el('explore-stats-bar');
  if (!bar || !H.getStats) return;
  var s = H.getStats();
  bar.textContent = s.total + ' entries across ' +
    s.events + ' events · ' + s.prophets + ' prophets · ' +
    s.companions + ' companions · ' + s.scholars + ' scholars · ' +
    s.dynasties + ' dynasties · ' + s.civilizations + ' civilizations · ' +
    s.places + ' places';
}

/* ══════════════════════════════════════
   DETAIL MODAL
   ══════════════════════════════════════ */
function openModal(id) {
  var item = H.findById(id);
  if (!item) return;
  _currentItem = item;

  var overlay    = el('history-modal-overlay');
  var titleEl    = el('modal-title');
  var subtitleEl = el('modal-subtitle');
  var dateRow    = el('modal-date-row');
  var body       = el('modal-body');
  if (!overlay) return;

  if (titleEl)    titleEl.textContent    = item.title;
  if (subtitleEl) subtitleEl.textContent = item.subtitle || '';

  if (dateRow) {
    var eraLabel = H.ERA_LABELS[item.era] || item.era;
    var eraClass = H.eraClass(item.era);
    var certClass = H.certClass(item.certainty);
    dateRow.innerHTML =
      '<span class="era-band ' + eraClass + '">' + escHtml(eraLabel) + '</span>' +
      '<span class="hm-date">' + escHtml(item.date.gregorian) +
        (item.date.hijri ? ' · ' + escHtml(item.date.hijri) : '') + '</span>' +
      (item.location ? '<span class="hm-location">📍 ' + escHtml(item.location) + '</span>' : '') +
      '<span class="hc-certainty ' + certClass + '" style="margin-left:auto;">' + escHtml(item.certainty) + '</span>';
  }

  var html = '';

  /* Summary */
  html += '<div class="hm-section"><div class="hm-section-title">Overview</div>';
  html += '<p class="hm-text">' + escHtml(item.summary) + '</p></div>';

  /* Details */
  if (item.details) {
    html += '<div class="hm-section"><div class="hm-section-title">Historical Context</div>';
    html += '<p class="hm-text">' + escHtml(item.details) + '</p></div>';
  }

  /* Topics */
  if (item.topics && item.topics.length) {
    html += '<div class="hm-section"><div class="hm-section-title">Topics</div>';
    html += '<div class="ev-topic-row">';
    item.topics.forEach(function(t) {
      html += '<span class="ev-topic-chip">' + escHtml(t.replace(/-/g,' ')) + '</span>';
    });
    html += '</div></div>';
  }

  /* Key people */
  if (item.people && item.people.length) {
    html += '<div class="hm-section"><div class="hm-section-title">Key Figures</div>';
    html += '<div class="hm-people-list">';
    item.people.forEach(function(pid) {
      var p     = H.findById(pid);
      var label = p ? p.title : _formatId(pid);
      var clickable = p ? 'cursor:pointer;color:var(--teal);border-color:rgba(20,184,166,0.3);' : 'cursor:default;';
      html += '<span class="hm-person-tag" style="' + clickable + '" data-pid="' + escHtml(pid) + '">' + escHtml(label) + '</span>';
    });
    html += '</div></div>';
  }

  /* Related events */
  if (item.relatedEvents && item.relatedEvents.length) {
    var relEvts = item.relatedEvents.map(function(id) { return H.findById(id); }).filter(Boolean);
    if (relEvts.length) {
      html += '<div class="hm-section"><div class="hm-section-title">Related Events</div>';
      html += '<div class="hm-people-list">';
      relEvts.forEach(function(e) {
        html += '<span class="hm-person-tag" style="cursor:pointer;color:var(--gold);border-color:var(--border2);" data-pid="' + escHtml(e.id) + '">' + escHtml(e.title) + '</span>';
      });
      html += '</div></div>';
    }
  }

  /* Reflection */
  html += '<div class="hm-section"><div class="hm-section-title">Reflection</div>';
  html += '<p class="hm-lesson">What does this moment in Islamic history say to you today?</p></div>';

  /* Sources */
  if (item.sources && item.sources.length) {
    html += '<div class="hm-section"><div class="hm-section-title">Sources &amp; Evidence</div>';
    html += '<div class="source-badges" style="margin-bottom:14px;">';
    item.sources.forEach(function(src) {
      html += '<span class="ev-badge ' + H.evClass(src.type) + '"><span class="ev-badge-dot"></span>' + escHtml(H.sourceTypeLabel(src.type)) + '</span>';
    });
    html += '</div>';
    html += '<div class="sources-panel">';
    html += '<button class="sources-toggle" id="sources-toggle-btn" aria-expanded="false">View full sources <span class="sources-toggle-arrow">▼</span></button>';
    html += '<div class="sources-list" id="sources-list-inner">';
    item.sources.forEach(function(src) {
      html += '<div class="source-item">';
      html += '<div><div class="source-item-ref">';
      html += '<span class="ev-badge ' + H.evClass(src.type) + '" style="margin-right:8px;"><span class="ev-badge-dot"></span>' + escHtml(H.sourceTypeLabel(src.type)) + '</span>';
      html += escHtml(src.ref) + '</div>';
      if (src.note) html += '<div class="source-item-note">' + escHtml(src.note) + '</div>';
      html += '</div></div>';
    });
    html += '</div></div></div>';
  }

  /* Certainty note */
  var certMessages = {
    established: '✅ This entry is <strong>established</strong> — confirmed by Quran and/or mutawatir hadith.',
    probable:    '📋 This entry is <strong>probable</strong> — well-attested in classical scholarly sources.',
    disputed:    '⚠️ This entry contains <strong>disputed</strong> elements — different historical accounts exist. We have noted the disagreements.'
  };
  html += '<div class="hm-section">';
  html += '<div class="hc-certainty ' + H.certClass(item.certainty) + '" style="padding:10px 16px;border-radius:8px;font-size:0.82rem;line-height:1.6;">';
  html += certMessages[item.certainty] || '';
  html += '</div></div>';

  if (body) body.innerHTML = html;

  /* Event delegation for person/event tags */
  overlay.querySelectorAll('[data-pid]').forEach(function(tag) {
    tag.addEventListener('click', function() {
      var linked = H.findById(tag.dataset.pid);
      if (linked) openModal(tag.dataset.pid);
    });
  });

  /* Sources toggle */
  var stBtn  = document.getElementById('sources-toggle-btn');
  var stList = document.getElementById('sources-list-inner');
  if (stBtn && stList) {
    stBtn.addEventListener('click', function() {
      var open = stList.classList.toggle('open');
      stBtn.classList.toggle('open', open);
      stBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  var modal = el('history-modal');
  if (modal) modal.scrollTop = 0;
}

function closeModal() {
  var overlay = el('history-modal-overlay');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
  _currentItem = null;
}

/* ══════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════ */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
}
function _formatId(id) {
  return id.split('-').map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
}

/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  if (!window.WAQTX_HISTORY) { console.warn('WaqtX: history-data.js not loaded'); return; }
  H = window.WAQTX_HISTORY;

  renderEraCards();
  initEraFilter();
  initTypeFilter();
  initSearch();
  initStatsBar();
  renderGrid();
  renderVisTimeline();
  renderWorldMap();
  initPeopleExplorer();

  /* Modal close */
  var closeBtn = el('hm-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  var overlay = el('history-modal-overlay');
  if (overlay) overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });

  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });
});

/* ══════════════════════════════════════
   VISUAL 1,400-YEAR TIMELINE
   ══════════════════════════════════════ */
function renderVisTimeline() {
  var inner = el('vis-timeline-inner');
  if (!inner || !H) return;

  /* All events sorted by startDate */
  var events = H.sortByDate(
    H.events.concat(H.dynasties).filter(function(e) {
      return typeof e.startDate === 'number' && e.startDate > 0;
    })
  );
  if (!events.length) return;

  var MIN_YEAR = 570;
  var MAX_YEAR = 1924;
  var SPAN     = MAX_YEAR - MIN_YEAR;
  var WIDTH    = Math.max(inner.clientWidth || 1200, 1400);
  var PAD      = 60;
  var USABLE   = WIDTH - PAD * 2;

  function toX(year) {
    return PAD + ((year - MIN_YEAR) / SPAN) * USABLE;
  }

  /* Era band definitions */
  var eraBands = [
    { era:'seerah',    start:570,  end:632,  label:'Seerah' },
    { era:'rashidun',  start:632,  end:661,  label:'Rashidun' },
    { era:'umayyad',   start:661,  end:750,  label:'Umayyad' },
    { era:'abbasid',   start:750,  end:1258, label:'Abbasid' },
    { era:'ottoman',   start:1299, end:1924, label:'Ottoman' }
  ];
  var bandColors = {
    seerah:'var(--teal)', rashidun:'#4ade80', umayyad:'#a78bfa',
    abbasid:'#60a5fa', ottoman:'#f87171'
  };

  var html = '';

  /* Era bands */
  eraBands.forEach(function(band) {
    var x1 = toX(band.start);
    var x2 = toX(Math.min(band.end, MAX_YEAR));
    var w  = x2 - x1;
    var midX = x1 + w / 2;
    html += '<div class="vis-era-band" style="left:' + x1 + 'px;width:' + w + 'px;background:' + (bandColors[band.era]||'var(--gold)') + ';" title="' + escHtml(band.label) + '"></div>';
    html += '<div class="vis-era-label" style="left:' + midX + 'px;">' + escHtml(band.label) + '</div>';
  });

  /* Spine */
  html += '<div class="vis-spine"></div>';

  /* Axis year markers */
  var axisYears = [600, 650, 700, 750, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900];
  axisYears.forEach(function(y) {
    if (y < MIN_YEAR || y > MAX_YEAR) return;
    html += '<div class="vis-axis-year" style="left:' + toX(y) + 'px;">' + y + '</div>';
  });

  /* Event nodes — alternate above/below to avoid overlap */
  events.forEach(function(evt, i) {
    var y = evt.startDate;
    if (y < MIN_YEAR || y > MAX_YEAR + 50) return;
    var xPos     = toX(Math.min(y, MAX_YEAR));
    var side     = i % 2 === 0 ? 'above' : 'below';
    var featured = evt.certainty === 'established' ? ' featured' : '';
    var shortTitle = evt.title.replace(/\s*[\u2014\u2013\-].*$/, '').substring(0, 20);

    html += '<div class="vis-node ' + side + featured + '" data-id="' + escHtml(evt.id) + '"';
    html += ' style="left:' + xPos + 'px;" tabindex="0" role="button"';
    html += ' aria-label="' + escHtml(evt.title) + ' — ' + escHtml(evt.date.gregorian) + '">';
    html += '<div class="vis-node-dot"></div>';
    if (side === 'above') {
      html += '<div class="vis-node-label above">' + escHtml(shortTitle) + '</div>';
      html += '<div class="vis-node-year above">' + y + ' CE</div>';
    } else {
      html += '<div class="vis-node-year below">' + y + ' CE</div>';
      html += '<div class="vis-node-label below">' + escHtml(shortTitle) + '</div>';
    }
    html += '</div>';
  });

  inner.innerHTML = html;

  /* Tooltip */
  var tooltip = el('vis-tooltip');

  inner.querySelectorAll('.vis-node').forEach(function(node) {
    var id = node.dataset.id;

    node.addEventListener('mouseenter', function(e) {
      var item = H.findById(id);
      if (!item || !tooltip) return;
      tooltip.innerHTML = '<div class="vis-tooltip-title">' + escHtml(item.title) + '</div>' +
        '<div class="vis-tooltip-date">' + escHtml(item.date.gregorian) + '</div>';
      tooltip.classList.add('show');
    });
    node.addEventListener('mousemove', function(e) {
      if (!tooltip) return;
      tooltip.style.left = (e.clientX + 14) + 'px';
      tooltip.style.top  = (e.clientY - 36) + 'px';
    });
    node.addEventListener('mouseleave', function() {
      if (tooltip) tooltip.classList.remove('show');
    });
    node.addEventListener('click', function() { openModal(id); });
    node.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(id); }
    });
  });

  /* Drag-to-scroll */
  var wrap = el('vis-timeline-wrap');
  if (wrap) {
    var isDown = false, startX, scrollLeft;
    wrap.addEventListener('mousedown', function(e) {
      if (e.target.closest('.vis-node')) return;
      isDown = true;
      startX = e.pageX - wrap.offsetLeft;
      scrollLeft = wrap.scrollLeft;
      wrap.style.cursor = 'grabbing';
    });
    wrap.addEventListener('mouseleave', function() { isDown = false; wrap.style.cursor = 'grab'; });
    wrap.addEventListener('mouseup',    function() { isDown = false; wrap.style.cursor = 'grab'; });
    wrap.addEventListener('mousemove',  function(e) {
      if (!isDown) return;
      e.preventDefault();
      var x    = e.pageX - wrap.offsetLeft;
      var walk = (x - startX) * 1.5;
      wrap.scrollLeft = scrollLeft - walk;
    });
  }
}

/* ══════════════════════════════════════
   ISLAMIC WORLD MAP
   SVG-based clickable city map
   ══════════════════════════════════════ */
var MAP_CITIES = [
  { id:'makkah',    label:'Makkah',     cx:560, cy:250, historyId:'makkah',       note:'Holiest city in Islam' },
  { id:'madinah',   label:'Madinah',    cx:555, cy:230, historyId:'madinah',      note:'City of the Prophet ﷺ' },
  { id:'jerusalem', label:'Jerusalem',  cx:520, cy:200, historyId:'jerusalem',    note:'Third holiest city' },
  { id:'damascus',  label:'Damascus',   cx:525, cy:190, historyId:'umayyad-caliphate', note:'Umayyad capital' },
  { id:'baghdad',   label:'Baghdad',    cx:565, cy:200, historyId:'baghdad',      note:'Abbasid capital' },
  { id:'cairo',     label:'Cairo',      cx:505, cy:220, historyId:'civ-cairo-mamluk', note:'Cairo & Al-Azhar' },
  { id:'cordoba',   label:'Córdoba',    cx:430, cy:185, historyId:'cordoba',      note:'Jewel of al-Andalus' },
  { id:'istanbul',  label:'Istanbul',   cx:515, cy:175, historyId:'civ-istanbul-ottoman', note:'Ottoman capital' },
  { id:'bukhara',   label:'Bukhara',    cx:625, cy:175, historyId:'civ-bukhara-scholars', note:'City of scholars' },
  { id:'samarkand', label:'Samarkand',  cx:635, cy:168, historyId:'civ-bukhara-scholars', note:'Timur\'s capital' },
  { id:'delhi',     label:'Delhi',      cx:665, cy:222, historyId:'abbasid-caliphate', note:'Mughal heartland' }
];

function renderWorldMap() {
  var wrap = el('world-map-svg-wrap');
  if (!wrap) return;

  /* Simple geographic SVG — schematic, not precise */
  var svgW = 900, svgH = 420;

  var landPaths = [
    /* Europe */
    'M 370,100 L 440,95 L 480,105 L 490,130 L 460,145 L 440,140 L 420,150 L 400,145 L 375,130 Z',
    /* Iberian Peninsula */
    'M 390,140 L 440,138 L 450,155 L 430,175 L 410,178 L 395,165 L 388,150 Z',
    /* North Africa */
    'M 390,195 L 560,195 L 560,260 L 500,270 L 440,265 L 400,250 Z',
    /* Arabian Peninsula */
    'M 540,215 L 590,210 L 605,235 L 595,270 L 570,280 L 545,270 L 535,250 Z',
    /* Turkey / Anatolia */
    'M 495,165 L 545,160 L 570,170 L 565,185 L 535,192 L 510,188 L 495,178 Z',
    /* Levant */
    'M 515,185 L 535,183 L 540,210 L 525,215 L 510,205 Z',
    /* Persia / Iran */
    'M 565,175 L 615,170 L 625,195 L 610,215 L 580,220 L 562,205 Z',
    /* Central Asia */
    'M 615,155 L 670,148 L 680,175 L 655,182 L 630,178 L 614,168 Z',
    /* South Asia */
    'M 640,190 L 700,190 L 710,230 L 690,250 L 660,245 L 640,220 Z'
  ];

  var html = '<svg viewBox="0 0 ' + svgW + ' ' + svgH + '" xmlns="http://www.w3.org/2000/svg" class="world-map-svg" role="img" aria-label="Islamic world map">';

  /* Ocean background */
  html += '<rect width="' + svgW + '" height="' + svgH + '" fill="rgba(20,184,166,0.04)" rx="12"/>';

  /* Land masses */
  landPaths.forEach(function(d) {
    html += '<path d="' + d + '" fill="rgba(201,168,76,0.12)" stroke="rgba(201,168,76,0.25)" stroke-width="1"/>';
  });

  /* Trade/connection lines */
  var connections = [
    [560,240, 565,200], /* Makkah-Baghdad */
    [560,240, 505,220], /* Makkah-Cairo */
    [560,240, 520,200], /* Makkah-Jerusalem */
    [565,200, 520,200], /* Baghdad-Jerusalem */
    [520,200, 515,175], /* Jerusalem-Istanbul */
    [565,200, 625,175], /* Baghdad-Bukhara */
    [515,175, 430,185], /* Istanbul-Cordoba */
    [505,220, 430,185]  /* Cairo-Cordoba */
  ];
  connections.forEach(function(c) {
    html += '<line x1="' + c[0] + '" y1="' + c[1] + '" x2="' + c[2] + '" y2="' + c[3] + '"';
    html += ' stroke="rgba(201,168,76,0.12)" stroke-width="1" stroke-dasharray="3 4"/>';
  });

  /* City markers */
  MAP_CITIES.forEach(function(city) {
    html += '<g class="map-city-btn" data-city-id="' + city.id + '" tabindex="0" role="button" aria-label="' + escHtml(city.label) + ' — ' + escHtml(city.note) + '">';
    html += '<circle class="map-city-pulse" cx="' + city.cx + '" cy="' + city.cy + '" r="6" style="animation-delay:' + (Math.random()*2).toFixed(1) + 's"/>';
    html += '<circle class="map-city-dot" cx="' + city.cx + '" cy="' + city.cy + '" r="5"/>';
    /* Label offset to avoid overlap */
    var lx = city.cx + 9, ly = city.cy + 4;
    if (city.id === 'madinah')   { ly = city.cy - 7; }
    if (city.id === 'damascus')  { lx = city.cx - 55; }
    if (city.id === 'samarkand') { ly = city.cy - 7; }
    if (city.id === 'cordoba')   { lx = city.cx - 52; }
    html += '<text class="map-city-label" x="' + lx + '" y="' + ly + '">' + escHtml(city.label) + '</text>';
    html += '</g>';
  });

  /* Scale bar */
  html += '<text x="30" y="' + (svgH - 15) + '" font-size="8" fill="rgba(248,250,252,0.2)" font-family="Inter,sans-serif">Islamic World — schematic, not to scale</text>';

  html += '</svg>';
  wrap.innerHTML = html;

  /* City click handlers */
  wrap.querySelectorAll('.map-city-btn').forEach(function(btn) {
    btn.addEventListener('click',   function() { showMapCity(btn.dataset.cityId); });
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showMapCity(btn.dataset.cityId); }
    });
  });
}

function showMapCity(cityId) {
  var city    = MAP_CITIES.find(function(c) { return c.id === cityId; });
  if (!city) return;
  var item    = H.findById(city.historyId);

  var placeholder = el('map-placeholder');
  var content     = el('map-info-content');
  var titleEl     = el('map-info-title');
  var subtitleEl  = el('map-info-subtitle');
  var summaryEl   = el('map-info-summary');
  var linkEl      = el('map-info-link');

  if (placeholder) placeholder.style.display = 'none';
  if (content)     content.classList.add('show');

  if (titleEl)    titleEl.textContent   = item ? item.title : city.label;
  if (subtitleEl) subtitleEl.textContent = city.note;
  if (summaryEl)  summaryEl.textContent  = item ? item.summary.substring(0, 180) + '…' : '';
  if (linkEl && item) {
    linkEl.textContent = 'Read full entry →';
    linkEl.onclick = function(e) { e.preventDefault(); openModal(city.historyId); };
  }
}

/* ══════════════════════════════════════
   PEOPLE EXPLORER
   Prophets / Companions / Scholars tabs
   ══════════════════════════════════════ */
var PERSON_ICONS = {
  prophets:   '☪',
  companions: '⭐',
  scholars:   '📜',
  default:    '👤'
};

function renderPeopleGrid(collection, containerId) {
  var container = el(containerId);
  if (!container || !H) return;

  var items = H[collection] || [];
  if (!items.length) {
    container.innerHTML = '<p style="color:var(--text3);text-align:center;padding:40px 0;">No entries yet.</p>';
    return;
  }

  var html = '';
  items.forEach(function(person) {
    var icon = PERSON_ICONS[collection] || PERSON_ICONS.default;
    var eraClass = H.eraClass(person.era);
    var certClass = H.certClass(person.certainty);

    html += '<div class="person-card" data-id="' + escHtml(person.id) + '" tabindex="0" role="button" aria-label="' + escHtml(person.title) + '">';
    html += '<div class="person-card-header">';
    html += '<div class="person-avatar" aria-hidden="true">' + icon + '</div>';
    html += '<div class="person-info">';
    html += '<div class="person-name">' + escHtml(person.title) + '</div>';
    html += '<div class="person-subtitle">' + escHtml(person.subtitle || '') + '</div>';
    html += '<div class="person-dates">' + escHtml(person.date.gregorian) + '</div>';
    html += '</div></div>';
    html += '<div class="person-summary">' + escHtml(person.summary.substring(0, 140)) + (person.summary.length > 140 ? '…' : '') + '</div>';

    /* Source badges (first 2) */
    if (person.sources && person.sources.length) {
      html += '<div class="source-badges">';
      person.sources.slice(0, 2).forEach(function(src) {
        html += '<span class="ev-badge ' + H.evClass(src.type) + '"><span class="ev-badge-dot"></span>' + escHtml(H.sourceTypeLabel(src.type)) + '</span>';
      });
      html += '</div>';
    }

    html += '<div class="person-footer">';
    html += '<span class="hc-certainty ' + certClass + '">' + escHtml(person.certainty) + '</span>';
    html += '<span class="person-read">Read entry →</span>';
    html += '</div>';
    html += '</div>';
  });

  container.innerHTML = html;

  container.querySelectorAll('.person-card').forEach(function(card) {
    card.addEventListener('click',   function() { openModal(card.dataset.id); });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.id); }
    });
  });
}

function initPeopleExplorer() {
  renderPeopleGrid('prophets',   'people-grid-prophets');
  renderPeopleGrid('companions', 'people-grid-companions');
  renderPeopleGrid('scholars',   'people-grid-scholars');

  var tabs = document.querySelectorAll('.people-tab');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        var panel = el('tab-' + t.dataset.tab);
        if (panel) panel.classList.remove('active');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      var activePanel = el('tab-' + tab.dataset.tab);
      if (activePanel) activePanel.classList.add('active');
    });
  });
}
