'use strict';
var AVG_LIFESPAN_YEARS = 75;
var _birth = null;

// ── Helpers ──────────────────────────────────────────────────
function parseDOB(str){var p=str.split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
function getBreakdown(birth){
  var n=new Date();
  var yy=n.getFullYear()-birth.getFullYear(),mo=n.getMonth()-birth.getMonth(),dd=n.getDate()-birth.getDate();
  var hh=n.getHours()-birth.getHours(),mi=n.getMinutes()-birth.getMinutes(),ss=n.getSeconds()-birth.getSeconds();
  if(ss<0){ss+=60;mi--;}if(mi<0){mi+=60;hh--;}if(hh<0){hh+=24;dd--;}
  if(dd<0){dd+=new Date(n.getFullYear(),n.getMonth(),0).getDate();mo--;}
  if(mo<0){mo+=12;yy--;}
  return{yy:yy,mo:mo,dd:dd,hh:hh,mi:mi,ss:ss};
}
function getTotals(birth){
  var ms=new Date()-birth,sec=Math.floor(ms/1000),min=Math.floor(sec/60),hr=Math.floor(min/60);
  var day=Math.floor(hr/24),wk=Math.floor(day/7),mon=Math.floor(day/30.4375);
  return{sec:sec,min:min,hr:hr,day:day,wk:wk,mon:mon};
}
function fmt(n){return Number(n).toLocaleString();}
function fmtShort(n){
  if(n>=1e9)return(n/1e9).toFixed(1)+'B';
  if(n>=1e6)return(n/1e6).toFixed(1)+'M';
  if(n>=1e3)return(n/1e3).toFixed(1)+'K';
  return fmt(n);
}
function bornDay(birth){return birth.toLocaleDateString('en-US',{weekday:'long'});}
function el(id){return document.getElementById(id);}
function setText(id,v){var e=el(id);if(e)e.textContent=v;}

// ── Zodiac / Chinese Zodiac / Birth details ───────────────────
function getZodiac(m,d){
  var signs=[['Capricorn',12,22],['Aquarius',1,20],['Pisces',2,19],['Aries',3,21],['Taurus',4,20],['Gemini',5,21],['Cancer',6,21],['Leo',7,23],['Virgo',8,23],['Libra',9,23],['Scorpio',10,23],['Sagittarius',11,22],['Capricorn',12,32]];
  var emojis={Capricorn:'♑',Aquarius:'♒',Pisces:'♓',Aries:'♈',Taurus:'♉',Gemini:'♊',Cancer:'♋',Leo:'♌',Virgo:'♍',Libra:'♎',Scorpio:'♏',Sagittarius:'♐'};
  for(var i=0;i<signs.length;i++){if(m===signs[i][1]&&d>=signs[i][2]){return signs[i][0]+' '+emojis[signs[i][0]];}}
  return signs[m-1][0]+' '+emojis[signs[m-1][0]];
}
function getChineseZodiac(year){
  var animals=['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
  var emojis=['🐀','🐂','🐅','🐇','🐉','🐍','🐎','🐐','🐒','🐓','🐕','🐖'];
  var idx=((year-1900)%12+12)%12;
  return animals[idx]+' '+emojis[idx];
}
function getBirthStone(m){
  var s=['Garnet','Amethyst','Aquamarine','Diamond','Emerald','Pearl','Ruby','Peridot','Sapphire','Opal','Topaz','Turquoise'];
  return s[m-1];
}
function getBirthFlower(m){
  var f=['Carnation','Violet','Daffodil','Daisy','Lily of the Valley','Rose','Larkspur','Gladiolus','Aster','Marigold','Chrysanthemum','Narcissus'];
  return f[m-1];
}

// ── Time Twins ────────────────────────────────────────────────
var TIME_TWINS=[
  {month:1,day:3,name:'J.R.R. Tolkien',icon:'📖',role:'Author, Lord of the Rings',born:'Born on 3 Jan 1892'},
  {month:1,day:8,name:'Stephen Hawking',icon:'🌌',role:'Physicist',born:'Born on 8 Jan 1942'},
  {month:1,day:17,name:'Muhammad Ali',icon:'🥊',role:'Boxing Legend',born:'Born on 17 Jan 1942'},
  {month:2,day:6,name:'Bob Marley',icon:'🎵',role:'Reggae Legend',born:'Born on 6 Feb 1945'},
  {month:2,day:11,name:'Thomas Edison',icon:'💡',role:'Inventor',born:'Born on 11 Feb 1847'},
  {month:3,day:14,name:'Albert Einstein',icon:'🧠',role:'Physicist',born:'Born on 14 Mar 1879'},
  {month:4,day:15,name:'Leonardo da Vinci',icon:'🎨',role:'Renaissance Genius',born:'Born on 15 Apr 1452'},
  {month:4,day:23,name:'William Shakespeare',icon:'🎭',role:'Playwright',born:'Born on 23 Apr 1564'},
  {month:5,day:5,name:'Karl Marx',icon:'📜',role:'Philosopher',born:'Born on 5 May 1818'},
  {month:6,day:1,name:'Marilyn Monroe',icon:'💫',role:'Actress & Icon',born:'Born on 1 Jun 1926'},
  {month:6,day:12,name:'Anne Frank',icon:'📓',role:'Diarist',born:'Born on 12 Jun 1929'},
  {month:7,day:18,name:'Nelson Mandela',icon:'✊',role:'President & Activist',born:'Born on 18 Jul 1918'},
  {month:8,day:4,name:'Barack Obama',icon:'🌍',role:'44th US President',born:'Born on 4 Aug 1961'},
  {month:8,day:15,name:'Napoleon Bonaparte',icon:'⚔️',role:'French Emperor',born:'Born on 15 Aug 1769'},
  {month:9,day:5,name:'Freddie Mercury',icon:'🎤',role:'Queen Frontman',born:'Born on 5 Sep 1946'},
  {month:9,day:15,name:'Agatha Christie',icon:'🔍',role:'Mystery Writer',born:'Born on 15 Sep 1890'},
  {month:10,day:2,name:'Mahatma Gandhi',icon:'🕊️',role:'Independence Leader',born:'Born on 2 Oct 1869'},
  {month:10,day:9,name:'John Lennon',icon:'🎵',role:'Beatle & Activist',born:'Born on 9 Oct 1940'},
  {month:11,day:9,name:'Carl Sagan',icon:'🌌',role:'Astronomer',born:'Born on 9 Nov 1934'},
  {month:11,day:30,name:'Mark Twain',icon:'✍️',role:'American Author',born:'Born on 30 Nov 1835'},
  {month:12,day:5,name:'Walt Disney',icon:'✨',role:'Animation Pioneer',born:'Born on 5 Dec 1901'},
  {month:12,day:25,name:'Isaac Newton',icon:'🍎',role:'Physicist & Mathematician',born:'Born on 25 Dec 1642'},
  {month:12,day:16,name:'Ludwig van Beethoven',icon:'🎹',role:'Classical Composer',born:'Born on 16 Dec 1770'}
];
function getTimeTwin(birth){
  var m=birth.getMonth()+1,d=birth.getDate();
  var exact=TIME_TWINS.filter(function(t){return t.month===m&&t.day===d;});
  if(exact.length)return exact[0];
  var sameMonth=TIME_TWINS.filter(function(t){return t.month===m;});
  if(sameMonth.length)return sameMonth.sort(function(a,b){return Math.abs(a.day-d)-Math.abs(b.day-d);})[0];
  return TIME_TWINS.sort(function(a,b){return Math.abs((a.month*31+a.day)-(m*31+d))-Math.abs((b.month*31+b.day)-(m*31+d));})[0];
}

// ── History events ────────────────────────────────────────────
var HISTORY_EVENTS={
  '1-1':[{y:1863,t:'Emancipation Proclamation took effect in the US.'},{y:1804,t:'Haiti declared independence from France.'},{y:1958,t:'European Economic Community established.'}],
  '8-15':[{y:1947,t:'India gained independence from British rule.'},{y:1971,t:'Bahrain declared independence from the UK.'},{y:1969,t:'Woodstock Music Festival began in New York.'}],
  '7-4':[{y:1776,t:'United States declared independence.'},{y:1826,t:'John Adams and Thomas Jefferson both died.'},{y:1997,t:'Mars Pathfinder landed on Mars.'}],
  '12-25':[{y:1642,t:'Isaac Newton was born.'},{y:1991,t:'Soviet Union officially dissolved.'},{y:1914,t:'Christmas Truce during World War I.'}]
};
function getHistoryEvents(birth){
  var key=(birth.getMonth()+1)+'-'+birth.getDate();
  if(HISTORY_EVENTS[key])return HISTORY_EVENTS[key];
  var month=birth.getMonth()+1;
  var defaults=[
    {y:1914,t:'World War I began, reshaping the world.'},
    {y:1969,t:'Apollo 11 landed on the Moon.'},
    {y:1989,t:'The Berlin Wall fell, ending the Cold War.'}
  ];
  return defaults;
}

var MONTH_EVENTS={
  1:[{icon:'🌍',y:1945,t:'United Nations was founded.'},{icon:'🚀',y:1986,t:'Space Shuttle Challenger disaster.'},{icon:'🎵',y:1964,t:'Beatles arrived in the United States.'}],
  2:[{icon:'🌍',y:1945,t:'Yalta Conference shaped post-WWII world.'},{icon:'🎬',y:1895,t:'First public film screening by Lumière brothers.'},{icon:'✊',y:1965,t:'Malcolm X was assassinated.'}],
  3:[{icon:'🌍',y:1945,t:'Battle of Iwo Jima ended.'},{icon:'🔬',y:1876,t:'Alexander Graham Bell patented the telephone.'},{icon:'🎭',y:1616,t:'William Shakespeare died.'}],
  4:[{icon:'🚀',y:1961,t:'Yuri Gagarin became first human in space.'},{icon:'🌍',y:1912,t:'Titanic sank in the North Atlantic.'},{icon:'🎵',y:1994,t:'Kurt Cobain died.'}],
  5:[{icon:'🌍',y:1945,t:'World War II ended in Europe (V-E Day).'},{icon:'🔬',y:1953,t:'DNA double helix structure discovered.'},{icon:'⛰️',y:1953,t:'Edmund Hillary summited Mount Everest.'}],
  6:[{icon:'🌍',y:1944,t:'D-Day: Allied forces landed in Normandy.'},{icon:'🎵',y:1967,t:'Beatles released Sgt. Pepper's album.'},{icon:'🏆',y:1966,t:'England won the FIFA World Cup.'}],
  7:[{icon:'🚀',y:1969,t:'Apollo 11 landed on the Moon.'},{icon:'🌍',y:1776,t:'United States declared independence.'},{icon:'🎵',y:1985,t:'Live Aid concert raised millions for Africa.'}],
  8:[{icon:'🌍',y:1914,t:'World War I began.'},{icon:'✊',y:1963,t:'Martin Luther King Jr. delivered "I Have a Dream" speech.'},{icon:'🏅',y:2000,t:'Summer Olympics held in Sydney, Australia.'}],
  9:[{icon:'🌍',y:2001,t:'September 11 attacks in the United States.'},{icon:'🔬',y:1928,t:'Alexander Fleming discovered penicillin.'},{icon:'🎵',y:1969,t:'Beatles released Abbey Road album.'}],
  10:[{icon:'🌍',y:1962,t:'Cuban Missile Crisis began.'},{icon:'🔬',y:1901,t:'First Nobel Prizes were awarded.'},{icon:'🎵',y:1958,t:'Billboard Hot 100 chart was introduced.'}],
  11:[{icon:'🌍',y:1989,t:'Berlin Wall fell, ending the Cold War.'},{icon:'🔬',y:1895,t:'Wilhelm Röntgen discovered X-rays.'},{icon:'🎵',y:1963,t:'Beatles released "With the Beatles" album.'}],
  12:[{icon:'🌍',y:1991,t:'Soviet Union officially dissolved.'},{icon:'🚀',y:1972,t:'Apollo 17 — last humans walked on the Moon.'},{icon:'🎵',y:1967,t:'Beatles released Magical Mystery Tour.'}]
};

// ── Main render ───────────────────────────────────────────────
function renderAll(birth){
  _birth=birth;
  var b=getBreakdown(birth);
  var t=getTotals(birth);
  var ageYears=b.yy+b.mo/12;
  var pct=Math.min(100,(ageYears/AVG_LIFESPAN_YEARS)*100);
  var totalDays=Math.round(AVG_LIFESPAN_YEARS*365.25);
  var daysLeft=Math.max(0,totalDays-t.day);

  // Show results
  el('results-section').classList.remove('hidden');
  el('results-section').scrollIntoView({behavior:'smooth',block:'start'});

  // ── Ring ──
  var circ=2*Math.PI*110;
  var offset=circ-(pct/100)*circ;
  var ringEl=el('ring-progress');
  if(ringEl){ringEl.style.strokeDasharray=circ;ringEl.style.strokeDashoffset=offset;}
  setText('ring-pct',Math.round(pct)+'%');
  setText('ring-days',fmt(t.day)+' of '+fmt(totalDays)+' days');
  // move dot
  var dotEl=el('ring-dot');
  if(dotEl){
    var angle=(pct/100)*360-90;
    var rad=angle*Math.PI/180;
    var cx=130+110*Math.cos(rad),cy=130+110*Math.sin(rad);
    dotEl.setAttribute('cx',cx.toFixed(1));
    dotEl.setAttribute('cy',cy.toFixed(1));
  }

  // ── Stats row ──
  setText('stat-age',(b.yy+b.mo/12).toFixed(1));
  setText('stat-age-days',fmt(t.day)+' days');
  setText('stat-days-used',fmt(t.day));
  setText('stat-hours-used',fmt(t.hr)+' hours');
  setText('stat-days-left',fmt(daysLeft));
  setText('stat-hours-left',fmt(daysLeft*24)+' hours');
  setText('stat-pct',Math.round(pct)+'%');
  setText('stat-pct-left','Still '+Math.round(100-pct)+'% to live');
  setText('stat-total-days',fmt(totalDays)+' days');

  // ── Life Progress ──
  var fillEl=el('progress-bar-fill');
  if(fillEl)setTimeout(function(){fillEl.style.width=pct.toFixed(1)+'%';},100);
  setText('progress-bar-pct',Math.round(pct)+'%');
  var birthStr=birth.toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'});
  var deathYear=birth.getFullYear()+AVG_LIFESPAN_YEARS;
  var deathStr=birth.toLocaleDateString('en-US',{day:'numeric',month:'short'})+' '+deathYear;
  setText('lt-birth-date',birthStr);
  setText('lt-total-days',fmt(totalDays)+' days');
  setText('lt-death-date',deathStr);

  // ── Mini Calendar ──
  buildMiniCalendar(birth,t.day);

  // ── Time Twin ──
  renderTimeTwin(birth);

  // ── History ──
  renderHistory(birth);

  // ── Month events ──
  renderMonthEvents(birth);

  // ── Birth Details ──
  var m=birth.getMonth()+1,d=birth.getDate(),y=birth.getFullYear();
  setText('bd-day',bornDay(birth));
  setText('bd-zodiac',getZodiac(m,d));
  setText('bd-chinese',getChineseZodiac(y));
  setText('bd-stone',getBirthStone(m));
  setText('bd-flower',getBirthFlower(m));

  // ── Country events (use history events) ──
  var countryEl=el('country-events');
  var histEvents=getHistoryEvents(birth);
  if(countryEl){
    countryEl.innerHTML=histEvents.slice(0,3).map(function(e){
      return '<div class="ce-item-sm"><span class="ce-year">'+e.y+'</span>'+e.t+'</div>';
    }).join('');
  }
  setText('country-title','🌍 On '+birth.toLocaleDateString('en-US',{month:'long',day:'numeric'}));

  // ── Fun Facts ──
  setText('ff-heartbeats',fmtShort(Math.floor(t.day*24*60*70)));
  setText('ff-sunrises',fmt(t.day));
  setText('ff-weekends',fmt(Math.floor(t.day/7)));
  setText('ff-mondays',fmt(Math.floor(t.day/7)));

  // ── History date label ──
  setText('history-date-label','Major events that happened on '+birth.toLocaleDateString('en-US',{month:'long',day:'numeric'}));
  setText('month-label','What happened in '+birth.toLocaleDateString('en-US',{month:'long'}));

  // ── Cal week labels ──
  setText('cal-date-start',birthStr);
  setText('cal-date-end',deathStr);
  var weeksLived=Math.floor(t.day/7);
  setText('cal-week-now','Week '+fmt(weeksLived));

  // ── Start live ticker ──
  clearInterval(window._ticker);
  window._ticker=setInterval(function(){tickUpdate(birth);},1000);
  tickUpdate(birth);

  // ── Save ──
  localStorage.setItem('aw_dob',birth.toISOString().split('T')[0]);
}

function tickUpdate(birth){
  var t=getTotals(birth);
  var b=getBreakdown(birth);
  var ageYears=b.yy+b.mo/12;
  var pct=Math.min(100,(ageYears/AVG_LIFESPAN_YEARS)*100);
  var totalDays=Math.round(AVG_LIFESPAN_YEARS*365.25);
  var daysLeft=Math.max(0,totalDays-t.day);
  setText('ring-pct',Math.round(pct)+'%');
  setText('ring-days',fmt(t.day)+' of '+fmt(totalDays)+' days');
  setText('stat-age',(ageYears).toFixed(4));
  setText('stat-days-used',fmt(t.day));
  setText('stat-hours-used',fmt(t.hr)+' hours');
  setText('stat-days-left',fmt(daysLeft));
  setText('stat-hours-left',fmt(daysLeft*24)+' hours');
  setText('stat-pct',Math.round(pct)+'%');
  setText('ff-heartbeats',fmtShort(Math.floor(t.day*24*60*70)));
}

function buildMiniCalendar(birth,daysLived){
  var grid=el('mini-cal-grid');
  if(!grid)return;
  var totalWeeks=AVG_LIFESPAN_YEARS*52;
  var weeksLived=Math.floor(daysLived/7);
  var show=Math.min(totalWeeks,52*2); // show 2 years worth in mini
  var frag=document.createDocumentFragment();
  for(var w=0;w<show;w++){
    var cell=document.createElement('div');
    cell.className='mini-cal-cell '+(w<weeksLived?'mc-past':w===weeksLived?'mc-present':'mc-future');
    frag.appendChild(cell);
  }
  grid.innerHTML='';
  grid.appendChild(frag);
}

function buildFullCalendar(birth){
  var grid=el('full-cal-grid');
  if(!grid)return;
  var t=getTotals(birth);
  var totalWeeks=AVG_LIFESPAN_YEARS*52;
  var weeksLived=Math.floor(t.day/7);
  var frag=document.createDocumentFragment();
  for(var w=0;w<totalWeeks;w++){
    var cell=document.createElement('div');
    cell.className='full-cal-cell '+(w<weeksLived?'mc-past':w===weeksLived?'mc-present':'mc-future');
    cell.title='Week '+(w+1);
    frag.appendChild(cell);
  }
  grid.innerHTML='';
  grid.appendChild(frag);
}

function renderTimeTwin(birth){
  var twin=getTimeTwin(birth);
  if(!twin)return;
  setText('twin-avatar',twin.icon);
  setText('twin-name',twin.name);
  setText('twin-role',twin.role);
  setText('twin-born',twin.born);
  // others — pick 4 more different twins
  var m=birth.getMonth()+1;
  var others=TIME_TWINS.filter(function(t){return t.name!==twin.name;}).slice(0,5);
  var othersEl=el('twin-others');
  if(othersEl){
    othersEl.innerHTML=others.map(function(o){
      return '<div class="twin-other-avatar" title="'+o.name+'">'+o.icon+'</div>';
    }).join('')+'<div class="twin-more">+12</div>';
  }
}

function renderHistory(birth){
  var events=getHistoryEvents(birth);
  var listEl=el('history-list');
  if(!listEl)return;
  var colors=['history-dot-green','history-dot-yellow','history-dot-blue'];
  listEl.innerHTML=events.map(function(e,i){
    return '<div class="history-item"><span class="history-dot '+colors[i%3]+'"></span><span class="history-year">'+e.y+'</span><span class="history-text">'+e.t+'</span></div>';
  }).join('');
}

function renderMonthEvents(birth){
  var m=birth.getMonth()+1;
  var events=MONTH_EVENTS[m]||MONTH_EVENTS[8];
  var listEl=el('month-list');
  if(!listEl)return;
  listEl.innerHTML=events.map(function(e){
    return '<div class="month-item"><span class="month-icon">'+e.icon+'</span><span class="month-year">'+e.y+'</span><span class="month-text">'+e.t+'</span><span class="month-arrow">›</span></div>';
  }).join('');
}

// ── Calculate button ──────────────────────────────────────────
document.getElementById('btn-calculate').addEventListener('click',function(){
  var dob=el('hero-dob').value;
  var errEl=el('hero-error');
  errEl.classList.add('hidden');
  if(!dob){errEl.textContent='Please enter your date of birth.';errEl.classList.remove('hidden');return;}
  var birth=parseDOB(dob);
  if(birth>new Date()){errEl.textContent='Date of birth cannot be in the future.';errEl.classList.remove('hidden');return;}
  renderAll(birth);
  track('calculate','main');
});

// Enter key on input
document.getElementById('hero-dob').addEventListener('keydown',function(e){
  if(e.key==='Enter')document.getElementById('btn-calculate').click();
});

// ── Full calendar ─────────────────────────────────────────────
document.getElementById('btn-full-calendar').addEventListener('click',function(){
  if(!_birth)return;
  buildFullCalendar(_birth);
  el('full-calendar-section').classList.remove('hidden');
  el('full-calendar-section').scrollIntoView({behavior:'smooth'});
});
document.getElementById('btn-close-calendar').addEventListener('click',function(){
  el('full-calendar-section').classList.add('hidden');
});

// ── Share ─────────────────────────────────────────────────────
function openShare(){
  if(!_birth)return;
  var t=getTotals(_birth);
  var b=getBreakdown(_birth);
  var pct=Math.min(100,((b.yy+b.mo/12)/AVG_LIFESPAN_YEARS)*100);
  setText('sc-pct',Math.round(pct)+'%');
  setText('sc-name-card',b.yy+' years old');
  var statsEl=el('sc-stats-card');
  if(statsEl)statsEl.innerHTML=fmt(t.day)+' days lived &nbsp;·&nbsp; '+fmtShort(Math.floor(t.day*24*60*70))+' heartbeats';
  el('share-modal').classList.remove('hidden');
  document.body.style.overflow='hidden';
}
document.getElementById('btn-nav-share').addEventListener('click',openShare);
document.getElementById('share-close').addEventListener('click',function(){
  el('share-modal').classList.add('hidden');
  document.body.style.overflow='';
});
document.getElementById('share-modal').addEventListener('click',function(e){
  if(e.target===this){el('share-modal').classList.add('hidden');document.body.style.overflow='';}
});
document.getElementById('btn-download-share').addEventListener('click',function(){
  var card=el('share-card');
  if(typeof html2canvas==='undefined'){alert('Download not available. Please screenshot instead.');return;}
  html2canvas(card,{backgroundColor:null,scale:2}).then(function(canvas){
    var a=document.createElement('a');
    a.download='agewise-life-card.png';
    a.href=canvas.toDataURL('image/png');
    a.click();
  });
});

// ── Nav smooth scroll ─────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(function(a){
  a.addEventListener('click',function(e){
    var href=a.getAttribute('href');
    if(href&&href.startsWith('#')){
      e.preventDefault();
      var target=document.querySelector(href);
      if(target)target.scrollIntoView({behavior:'smooth'});
      document.getElementById('nav-links').classList.remove('open');
    }
  });
});

// ── Restore last DOB ──────────────────────────────────────────
(function(){
  var saved=localStorage.getItem('aw_dob');
  if(saved){
    var inp=el('hero-dob');
    if(inp)inp.value=saved;
  }
})();