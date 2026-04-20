'use strict';

var AVG_LIFESPAN_YEARS = 72;

// ─── Tab switching ────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function(s) { s.classList.remove('active'); });
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ─── Parse DOB string as LOCAL date ──────────────────────────
function parseDOB(str) {
  var parts = str.split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

// ─── Validate inputs ──────────────────────────────────────────
function validate(name, dob) {
  if (!name.trim()) return 'Please enter a name.';
  if (!dob) return 'Please select a date of birth.';
  if (parseDOB(dob) > new Date()) return 'Date of birth cannot be in the future.';
  return '';
}

// ─── Age breakdown ────────────────────────────────────────────
function getBreakdown(birth) {
  var n = new Date();
  var yy = n.getFullYear() - birth.getFullYear();
  var mo = n.getMonth()    - birth.getMonth();
  var dd = n.getDate()     - birth.getDate();
  var hh = n.getHours()    - birth.getHours();
  var mi = n.getMinutes()  - birth.getMinutes();
  var ss = n.getSeconds()  - birth.getSeconds();
  if (ss < 0) { ss += 60; mi--; }
  if (mi < 0) { mi += 60; hh--; }
  if (hh < 0) { hh += 24; dd--; }
  if (dd < 0) { dd += new Date(n.getFullYear(), n.getMonth(), 0).getDate(); mo--; }
  if (mo < 0) { mo += 12; yy--; }
  return { yy: yy, mo: mo, dd: dd, hh: hh, mi: mi, ss: ss };
}

// ─── Totals since birth ───────────────────────────────────────
function getTotals(birth) {
  var ms  = new Date() - birth;
  var sec = Math.floor(ms / 1000);
  var min = Math.floor(sec / 60);
  var hr  = Math.floor(min / 60);
  var day = Math.floor(hr  / 24);
  var wk  = Math.floor(day / 7);
  var mon = Math.floor(day / 30.4375);
  return { sec: sec, min: min, hr: hr, day: day, wk: wk, mon: mon };
}

// ─── Exact diff between two dates ────────────────────────────
function dateDiff(d1, d2) {
  var yy = d2.getFullYear() - d1.getFullYear();
  var mo = d2.getMonth()    - d1.getMonth();
  var dd = d2.getDate()     - d1.getDate();
  var hh = d2.getHours()    - d1.getHours();
  var mi = d2.getMinutes()  - d1.getMinutes();
  var ss = d2.getSeconds()  - d1.getSeconds();
  if (ss < 0) { ss += 60; mi--; }
  if (mi < 0) { mi += 60; hh--; }
  if (hh < 0) { hh += 24; dd--; }
  if (dd < 0) { dd += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate(); mo--; }
  if (mo < 0) { mo += 12; yy--; }
  return { yy: yy, mo: mo, dd: dd, hh: hh, mi: mi, ss: ss };
}

// ─── Born day name ────────────────────────────────────────────
function bornDay(birth) {
  return birth.toLocaleDateString('en-US', { weekday: 'long' });
}

// ─── Next birthday countdown ──────────────────────────────────
function nextBirthday(birth) {
  var n    = new Date();
  var next = new Date(n.getFullYear(), birth.getMonth(), birth.getDate());
  if (next <= n) next.setFullYear(n.getFullYear() + 1);
  var diff = next - n;
  var d = Math.floor(diff / 86400000);
  var h = Math.floor((diff % 86400000) / 3600000);
  var m = Math.floor((diff % 3600000)  / 60000);
  var s = Math.floor((diff % 60000)    / 1000);
  if (d === 0 && h === 0 && m < 1) return '🎂 Today is the birthday!';
  return '🎂 Next birthday in ' + d + 'd ' + h + 'h ' + m + 'm ' + s + 's';
}

// ─── Stat boxes HTML ─────────────────────────────────────────
function statsHTML(rows) {
  return rows.map(function(row) {
    return '<div class="stat-box"><div class="stat-val">' +
      Number(row[0]).toLocaleString() +
      '</div><div class="stat-lbl">' + row[1] + '</div></div>';
  }).join('');
}

// ─── Show / hide inline error ─────────────────────────────────
function showError(id, msg) {
  var el = document.getElementById(id);
  if (msg) { el.textContent = msg; el.classList.remove('hidden'); }
  else { el.classList.add('hidden'); }
}

// ─── Life Progress Ring ───────────────────────────────────────
function updateRing(ageYears) {
  var pct = Math.min(100, (ageYears / AVG_LIFESPAN_YEARS) * 100);
  var circumference = 2 * Math.PI * 80; // r=80
  var offset = circumference - (pct / 100) * circumference;
  var fill = document.getElementById('ring-fill');
  var pctEl = document.getElementById('ring-pct');
  var subEl = document.getElementById('ring-sub');
  if (!fill) return;
  fill.style.strokeDashoffset = offset;
  pctEl.textContent = Math.round(pct) + '%';
  var left = Math.max(0, AVG_LIFESPAN_YEARS - ageYears);
  subEl.textContent = 'You\'ve lived ' + Math.round(pct) + '% of an average ' + AVG_LIFESPAN_YEARS + '-year life · ~' + left + ' years ahead';
}

// ─── Life in Numbers bars ─────────────────────────────────────
function lifeNumbersHTML(totalDays) {
  var items = [
    { icon: '❤️', label: 'Heartbeats',    val: Math.floor(totalDays * 24 * 60 * 70),   max: AVG_LIFESPAN_YEARS * 365 * 24 * 60 * 70,   color: '#f87171' },
    { icon: '😴', label: 'Hours Slept',   val: Math.floor(totalDays * 8),               max: AVG_LIFESPAN_YEARS * 365 * 8,               color: '#818cf8' },
    { icon: '🍽️', label: 'Meals Eaten',   val: Math.floor(totalDays * 3),               max: AVG_LIFESPAN_YEARS * 365 * 3,               color: '#34d399' },
    { icon: '🚶', label: 'Steps Taken',   val: Math.floor(totalDays * 8000),            max: AVG_LIFESPAN_YEARS * 365 * 8000,            color: '#fbbf24' },
    { icon: '🌅', label: 'Sunrises Seen', val: totalDays,                               max: AVG_LIFESPAN_YEARS * 365,                   color: '#f97316' },
    { icon: '💧', label: 'Glasses of Water', val: Math.floor(totalDays * 8),            max: AVG_LIFESPAN_YEARS * 365 * 8,               color: '#38bdf8' }
  ];
  return items.map(function(item) {
    var pct = Math.min(100, (item.val / item.max) * 100).toFixed(1);
    var display = item.val >= 1e9
      ? (item.val / 1e9).toFixed(2) + 'B'
      : item.val >= 1e6
        ? (item.val / 1e6).toFixed(1) + 'M'
        : Number(item.val).toLocaleString();
    return '<div class="life-bar-item">' +
      '<div class="lb-header"><span class="lb-icon">' + item.icon + '</span>' +
      '<span class="lb-label">' + item.label + '</span>' +
      '<span class="lb-val">' + display + '</span></div>' +
      '<div class="lb-track"><div class="lb-fill" style="width:' + pct + '%;background:' + item.color + '" data-pct="' + pct + '"></div></div>' +
      '</div>';
  }).join('');
}

// ─── Animate bars in ─────────────────────────────────────────
function animateBars() {
  document.querySelectorAll('.lb-fill').forEach(function(el) {
    var target = el.getAttribute('data-pct');
    el.style.width = '0%';
    setTimeout(function() { el.style.width = target + '%'; }, 80);
  });
}

// ─── Single Age ───────────────────────────────────────────────
document.getElementById('calc-single').addEventListener('click', function() {
  var name = document.getElementById('s-name').value;
  var dob  = document.getElementById('s-dob').value;
  var err  = validate(name, dob);
  showError('s-error', err);
  if (err) return;

  var birth = parseDOB(dob);
  var card  = document.getElementById('single-result');

  // store for share card
  window._shareData = { name: name.trim(), birth: birth };

  function render() {
    var b = getBreakdown(birth);
    var t = getTotals(birth);

    document.getElementById('sr-title').textContent = name.trim() + "'s Age";

    document.getElementById('sr-banner').textContent =
      'Age: ' + b.yy + ' Years  ' + b.mo + ' Months  ' + b.dd + ' Days  ' +
      b.hh + ' Hours  ' + b.mi + ' Minutes  ' + b.ss + ' Seconds';

    updateRing(b.yy + b.mo / 12);

    document.getElementById('sr-stats').innerHTML = statsHTML([
      [t.mon, 'Total Months'],
      [t.wk,  'Total Weeks'],
      [t.day, 'Total Days'],
      [t.hr,  'Total Hours'],
      [t.min, 'Total Minutes'],
      [t.sec, 'Total Seconds']
    ]);

    document.getElementById('life-bars').innerHTML = lifeNumbersHTML(t.day);

    document.getElementById('sr-pills').innerHTML =
      '<div class="pill">📅 Born on ' + bornDay(birth) + '</div>' +
      '<div class="pill" id="s-bday">' + nextBirthday(birth) + '</div>';
  }

  render();
  card.classList.remove('hidden');
  animateBars();

  clearInterval(window._sTimer);
  window._sTimer = setInterval(function() {
    if (card.classList.contains('hidden')) { clearInterval(window._sTimer); return; }
    var b = getBreakdown(birth);
    var t = getTotals(birth);

    document.getElementById('sr-banner').textContent =
      'Age: ' + b.yy + ' Years  ' + b.mo + ' Months  ' + b.dd + ' Days  ' +
      b.hh + ' Hours  ' + b.mi + ' Minutes  ' + b.ss + ' Seconds';

    updateRing(b.yy + b.mo / 12);

    document.getElementById('sr-stats').innerHTML = statsHTML([
      [t.mon, 'Total Months'],
      [t.wk,  'Total Weeks'],
      [t.day, 'Total Days'],
      [t.hr,  'Total Hours'],
      [t.min, 'Total Minutes'],
      [t.sec, 'Total Seconds']
    ]);

    var bdayEl = document.getElementById('s-bday');
    if (bdayEl) bdayEl.textContent = nextBirthday(birth);
  }, 1000);
});

// ─── Compare Ages ─────────────────────────────────────────────
document.getElementById('calc-compare').addEventListener('click', function() {
  var n1 = document.getElementById('p1-name').value;
  var d1 = document.getElementById('p1-dob').value;
  var n2 = document.getElementById('p2-name').value;
  var d2 = document.getElementById('p2-dob').value;

  var e1 = validate(n1, d1);
  var e2 = validate(n2, d2);
  var errMsg = (e1 ? 'Person 1: ' + e1 : '') + (e1 && e2 ? '  |  ' : '') + (e2 ? 'Person 2: ' + e2 : '');
  showError('c-error', errMsg);
  if (e1 || e2) return;

  var birth1 = parseDOB(d1);
  var birth2 = parseDOB(d2);
  var card   = document.getElementById('compare-result');

  function render() {
    var b1 = getBreakdown(birth1);
    var b2 = getBreakdown(birth2);
    var t1 = getTotals(birth1);
    var t2 = getTotals(birth2);

    var olderName   = birth1 < birth2 ? n1.trim() : birth2 < birth1 ? n2.trim() : null;
    var youngerName = olderName === n1.trim() ? n2.trim() : n1.trim();

    document.getElementById('cr-winner').textContent = olderName
      ? olderName + ' is older than ' + youngerName
      : n1.trim() + ' and ' + n2.trim() + ' are the same age!';

    var earlier = birth1 <= birth2 ? birth1 : birth2;
    var later   = birth1 <= birth2 ? birth2 : birth1;
    var df      = dateDiff(earlier, later);

    var diffMs  = Math.abs(birth1 - birth2);
    var diffSec = Math.floor(diffMs / 1000);
    var diffMin = Math.floor(diffSec / 60);
    var diffHr  = Math.floor(diffMin / 60);
    var diffDay = Math.floor(diffHr  / 24);

    // fun coffee message
    var coffeeGap = Math.floor(diffDay * 1.5);
    var funMsg = olderName
      ? ' ☕ ' + olderName + ' is ~' + coffeeGap.toLocaleString() + ' coffees older!'
      : '';

    document.getElementById('cr-diff').textContent =
      'Age Difference: ' + df.yy + ' Years  ' + df.mo + ' Months  ' + df.dd + ' Days  ' +
      df.hh + ' Hours  ' + df.mi + ' Minutes  ' + df.ss + ' Seconds' + funMsg;

    document.getElementById('cr-stats').innerHTML = statsHTML([
      [diffDay, 'Days Difference'],
      [diffHr,  'Hours Difference'],
      [diffMin, 'Minutes Difference'],
      [diffSec, 'Seconds Difference']
    ]);

    document.getElementById('cr-cards').innerHTML =
      miniCard(n1.trim(), birth1, b1, t1) + miniCard(n2.trim(), birth2, b2, t2);
  }

  render();
  card.classList.remove('hidden');

  clearInterval(window._cTimer);
  window._cTimer = setInterval(function() {
    if (card.classList.contains('hidden')) { clearInterval(window._cTimer); return; }
    render();
  }, 1000);
});

// ─── Person mini card HTML ────────────────────────────────────
function miniCard(name, birth, b, t) {
  return '<div class="person-mini">' +
    '<h3>' + name + '</h3>' +
    '<p>' +
      'Age: ' + b.yy + 'y ' + b.mo + 'm ' + b.dd + 'd<br>' +
      'Born: ' + bornDay(birth) + '<br>' +
      nextBirthday(birth) + '<br>' +
      'Total Days: ' + t.day.toLocaleString() +
    '</p>' +
    '</div>';
}

// ─── Share Card ───────────────────────────────────────────────
document.getElementById('btn-share-single').addEventListener('click', function() {
  var data = window._shareData;
  if (!data) return;
  var b = getBreakdown(data.birth);
  var t = getTotals(data.birth);

  document.getElementById('sc-name').textContent = data.name;
  document.getElementById('sc-age').textContent =
    b.yy + ' years · ' + b.mo + ' months · ' + b.dd + ' days';
  document.getElementById('sc-stats').innerHTML =
    '📅 ' + t.day.toLocaleString() + ' days lived' +
    '  ·  ❤️ ~' + Math.floor(t.day * 24 * 60 * 70 / 1e9).toFixed(1) + 'B heartbeats' +
    '  ·  🎂 ' + nextBirthday(data.birth);

  document.getElementById('share-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
});

document.getElementById('share-close').addEventListener('click', closeModal);
document.getElementById('share-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

function closeModal() {
  document.getElementById('share-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

document.getElementById('btn-download').addEventListener('click', function() {
  var card = document.getElementById('share-card');
  if (typeof html2canvas === 'undefined') {
    alert('Download library not loaded. Please check your connection.');
    return;
  }
  html2canvas(card, { backgroundColor: '#0f0c29', scale: 2 }).then(function(canvas) {
    var link = document.createElement('a');
    link.download = 'agewise-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
});
