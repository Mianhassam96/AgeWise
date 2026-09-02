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

  /* Modal close */
  var closeBtn = el('hm-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  var overlay = el('history-modal-overlay');
  if (overlay) overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });

  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });
});
