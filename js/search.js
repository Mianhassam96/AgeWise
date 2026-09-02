'use strict';
/* ═══════════════════════════════════════════════
   WaqtX — Global Search  (js/search.js)
   Requires: js/history-data.js loaded first
   ═══════════════════════════════════════════════ */

var H;
var _query      = '';
var _filter     = 'all';
var _results    = [];

/* ── Highlight query terms in text ── */
function highlight(str, query) {
  if (!query || !str) return escH(str || '');
  var re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return escH(str).replace(re, '<mark>$1</mark>');
}

function escH(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Filter item by current filter chip ── */
function itemMatchesFilter(item) {
  if (_filter === 'all')          return true;
  if (_filter === 'places')       return item.type === 'place';
  if (_filter === 'civilizations') return item.type === 'civilization';
  if (_filter === item.era)       return true;
  if (_filter === item.collection) return true;
  return false;
}

/* ── Render results ── */
function renderSearchResults() {
  var input      = el('search-main-input');
  var resultsEl  = el('search-results');
  var metaEl     = el('search-meta');
  var emptyEl    = el('search-empty');
  var emptyMsg   = el('search-empty-msg');
  var clearBtn   = el('search-clear-btn');
  if (!resultsEl) return;

  _query = (input ? input.value.trim() : '');

  /* Update clear button */
  if (clearBtn) clearBtn.classList.toggle('hidden', !_query);

  /* Get all matching items */
  var pool = _query ? H.search(_query) : H.getAll();
  _results = pool.filter(itemMatchesFilter);
  _results = H.sortByDate(_results);

  /* Update meta */
  if (metaEl) {
    if (!_query && _filter === 'all') {
      metaEl.textContent = _results.length + ' entries in the knowledge base';
    } else {
      metaEl.textContent = _results.length + ' result' + (_results.length !== 1 ? 's' : '') +
        (_query ? ' for \u201c' + _query + '\u201d' : '') +
        (_filter !== 'all' ? ' in ' + _filter : '');
    }
  }

  /* Empty state */
  if (!_results.length) {
    resultsEl.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    if (emptyMsg) emptyMsg.textContent = _query ? 'No results for \u201c' + _query + '\u201d. Try a different term.' : 'No entries in this category yet.';
    return;
  }
  if (emptyEl) emptyEl.classList.add('hidden');

  /* Build result cards */
  var html = '';
  _results.forEach(function(item) {
    var eraLabel  = H.ERA_LABELS[item.era] || item.era;
    var eraClass  = H.eraClass(item.era);
    var certClass = H.certClass(item.certainty);
    var snippet   = item.summary || '';
    /* Truncate snippet around query match */
    if (_query && snippet.toLowerCase().indexOf(_query.toLowerCase()) > 100) {
      var idx = snippet.toLowerCase().indexOf(_query.toLowerCase());
      snippet = '…' + snippet.substring(Math.max(0, idx - 60), idx + 120) + '…';
    } else {
      snippet = snippet.substring(0, 180) + (snippet.length > 180 ? '…' : '');
    }

    html += '<div class="search-result-card" data-id="' + escH(item.id) + '" tabindex="0" role="button" aria-label="' + escH(item.title) + '">';
    html += '<div class="src-left">';
    html += '<div class="src-era-row">';
    html += '<span class="era-band ' + eraClass + '">' + escH(eraLabel) + '</span>';
    if (item.collection && item.collection !== 'events') {
      html += '<span style="font-size:0.65rem;color:var(--text4);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">' + escH(item.collection) + '</span>';
    }
    html += '</div>';
    html += '<div class="src-title">' + highlight(item.title, _query) + '</div>';
    if (item.subtitle) html += '<div class="src-subtitle">' + escH(item.subtitle) + '</div>';
    html += '<div class="src-summary">' + highlight(snippet, _query) + '</div>';
    html += '</div>';
    html += '<div class="src-right">';
    html += '<span class="src-date">' + escH(item.date.gregorian) + '</span>';
    if (item.sources && item.sources.length) {
      item.sources.slice(0, 2).forEach(function(src) {
        html += '<span class="ev-badge ' + H.evClass(src.type) + '"><span class="ev-badge-dot"></span>' + escH(H.sourceTypeLabel(src.type)) + '</span>';
      });
    }
    html += '<span class="hc-certainty ' + certClass + '">' + escH(item.certainty) + '</span>';
    html += '</div>';
    html += '</div>';
  });

  resultsEl.innerHTML = html;

  /* Attach click handlers */
  resultsEl.querySelectorAll('.search-result-card').forEach(function(card) {
    card.addEventListener('click',   function() { openSearchModal(card.dataset.id); });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSearchModal(card.dataset.id); }
    });
  });
}

/* ── Reuse explore.js modal logic inline ── */
function openSearchModal(id) {
  var item = H.findById(id);
  if (!item) return;

  var overlay    = el('history-modal-overlay');
  var titleEl    = el('modal-title');
  var subtitleEl = el('modal-subtitle');
  var dateRow    = el('modal-date-row');
  var body       = el('modal-body');
  if (!overlay) return;

  if (titleEl)    titleEl.textContent    = item.title;
  if (subtitleEl) subtitleEl.textContent = item.subtitle || '';

  if (dateRow) {
    var eraLabel  = H.ERA_LABELS[item.era] || item.era;
    var eraClass  = H.eraClass(item.era);
    var certClass = H.certClass(item.certainty);
    dateRow.innerHTML =
      '<span class="era-band ' + eraClass + '">' + escH(eraLabel) + '</span>' +
      '<span class="hm-date">' + escH(item.date.gregorian) +
        (item.date.hijri ? ' &middot; ' + escH(item.date.hijri) : '') + '</span>' +
      (item.location ? '<span class="hm-location">&#x1F4CD; ' + escH(item.location) + '</span>' : '') +
      '<span class="hc-certainty ' + certClass + '" style="margin-left:auto;">' + escH(item.certainty) + '</span>';
  }

  var html = '';
  html += '<div class="hm-section"><div class="hm-section-title">Overview</div>';
  html += '<p class="hm-text">' + escH(item.summary) + '</p></div>';
  if (item.details) {
    html += '<div class="hm-section"><div class="hm-section-title">Historical Context</div>';
    html += '<p class="hm-text">' + escH(item.details) + '</p></div>';
  }
  if (item.topics && item.topics.length) {
    html += '<div class="hm-section"><div class="hm-section-title">Topics</div><div class="ev-topic-row">';
    item.topics.forEach(function(t) {
      html += '<span class="ev-topic-chip">' + escH(t.replace(/-/g,' ')) + '</span>';
    });
    html += '</div></div>';
  }
  if (item.people && item.people.length) {
    html += '<div class="hm-section"><div class="hm-section-title">Key Figures</div><div class="hm-people-list">';
    item.people.forEach(function(pid) {
      var p = H.findById(pid);
      html += '<span class="hm-person-tag" style="' + (p ? 'cursor:pointer;color:var(--teal);' : '') + '" data-pid="' + escH(pid) + '">' + escH(p ? p.title : pid.replace(/-/g,' ')) + '</span>';
    });
    html += '</div></div>';
  }
  if (item.sources && item.sources.length) {
    html += '<div class="hm-section"><div class="hm-section-title">Sources</div>';
    html += '<div class="source-badges" style="margin-bottom:12px;">';
    item.sources.forEach(function(src) {
      html += '<span class="ev-badge ' + H.evClass(src.type) + '"><span class="ev-badge-dot"></span>' + escH(H.sourceTypeLabel(src.type)) + '</span>';
    });
    html += '</div><div class="sources-panel">';
    html += '<button class="sources-toggle" id="sources-toggle-btn" aria-expanded="false">View full sources <span class="sources-toggle-arrow">&#x25BC;</span></button>';
    html += '<div class="sources-list" id="sources-list-inner">';
    item.sources.forEach(function(src) {
      html += '<div class="source-item"><div><div class="source-item-ref">';
      html += '<span class="ev-badge ' + H.evClass(src.type) + '" style="margin-right:8px;"><span class="ev-badge-dot"></span>' + escH(H.sourceTypeLabel(src.type)) + '</span>';
      html += escH(src.ref) + '</div>';
      if (src.note) html += '<div class="source-item-note">' + escH(src.note) + '</div>';
      html += '</div></div>';
    });
    html += '</div></div></div>';
  }
  var certMsg = { established:'&#x2705; <strong>Established</strong> — Quran and/or mutawatir hadith.', probable:'&#x1F4CB; <strong>Probable</strong> — well-attested in classical sources.', disputed:'&#x26A0;&#xFE0F; <strong>Disputed</strong> — different accounts exist; noted in the entry.' };
  html += '<div class="hm-section"><div class="hc-certainty ' + H.certClass(item.certainty) + '" style="padding:10px 16px;border-radius:8px;font-size:0.82rem;line-height:1.6;">';
  html += certMsg[item.certainty] || '';
  html += '</div></div>';
  html += '<div class="hm-section"><div style="text-align:center;"><a href="explore.html" class="btn btn-glass btn-sm">&#x1F4DA; View in History Explorer</a></div></div>';

  if (body) body.innerHTML = html;

  /* Person tag navigation */
  overlay.querySelectorAll('[data-pid]').forEach(function(tag) {
    tag.addEventListener('click', function() { if (H.findById(tag.dataset.pid)) openSearchModal(tag.dataset.pid); });
  });

  /* Sources toggle */
  var stBtn = document.getElementById('sources-toggle-btn');
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
}

/* ── ev-topic-chip style needed inline on search page ── */
(function injectStyles() {
  var s = document.createElement('style');
  s.textContent = '.ev-topic-chip{padding:3px 10px;border-radius:999px;font-size:.7rem;font-weight:600;background:var(--card-bg2);border:1px solid var(--border3);color:var(--text3);text-transform:capitalize;}.ev-topic-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}';
  document.head.appendChild(s);
})();

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function() {
  if (!window.WAQTX_HISTORY) { console.warn('WaqtX: history-data.js not loaded'); return; }
  H = window.WAQTX_HISTORY;

  /* Show total count */
  var totalEl = el('search-total-count');
  if (totalEl) totalEl.textContent = H.getAll().length + '+';

  /* Check URL param for pre-filled query */
  var urlParams = new URLSearchParams(window.location.search);
  var preQ = urlParams.get('q');
  var input = el('search-main-input');
  if (preQ && input) { input.value = preQ; _query = preQ; }

  /* Initial render */
  renderSearchResults();

  /* Search input */
  if (input) {
    var timer;
    input.addEventListener('input', function() {
      clearTimeout(timer);
      timer = setTimeout(renderSearchResults, 180);
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { input.value = ''; renderSearchResults(); }
    });
  }

  /* Clear button */
  var clearBtn = el('search-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (input) input.value = '';
      _query = '';
      renderSearchResults();
      if (input) input.focus();
    });
  }

  /* Filter chips */
  var chips = document.querySelectorAll('.search-filters-bar .filter-chip');
  chips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      chips.forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');
      _filter = chip.dataset.filter;
      renderSearchResults();
    });
  });

  /* Suggestions */
  document.querySelectorAll('.search-suggestion-chip').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (input) { input.value = btn.dataset.q; }
      _query = btn.dataset.q;
      renderSearchResults();
      if (input) input.focus();
    });
  });

  /* Modal close */
  var closeBtn = el('hm-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  var overlay = el('history-modal-overlay');
  if (overlay) overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });
});
