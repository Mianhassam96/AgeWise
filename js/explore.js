'use strict';
/* ═══════════════════════════════════════════════
   WaqtX V2 — Islamic History Explorer
   Timeline · Search · Filter · Detail Modal
   ═══════════════════════════════════════════════ */

/* ── State ── */
var _eraFilter  = 'all';
var _typeFilter = 'all';
var _searchQuery = '';
var _currentItem = null;

/* ── Shorthand ── */
var H = window.WAQTX_HISTORY;

/* ══════════════════════════════════════
   TIMELINE RENDER
   ══════════════════════════════════════ */
function renderTimeline(era) {
  var container = document.getElementById('history-timeline');
  if (!container || !H) return;

  /* Get events only, sorted by gregorian year */
  var items = H.events.concat(H.dynasties).filter(function(item) {
    if (era === 'all') return true;
    return item.era === era;
  });

  /* Sort by rough gregorian year extracted from date string */
  items.sort(function(a, b) {
    return extractYear(a.date.gregorian) - extractYear(b.date.gregorian);
  });

  if (!items.length) {
    container.innerHTML = '<div style="text-align:center;padding:40px 0;color:var(--text3);">No events for this era yet.</div>';
    return;
  }

  var html = '';
  items.forEach(function(item) {
    var eraClass = H.eraClass(item.era);
    var eraLabel = H.ERA_LABELS[item.era] || item.era;
    var certClass = H.certClass(item.certainty);
    var certLabel = item.certainty.charAt(0).toUpperCase() + item.certainty.slice(1);
    var featured = item.type === 'event' && item.certainty === 'established' ? ' featured' : '';

    html += '<div class="timeline-item' + featured + '" data-id="' + escHtml(item.id) + '" role="button" tabindex="0" aria-label="' + escHtml(item.title) + '">';
    html += '<div class="timeline-card">';
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">';
    html += '<span class="era-band ' + eraClass + '">' + escHtml(eraLabel) + '</span>';
    html += '<span class="hc-certainty ' + certClass + '">' + escHtml(certLabel) + '</span>';
    html += '</div>';
    html += '<div class="timeline-date">' + escHtml(item.date.gregorian);
    if (item.date.hijri) html += ' &nbsp;·&nbsp; ' + escHtml(item.date.hijri);
    html += '</div>';
    html += '<div class="timeline-title">' + escHtml(item.title) + '</div>';
    if (item.subtitle) html += '<div class="timeline-body" style="font-size:0.8rem;color:var(--gold);margin-bottom:8px;">' + escHtml(item.subtitle) + '</div>';
    html += '<div class="timeline-body">' + escHtml(item.summary.substring(0, 160)) + (item.summary.length > 160 ? '…' : '') + '</div>';

    /* Source badges (first 3) */
    if (item.sources && item.sources.length) {
      html += '<div class="source-badges" style="margin-top:12px;">';
      item.sources.slice(0, 3).forEach(function(src) {
        html += '<span class="ev-badge ' + H.evClass(src.type) + '">';
        html += '<span class="ev-badge-dot"></span>';
        html += escHtml(H.sourceTypeLabel(src.type));
        html += '</span>';
      });
      html += '</div>';
    }
    html += '<div style="margin-top:12px;font-size:0.75rem;font-weight:700;color:var(--teal);">Explore full entry →</div>';
    html += '</div></div>';
  });

  container.innerHTML = html;
  attachTimelineListeners(container);
}

function attachTimelineListeners(container) {
  var items = container.querySelectorAll('.timeline-item');
  items.forEach(function(el) {
    el.addEventListener('click', function() { openModal(el.dataset.id); });
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(el.dataset.id); }
    });
  });
}

/* ══════════════════════════════════════
   CARDS GRID RENDER
   ══════════════════════════════════════ */
function renderGrid() {
  var grid  = document.getElementById('history-grid');
  var empty = document.getElementById('explore-empty');
  var count = document.getElementById('explore-count');
  if (!grid || !H) return;

  var items = H.getAll().filter(function(item) {
    if (_typeFilter !== 'all' && item.type !== _typeFilter) return false;
    if (_eraFilter  !== 'all' && item.era  !== _eraFilter)  return false;
    if (_searchQuery) {
      var q = _searchQuery.toLowerCase();
      var hay = (item.title + ' ' + (item.subtitle||'') + ' ' +
                 (item.summary||'') + ' ' + (item.tags||[]).join(' ')).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });

  if (count) {
    count.textContent = items.length + ' item' + (items.length !== 1 ? 's' : '') +
      (_searchQuery ? ' for "' + _searchQuery + '"' : '');
  }

  if (!items.length) {
    grid.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }
  if (empty) empty.classList.add('hidden');

  var html = '';
  items.forEach(function(item) {
    var eraClass = H.eraClass(item.era);
    var eraLabel = H.ERA_LABELS[item.era] || item.era;
    var certClass = H.certClass(item.certainty);

    html += '<div class="history-card" data-id="' + escHtml(item.id) + '" role="button" tabindex="0" aria-label="' + escHtml(item.title) + '">';
    html += '<div class="hc-era"><span class="era-band ' + eraClass + '">' + escHtml(eraLabel) + '</span></div>';
    html += '<div class="hc-date">' + escHtml(item.date.gregorian) + '</div>';
    html += '<div class="hc-title">' + escHtml(item.title) + '</div>';
    if (item.subtitle) html += '<div class="hc-subtitle">' + escHtml(item.subtitle) + '</div>';
    html += '<div class="hc-summary">' + escHtml(item.summary.substring(0, 140)) + (item.summary.length > 140 ? '…' : '') + '</div>';

    if (item.sources && item.sources.length) {
      html += '<div class="source-badges" style="margin-top:8px;">';
      item.sources.slice(0, 2).forEach(function(src) {
        html += '<span class="ev-badge ' + H.evClass(src.type) + '"><span class="ev-badge-dot"></span>' + escHtml(H.sourceTypeLabel(src.type)) + '</span>';
      });
      html += '</div>';
    }

    html += '<div class="hc-footer">';
    html += '<span class="hc-explore">Explore →</span>';
    html += '<span class="hc-certainty ' + certClass + '">' + escHtml(item.certainty) + '</span>';
    html += '</div>';
    html += '</div>';
  });

  grid.innerHTML = html;
  attachGridListeners(grid);
}

function attachGridListeners(grid) {
  var cards = grid.querySelectorAll('.history-card');
  cards.forEach(function(card) {
    card.addEventListener('click', function() { openModal(card.dataset.id); });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.id); }
    });
  });
}

/* ══════════════════════════════════════
   DETAIL MODAL
   ══════════════════════════════════════ */
function openModal(id) {
  var item = H.findById(id);
  if (!item) return;
  _currentItem = item;

  var overlay = document.getElementById('history-modal-overlay');
  var titleEl = document.getElementById('modal-title');
  var subtitleEl = document.getElementById('modal-subtitle');
  var dateRow = document.getElementById('modal-date-row');
  var body = document.getElementById('modal-body');
  if (!overlay) return;

  /* Header */
  if (titleEl)    titleEl.textContent    = item.title;
  if (subtitleEl) subtitleEl.textContent = item.subtitle || '';
  if (dateRow) {
    var eraLabel = H.ERA_LABELS[item.era] || item.era;
    var eraClass = H.eraClass(item.era);
    dateRow.innerHTML =
      '<span class="era-band ' + eraClass + '">' + escHtml(eraLabel) + '</span>' +
      '<span class="hm-date">' + escHtml(item.date.gregorian) +
        (item.date.hijri ? ' · ' + escHtml(item.date.hijri) : '') + '</span>' +
      (item.location ? '<span class="hm-location">📍 ' + escHtml(item.location) + '</span>' : '');
  }

  /* Body */
  var html = '';

  /* Summary */
  html += '<div class="hm-section">';
  html += '<div class="hm-section-title">What Happened</div>';
  html += '<p class="hm-text">' + escHtml(item.summary) + '</p>';
  html += '</div>';

  /* Details */
  if (item.details) {
    html += '<div class="hm-section">';
    html += '<div class="hm-section-title">Historical Context</div>';
    html += '<p class="hm-text">' + escHtml(item.details) + '</p>';
    html += '</div>';
  }

  /* Key people */
  if (item.people && item.people.length) {
    html += '<div class="hm-section">';
    html += '<div class="hm-section-title">Key People</div>';
    html += '<div class="hm-people-list">';
    item.people.forEach(function(pid) {
      var p = H.findById(pid);
      var label = p ? p.title : formatId(pid);
      html += '<span class="hm-person-tag" style="cursor:' + (p ? 'pointer' : 'default') + '" data-pid="' + escHtml(pid) + '">' + escHtml(label) + '</span>';
    });
    html += '</div></div>';
  }

  /* Related events */
  if (item.relatedEvents && item.relatedEvents.length) {
    html += '<div class="hm-section">';
    html += '<div class="hm-section-title">Related Events</div>';
    html += '<div class="hm-people-list">';
    item.relatedEvents.forEach(function(eid) {
      var e = H.findById(eid);
      if (!e) return;
      html += '<span class="hm-person-tag" style="cursor:pointer;color:var(--teal);border-color:rgba(20,184,166,0.3);" data-pid="' + escHtml(eid) + '">' + escHtml(e.title) + '</span>';
    });
    html += '</div></div>';
  }

  /* Lesson / reflection */
  html += '<div class="hm-section">';
  html += '<div class="hm-section-title">Reflection</div>';
  html += '<p class="hm-lesson">What does this moment in history say to you today?</p>';
  html += '</div>';

  /* Sources */
  if (item.sources && item.sources.length) {
    html += '<div class="hm-section">';
    html += '<div class="hm-section-title">Sources &amp; Evidence</div>';
    html += '<div class="source-badges" style="margin-bottom:16px;">';
    item.sources.forEach(function(src) {
      html += '<span class="ev-badge ' + H.evClass(src.type) + '"><span class="ev-badge-dot"></span>' + escHtml(H.sourceTypeLabel(src.type)) + '</span>';
    });
    html += '</div>';
    html += '<div class="sources-panel">';
    html += '<button class="sources-toggle" id="sources-toggle-btn" aria-expanded="false">';
    html += 'View Sources <span class="sources-toggle-arrow">▼</span>';
    html += '</button>';
    html += '<div class="sources-list" id="sources-list-inner">';
    item.sources.forEach(function(src) {
      html += '<div class="source-item">';
      html += '<div><div class="source-item-ref">' + escHtml(src.ref) + '</div>';
      if (src.note) html += '<div class="source-item-note">' + escHtml(src.note) + '</div>';
      html += '</div></div>';
    });
    html += '</div></div></div>';
  }

  /* Certainty note */
  html += '<div class="hm-section">';
  var certMap = {
    established: 'This entry is <strong>established</strong> — confirmed by Quran and/or mutawatir hadith.',
    probable:    'This entry is <strong>probable</strong> — well-attested in classical sources with scholarly consensus.',
    disputed:    'This entry contains <strong>disputed</strong> elements — different historical accounts exist. We have noted the disagreements.'
  };
  var certClass = H.certClass(item.certainty);
  html += '<div class="hc-certainty ' + certClass + '" style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:8px;font-size:0.8rem;">';
  html += certMap[item.certainty] || '';
  html += '</div></div>';

  if (body) body.innerHTML = html;

  /* Attach person/event navigation inside modal */
  var tags = overlay.querySelectorAll('[data-pid]');
  tags.forEach(function(tag) {
    tag.addEventListener('click', function() {
      var pid = tag.dataset.pid;
      if (H.findById(pid)) openModal(pid);
    });
  });

  /* Sources toggle */
  var toggle = document.getElementById('sources-toggle-btn');
  var list   = document.getElementById('sources-list-inner');
  if (toggle && list) {
    toggle.addEventListener('click', function() {
      var open = list.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Show modal */
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  /* Scroll modal to top */
  var modal = document.getElementById('history-modal');
  if (modal) modal.scrollTop = 0;
}

function closeModal() {
  var overlay = document.getElementById('history-modal-overlay');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
  _currentItem = null;
}

/* ══════════════════════════════════════
   FILTER CONTROLS
   ══════════════════════════════════════ */
function initEraFilter() {
  var bar = document.getElementById('era-filter-bar');
  if (!bar) return;

  /* Check for URL param */
  var urlParams = new URLSearchParams(window.location.search);
  var paramEra = urlParams.get('filter');
  if (paramEra) {
    _eraFilter = paramEra;
    var btn = bar.querySelector('[data-era="' + paramEra + '"]');
    if (btn) {
      bar.querySelectorAll('.filter-chip').forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
    }
  }

  bar.querySelectorAll('.filter-chip').forEach(function(btn) {
    btn.addEventListener('click', function() {
      bar.querySelectorAll('.filter-chip').forEach(function(b) { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      _eraFilter = btn.dataset.era;
      renderTimeline(_eraFilter);
    });
  });

  renderTimeline(_eraFilter);
}

function initTypeFilter() {
  var bar = document.getElementById('explore-filter-bar');
  if (!bar) return;

  /* Check for URL param for type filter */
  var urlParams = new URLSearchParams(window.location.search);
  var paramFilter = urlParams.get('filter');
  var typeMap = { seerah:'event', companions:'person', caliphates:'dynasty', scholars:'person', places:'place' };
  if (paramFilter && typeMap[paramFilter]) {
    _typeFilter = typeMap[paramFilter];
    var btn = bar.querySelector('[data-type="' + _typeFilter + '"]');
    if (btn) {
      bar.querySelectorAll('.filter-chip').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    }
  }

  bar.querySelectorAll('.filter-chip[data-type]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      bar.querySelectorAll('.filter-chip[data-type]').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      _typeFilter = btn.dataset.type;
      renderGrid();
    });
  });
}

function initSearch() {
  var input = document.getElementById('explore-search');
  if (!input) return;
  var timeout;
  input.addEventListener('input', function() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      _searchQuery = input.value.trim();
      renderGrid();
    }, 220);
  });
}

/* ══════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════ */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function formatId(id) {
  return id.split('-').map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
}

function extractYear(dateStr) {
  if (!dateStr) return 9999;
  var m = dateStr.match(/(\d{3,4})/);
  if (!m) return 9999;
  var y = parseInt(m[1], 10);
  if (dateStr.indexOf('BH') > -1 || dateStr.indexOf('BCE') > -1) return -y;
  return y;
}

/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  /* Wait for history data */
  if (!window.WAQTX_HISTORY) {
    console.warn('WaqtX: history-data.js not loaded');
    return;
  }

  initEraFilter();
  initTypeFilter();
  initSearch();
  renderGrid();

  /* Modal close */
  var closeBtn = document.getElementById('hm-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  var overlay = document.getElementById('history-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  /* Update "This Day" card on homepage if present */
  var tdCard = document.getElementById('this-day-card');
  if (tdCard && H.getTodayEntry) {
    var today = H.getTodayEntry();
    if (today) {
      var tdYear  = document.getElementById('td-year');
      var tdTitle = document.getElementById('td-title');
      var tdBody  = document.getElementById('td-body');
      if (tdYear)  tdYear.textContent  = today.date.gregorian + (today.date.hijri ? ' · ' + today.date.hijri : '');
      if (tdTitle) tdTitle.textContent = today.title;
      if (tdBody)  tdBody.textContent  = today.summary.substring(0, 280) + '…';
    }
  }
});
