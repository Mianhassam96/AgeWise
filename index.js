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
var HISTORY_EVENTS = {
  '1-1':[{y:1863,t:'Emancipation Proclamation took effect in the US.'},{y:1804,t:'Haiti declared independence from France.'},{y:1958,t:'European Economic Community established.'}],
  '1-8':[{y:1942,t:'Stephen Hawking was born in Oxford, England.'},{y:1935,t:'Elvis Presley was born in Tupelo, Mississippi.'},{y:1815,t:'Battle of New Orleans ended the War of 1812.'}],
  '1-15':[{y:1929,t:'Martin Luther King Jr. was born in Atlanta, Georgia.'},{y:1559,t:'Elizabeth I was crowned Queen of England.'},{y:2009,t:'Miracle on the Hudson: US Airways Flight 1549 landed safely.'}],
  '1-17':[{y:1942,t:'Muhammad Ali was born in Louisville, Kentucky.'},{y:1706,t:'Benjamin Franklin was born in Boston.'},{y:1991,t:'Operation Desert Storm began in the Gulf War.'}],
  '1-20':[{y:1961,t:'John F. Kennedy was inaugurated as 35th US President.'},{y:2009,t:'Barack Obama was inaugurated as 44th US President.'},{y:1981,t:'Iran hostage crisis ended after 444 days.'}],
  '1-27':[{y:1756,t:'Wolfgang Amadeus Mozart was born in Salzburg.'},{y:1945,t:'Soviet forces liberated Auschwitz concentration camp.'},{y:1967,t:'Apollo 1 fire killed three NASA astronauts.'}],
  '2-4':[{y:1945,t:'Yalta Conference began between Allied leaders.'},{y:2004,t:'Facebook was launched by Mark Zuckerberg.'},{y:1789,t:'George Washington was unanimously elected first US President.'}],
  '2-11':[{y:1847,t:'Thomas Edison was born in Milan, Ohio.'},{y:1990,t:'Nelson Mandela was released from prison after 27 years.'},{y:1929,t:'Lateran Treaty established Vatican City as independent state.'}],
  '2-14':[{y:1929,t:'St. Valentine Day Massacre occurred in Chicago.'},{y:1876,t:'Alexander Graham Bell applied for telephone patent.'},{y:1989,t:'Ayatollah Khomeini issued fatwa against Salman Rushdie.'}],
  '2-18':[{y:1930,t:'Pluto was discovered by astronomer Clyde Tombaugh.'},{y:1564,t:'Michelangelo died in Rome at age 88.'},{y:1861,t:'Jefferson Davis was inaugurated as Confederate President.'}],
  '3-6':[{y:1475,t:'Michelangelo was born in Caprese, Italy.'},{y:1836,t:'Battle of the Alamo ended in Texas.'},{y:1857,t:'Dred Scott decision issued by US Supreme Court.'}],
  '3-14':[{y:1879,t:'Albert Einstein was born in Ulm, Germany.'},{y:1883,t:'Karl Marx died in London.'},{y:1794,t:'Eli Whitney patented the cotton gin.'}],
  '3-21':[{y:1685,t:'Johann Sebastian Bach was born in Eisenach.'},{y:1960,t:'Sharpeville massacre occurred in South Africa.'},{y:2006,t:'Twitter was founded by Jack Dorsey.'}],
  '4-2':[{y:1805,t:'Hans Christian Andersen was born in Denmark.'},{y:1982,t:'Argentina invaded the Falkland Islands.'},{y:1792,t:'US Mint was established by Congress.'}],
  '4-15':[{y:1452,t:'Leonardo da Vinci was born in Vinci, Italy.'},{y:1912,t:'RMS Titanic sank in the North Atlantic.'},{y:1865,t:'Abraham Lincoln died after being shot the previous night.'}],
  '4-23':[{y:1564,t:'William Shakespeare was born in Stratford-upon-Avon.'},{y:1616,t:'Miguel de Cervantes died in Madrid.'},{y:1985,t:'Coca-Cola introduced New Coke formula.'}],
  '5-5':[{y:1818,t:'Karl Marx was born in Trier, Germany.'},{y:1961,t:'Alan Shepard became first American in space.'},{y:1821,t:'Napoleon Bonaparte died in exile on Saint Helena.'}],
  '5-14':[{y:1948,t:'State of Israel was proclaimed.'},{y:1804,t:'Lewis and Clark Expedition departed from Camp Dubois.'},{y:1973,t:'Skylab, first US space station, was launched.'}],
  '5-25':[{y:1977,t:'Star Wars was released in cinemas worldwide.'},{y:1961,t:'JFK announced goal to land on the Moon.'},{y:1979,t:'American Airlines Flight 191 crashed in Chicago.'}],
  '6-1':[{y:1926,t:'Marilyn Monroe was born in Los Angeles.'},{y:1980,t:'CNN launched as first 24-hour news network.'},{y:1967,t:'Beatles released Sgt. Peppers Lonely Hearts Club Band.'}],
  '6-12':[{y:1929,t:'Anne Frank was born in Frankfurt, Germany.'},{y:1963,t:'Civil rights leader Medgar Evers was assassinated.'},{y:1987,t:'Reagan challenged Gorbachev to tear down the Berlin Wall.'}],
  '6-18':[{y:1815,t:'Battle of Waterloo: Napoleon was defeated.'},{y:1928,t:'Amelia Earhart became first woman to fly across the Atlantic.'},{y:1983,t:'Sally Ride became first American woman in space.'}],
  '7-4':[{y:1776,t:'United States declared independence from Britain.'},{y:1826,t:'John Adams and Thomas Jefferson both died on this day.'},{y:1997,t:'Mars Pathfinder landed on Mars.'}],
  '7-18':[{y:1918,t:'Nelson Mandela was born in Mvezo, South Africa.'},{y:1969,t:'Ted Kennedy drove off Chappaquiddick Bridge.'},{y:1936,t:'Spanish Civil War began.'}],
  '7-20':[{y:1969,t:'Apollo 11: Neil Armstrong walked on the Moon.'},{y:1944,t:'Assassination attempt on Adolf Hitler failed.'},{y:1976,t:'Viking 1 landed on Mars.'}],
  '8-4':[{y:1961,t:'Barack Obama was born in Honolulu, Hawaii.'},{y:1914,t:'Britain declared war on Germany, entering World War I.'},{y:1944,t:'Anne Frank and family were arrested by Gestapo.'}],
  '8-6':[{y:1945,t:'Atomic bomb dropped on Hiroshima, Japan.'},{y:1991,t:'World Wide Web became publicly available.'},{y:1965,t:'Voting Rights Act signed by President Johnson.'}],
  '8-9':[{y:1945,t:'Atomic bomb dropped on Nagasaki, Japan.'},{y:1974,t:'Richard Nixon resigned as US President.'},{y:1963,t:'Great Train Robbery occurred in England.'}],
  '8-15':[{y:1947,t:'India gained independence from British rule.'},{y:1769,t:'Napoleon Bonaparte was born in Corsica.'},{y:1971,t:'Bahrain declared independence from the UK.'}],
  '8-26':[{y:1920,t:'19th Amendment ratified, giving women the right to vote.'},{y:1978,t:'Pope John Paul I was elected.'},{y:1883,t:'Krakatoa volcano erupted in Indonesia.'}],
  '9-5':[{y:1946,t:'Freddie Mercury was born in Zanzibar.'},{y:1972,t:'Munich massacre occurred at the Olympic Games.'},{y:1698,t:'Peter the Great imposed tax on beards in Russia.'}],
  '9-11':[{y:2001,t:'Terrorist attacks destroyed World Trade Center in New York.'},{y:1973,t:'Military coup overthrew Salvador Allende in Chile.'},{y:1789,t:'Alexander Hamilton became first US Secretary of the Treasury.'}],
  '9-15':[{y:1890,t:'Agatha Christie was born in Torquay, England.'},{y:1935,t:'Nuremberg Laws stripped Jews of German citizenship.'},{y:1916,t:'Tanks were used in battle for the first time.'}],
  '9-26':[{y:1888,t:'T.S. Eliot was born in St. Louis, Missouri.'},{y:1960,t:'First televised US presidential debate: Kennedy vs Nixon.'},{y:1983,t:'Soviet officer Stanislav Petrov prevented nuclear war.'}],
  '10-2':[{y:1869,t:'Mahatma Gandhi was born in Porbandar, India.'},{y:1950,t:'Peanuts comic strip by Charles Schulz first published.'},{y:1967,t:'Thurgood Marshall became first Black US Supreme Court Justice.'}],
  '10-9':[{y:1940,t:'John Lennon was born in Liverpool, England.'},{y:1967,t:'Che Guevara was executed in Bolivia.'},{y:1874,t:'Universal Postal Union was established.'}],
  '10-14':[{y:1947,t:'Chuck Yeager broke the sound barrier for the first time.'},{y:1066,t:'Battle of Hastings: William the Conqueror defeated King Harold.'},{y:1964,t:'Martin Luther King Jr. was awarded the Nobel Peace Prize.'}],
  '10-28':[{y:1955,t:'Bill Gates was born in Seattle, Washington.'},{y:1886,t:'Statue of Liberty was dedicated in New York Harbor.'},{y:1962,t:'Cuban Missile Crisis ended as Soviet ships turned back.'}],
  '11-9':[{y:1934,t:'Carl Sagan was born in Brooklyn, New York.'},{y:1989,t:'Berlin Wall fell, ending the Cold War division of Germany.'},{y:1938,t:'Kristallnacht: Nazi pogrom against Jews in Germany.'}],
  '11-19':[{y:1917,t:'Indira Gandhi was born in Allahabad, India.'},{y:1863,t:'Lincoln delivered the Gettysburg Address.'},{y:1969,t:'Apollo 12 astronauts landed on the Moon.'}],
  '11-22':[{y:1963,t:'President John F. Kennedy was assassinated in Dallas.'},{y:1718,t:'Blackbeard the pirate was killed in battle.'},{y:1990,t:'Margaret Thatcher resigned as British Prime Minister.'}],
  '11-30':[{y:1835,t:'Mark Twain was born in Florida, Missouri.'},{y:1874,t:'Winston Churchill was born at Blenheim Palace.'},{y:1954,t:'First meteorite to hit a human struck Ann Hodges in Alabama.'}],
  '12-5':[{y:1901,t:'Walt Disney was born in Chicago, Illinois.'},{y:1933,t:'Prohibition ended in the United States.'},{y:1955,t:'Montgomery Bus Boycott began after Rosa Parks arrest.'}],
  '12-16':[{y:1770,t:'Ludwig van Beethoven was born in Bonn, Germany.'},{y:1773,t:'Boston Tea Party took place in Boston Harbor.'},{y:1944,t:'Battle of the Bulge began in World War II.'}],
  '12-25':[{y:1642,t:'Isaac Newton was born in Woolsthorpe, England.'},{y:1991,t:'Soviet Union officially dissolved.'},{y:1914,t:'Christmas Truce: soldiers stopped fighting in World War I.'}],
  '12-31':[{y:1879,t:'Thomas Edison demonstrated incandescent light bulb publicly.'},{y:1999,t:'Y2K fears proved unfounded as millennium arrived.'},{y:1929,t:'Guy Lombardo played Auld Lang Syne on New Year Eve for first time.'}]
};
function getHistoryEvents(birth){
  var key=(birth.getMonth()+1)+'-'+birth.getDate();
  if(HISTORY_EVENTS[key])return HISTORY_EVENTS[key];
  // Find nearest date in same month
  var m=birth.getMonth()+1;
  var d=birth.getDate();
  var keys=Object.keys(HISTORY_EVENTS).filter(function(k){return k.split('-')[0]===String(m);});
  if(keys.length){
    keys.sort(function(a,b){return Math.abs(parseInt(a.split('-')[1])-d)-Math.abs(parseInt(b.split('-')[1])-d);});
    return HISTORY_EVENTS[keys[0]];
  }
  return [{y:1969,t:'Apollo 11 landed on the Moon.'},{y:1989,t:'The Berlin Wall fell, ending the Cold War.'},{y:1945,t:'World War II ended, reshaping the modern world.'}];
}

var MONTH_EVENTS={
  1:[{icon:'🌍',y:1945,t:'United Nations was founded.'},{icon:'🚀',y:1986,t:'Space Shuttle Challenger disaster.'},{icon:'🎵',y:1964,t:'Beatles arrived in the United States.'}],
  2:[{icon:'🌍',y:1945,t:'Yalta Conference shaped post-WWII world.'},{icon:'🎬',y:1895,t:'First public film screening by Lumière brothers.'},{icon:'✊',y:1965,t:'Malcolm X was assassinated.'}],
  3:[{icon:'🌍',y:1945,t:'Battle of Iwo Jima ended.'},{icon:'🔬',y:1876,t:'Alexander Graham Bell patented the telephone.'},{icon:'🎭',y:1616,t:'William Shakespeare died.'}],
  4:[{icon:'🚀',y:1961,t:'Yuri Gagarin became first human in space.'},{icon:'🌍',y:1912,t:'Titanic sank in the North Atlantic.'},{icon:'🎵',y:1994,t:'Kurt Cobain died.'}],
  5:[{icon:'🌍',y:1945,t:'World War II ended in Europe (V-E Day).'},{icon:'🔬',y:1953,t:'DNA double helix structure discovered.'},{icon:'⛰️',y:1953,t:'Edmund Hillary summited Mount Everest.'}],
  6:[{icon:'🌍',y:1944,t:'D-Day: Allied forces landed in Normandy.'},{icon:'🎵',y:1967,t:'Beatles released Sgt. Peppers Lonely Hearts Club Band.'},{icon:'🏆',y:1966,t:'England won the FIFA World Cup.'}],
  7:[{icon:'🚀',y:1969,t:'Apollo 11 landed on the Moon.'},{icon:'🌍',y:1776,t:'United States declared independence.'},{icon:'🎵',y:1985,t:'Live Aid concert raised millions for Africa.'}],
  8:[{icon:'🌍',y:1914,t:'World War I began.'},{icon:'✊',y:1963,t:'Martin Luther King Jr. delivered "I Have a Dream" speech.'},{icon:'🏅',y:2000,t:'Summer Olympics held in Sydney, Australia.'}],
  9:[{icon:'🌍',y:2001,t:'September 11 attacks in the United States.'},{icon:'🔬',y:1928,t:'Alexander Fleming discovered penicillin.'},{icon:'🎵',y:1969,t:'Beatles released Abbey Road album.'}],
  10:[{icon:'🌍',y:1962,t:'Cuban Missile Crisis began.'},{icon:'🔬',y:1901,t:'First Nobel Prizes were awarded.'},{icon:'🎵',y:1958,t:'Billboard Hot 100 chart was introduced.'}],
  11:[{icon:'🌍',y:1989,t:'Berlin Wall fell, ending the Cold War.'},{icon:'🔬',y:1895,t:'Wilhelm Röntgen discovered X-rays.'},{icon:'🎵',y:1963,t:'Beatles released "With the Beatles" album.'}],
  12:[{icon:'🌍',y:1991,t:'Soviet Union officially dissolved.'},{icon:'🚀',y:1972,t:'Apollo 17 — last humans walked on the Moon.'},{icon:'🎵',y:1967,t:'Beatles released Magical Mystery Tour.'}]
};

// ── Main render ───────────────────────────────────────────────
function renderAll(birth,name){
  _birth=birth;
  var _name=name||'';
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
  var dotEl=el('ring-dot');
  if(dotEl){
    var angle=(pct/100)*360-90;
    var rad=angle*Math.PI/180;
    var cx=130+110*Math.cos(rad),cy=130+110*Math.sin(rad);
    dotEl.setAttribute('cx',cx.toFixed(1));
    dotEl.setAttribute('cy',cy.toFixed(1));
  }

  // ── Stats row ──
  setText('stat-age',b.yy+' yrs '+b.mo+' mo');
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

  // ── Mini Calendar — show 10 years worth ──
  buildMiniCalendar(birth,t.day,10);

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

  // ── Country events ──
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
  setText('ff-weekends',fmt(Math.floor(t.wk)));
  setText('ff-mondays',fmt(Math.floor(t.day/7)));

  // ── Labels ──
  setText('history-date-label','Major events that happened on '+birth.toLocaleDateString('en-US',{month:'long',day:'numeric'}));
  setText('month-label','What happened in '+birth.toLocaleDateString('en-US',{month:'long'}));

  // ── Cal week labels ──
  setText('cal-date-start',birthStr);
  setText('cal-date-end',deathStr);
  var weeksLived=Math.floor(t.day/7);
  var totalWeeks=AVG_LIFESPAN_YEARS*52;
  setText('cal-week-now','Week '+fmt(weeksLived));
  setText('cal-week-end','Week '+fmt(totalWeeks));

  // ── Share card name ──
  if(_name){
    setText('sc-name-card',_name);
  } else {
    setText('sc-name-card',b.yy+' years old');
  }

  // ── Emotional result banner ──
  var b2=getBreakdown(birth);
  var t2=getTotals(birth);
  var pct2=Math.round(Math.min(100,(ageYears/AVG_LIFESPAN_YEARS)*100));
  var daysLeft2=Math.max(0,totalDays-t2.day);
  var weekendsLeft=Math.floor(daysLeft2/7);
  var shockEl=el('rb-shock');
  var insightEl=el('rb-insight');
  if(shockEl){
    var namePrefix=_name?_name+', you have':'You have';
    if(pct2>=50){
      shockEl.innerHTML='You have already used <strong>'+pct2+'%</strong> of your life. More than half is gone.';
    } else if(pct2>=30){
      shockEl.innerHTML='You have already used <strong>'+pct2+'%</strong> of your life — and most people your age never stop to notice.';
    } else {
      shockEl.innerHTML='You have already used <strong>'+pct2+'%</strong> of your life. The clock started the day you were born.';
    }
  }
  if(insightEl){
    insightEl.innerHTML=
      'You have lived <strong>'+fmt(t2.day)+' days</strong> and have roughly <strong>'+fmt(daysLeft2)+' days left</strong>. '+
      'Most people waste the next 25%. You don\'t have to.';
  }
  var weekendsEl=el('rb-weekends');
  if(weekendsEl){
    weekendsEl.innerHTML='You have only <strong>~'+fmt(weekendsLeft)+'</strong> weekends left. Use them well.';
  }

  // ── Animate ring count-up ──
  var ringProgressEl=el('ring-progress');
  if(ringProgressEl){
    var circFull=2*Math.PI*110;
    ringProgressEl.style.strokeDasharray=circFull;
    ringProgressEl.style.strokeDashoffset=circFull;
    setTimeout(function(){
      ringProgressEl.style.transition='stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)';
      ringProgressEl.style.strokeDashoffset=circ-(pct/100)*circ;
    },200);
    // count-up the % text
    var startPct=0;
    var targetPct=Math.round(pct);
    var step=targetPct/60;
    var counter=setInterval(function(){
      startPct+=step;
      if(startPct>=targetPct){startPct=targetPct;clearInterval(counter);}
      setText('ring-pct',Math.floor(startPct)+'%');
    },25);
  }

  // ── Update right-side quote ──
  var qDefault=el('hero-quote-default');
  var qResult=el('hero-quote-result');
  if(qDefault)qDefault.classList.add('hidden');
  if(qResult){
    qResult.classList.remove('hidden');
    setText('hqr-line1','You\'ve already spent '+pct2+'% of your life.');
    setText('hqr-line2','You have ~'+fmt(daysLeft2)+' days left.\nWhat will you do with them?');
    setText('hqr-line3','"The best time to start was yesterday. The next best time is now."');
  }

  // ── Highlight the Life Used stat card ──
  var statCards=document.querySelectorAll('.stat-card');
  statCards.forEach(function(c){c.classList.remove('stat-card-highlight');});
  if(statCards[3])statCards[3].classList.add('stat-card-highlight');
  clearInterval(window._ticker);
  window._ticker=setInterval(function(){tickUpdate(birth);},1000);
  tickUpdate(birth);

  // ── Save ──
  localStorage.setItem('aw_dob',birth.toISOString().split('T')[0]);
  if(_name)localStorage.setItem('aw_name',_name);
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
  setText('stat-age',b.yy+' yrs '+b.mo+' mo');
  setText('stat-age-days',fmt(t.day)+' days');
  setText('stat-days-used',fmt(t.day));
  setText('stat-hours-used',fmt(t.hr)+' hours');
  setText('stat-days-left',fmt(daysLeft));
  setText('stat-hours-left',fmt(daysLeft*24)+' hours');
  setText('stat-pct',Math.round(pct)+'%');
  setText('ff-heartbeats',fmtShort(Math.floor(t.day*24*60*70)));
}

function buildMiniCalendar(birth,daysLived,years){
  var grid=el('mini-cal-grid');
  if(!grid)return;
  var totalWeeks=AVG_LIFESPAN_YEARS*52;
  var weeksLived=Math.floor(daysLived/7);
  var show=Math.min(totalWeeks,52*(years||10));
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
  var name=(el('hero-name').value||'').trim();
  var errEl=el('hero-error');
  errEl.classList.add('hidden');
  if(!dob){errEl.textContent='Please enter your date of birth.';errEl.classList.remove('hidden');return;}
  var birth=parseDOB(dob);
  if(birth>new Date()){errEl.textContent='Date of birth cannot be in the future.';errEl.classList.remove('hidden');return;}
  renderAll(birth,name);
  track('calculate','main');
});

// Enter key on input
document.getElementById('hero-dob').addEventListener('keydown',function(e){
  if(e.key==='Enter')document.getElementById('btn-calculate').click();
});
document.getElementById('hero-name').addEventListener('keydown',function(e){
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
  if(!_birth){
    alert('Please calculate your life first by entering your date of birth.');
    document.getElementById('hero').scrollIntoView({behavior:'smooth'});
    return;
  }
  var t=getTotals(_birth);
  var b=getBreakdown(_birth);
  var pct=Math.min(100,((b.yy+b.mo/12)/AVG_LIFESPAN_YEARS)*100);
  setText('sc-pct',Math.round(pct)+'%');
  var savedName=localStorage.getItem('aw_name')||'';
  setText('sc-name-card',savedName||b.yy+' years old');
  var statsEl=el('sc-stats-card');
  if(statsEl)statsEl.innerHTML=
    fmt(t.day)+' days lived &nbsp;·&nbsp; '+
    fmtShort(Math.floor(t.day*24*60*70))+' heartbeats &nbsp;·&nbsp; '+
    Math.round(pct)+'% of life used';
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
  var btn=this;
  btn.textContent='⏳ Generating...';
  btn.disabled=true;
  html2canvas(card,{backgroundColor:'#0d0b1e',scale:2}).then(function(canvas){
    var a=document.createElement('a');
    a.download='agewise-life-card.png';
    a.href=canvas.toDataURL('image/png');
    a.click();
    btn.textContent='✅ Downloaded!';
    setTimeout(function(){btn.textContent='⬇️ Download Card';btn.disabled=false;},2000);
  }).catch(function(){
    btn.textContent='⬇️ Download Card';
    btn.disabled=false;
    alert('Download failed. Please screenshot instead.');
  });
});

// ── Explore toggle ────────────────────────────────────────────
document.getElementById('btn-explore-toggle').addEventListener('click',function(){
  var content=el('explore-content');
  var arrow=this.querySelector('.explore-arrow');
  var isHidden=content.classList.contains('hidden');
  content.classList.toggle('hidden');
  arrow.classList.toggle('open',isHidden);
  this.querySelector('span').textContent=isHidden?'✨ Hide Full Life Report':'✨ Explore Your Full Life Report';
  if(isHidden)content.scrollIntoView({behavior:'smooth',block:'start'});
});

// ── Result banner share/compare ───────────────────────────────
document.getElementById('rb-btn-share').addEventListener('click',openShare);
document.getElementById('rb-btn-compare').addEventListener('click',function(){
  if(!_birth)return;
  // Pre-fill compare: scroll to hero, show a compare prompt
  var d=_birth;
  var savedName=localStorage.getItem('aw_name')||'';
  // Store current user as person A in sessionStorage for compare
  sessionStorage.setItem('aw_compare_a',JSON.stringify({
    name:savedName,
    dob:d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')
  }));
  // Show a simple prompt
  var friendDob=prompt('Enter your friend\'s date of birth (YYYY-MM-DD):');
  if(!friendDob)return;
  var friendBirth=parseDOB(friendDob);
  if(isNaN(friendBirth.getTime())||friendBirth>new Date()){alert('Invalid date.');return;}
  var friendName=prompt('Enter their name (optional):')||'Friend';
  showComparison(_birth,savedName||'You',friendBirth,friendName);
});

function showComparison(birth1,name1,birth2,name2){
  var t1=getTotals(birth1),t2=getTotals(birth2);
  var b1=getBreakdown(birth1),b2=getBreakdown(birth2);
  var pct1=Math.round(Math.min(100,((b1.yy+b1.mo/12)/AVG_LIFESPAN_YEARS)*100));
  var pct2=Math.round(Math.min(100,((b2.yy+b2.mo/12)/AVG_LIFESPAN_YEARS)*100));
  var older=birth1<birth2?name1:name2;
  var diffDays=Math.abs(t1.day-t2.day);
  var msg=older+' is older by '+fmt(diffDays)+' days.\n\n'+
    name1+': '+pct1+'% of life used ('+fmt(t1.day)+' days)\n'+
    name2+': '+pct2+'% of life used ('+fmt(t2.day)+' days)\n\n'+
    'Difference: '+Math.abs(pct1-pct2)+'% of life';
  alert(msg);
}
document.getElementById('btn-all-twins').addEventListener('click',function(){
  if(!_birth)return;
  var m=_birth.getMonth()+1,d=_birth.getDate();
  var twins=TIME_TWINS.filter(function(t){return t.month===m;});
  if(!twins.length)twins=TIME_TWINS.slice(0,6);
  var listEl=el('twin-others');
  if(listEl){
    listEl.innerHTML=twins.map(function(o){
      return '<div class="twin-other-avatar" title="'+o.name+'" style="width:auto;border-radius:8px;padding:6px 10px;font-size:0.78rem;gap:6px;display:flex;align-items:center;">'+
        '<span>'+o.icon+'</span><span style="color:#c4b5fd;font-weight:600;">'+o.name+'</span></div>';
    }).join('');
    this.textContent='Show Less ↑';
    this.onclick=function(){renderTimeTwin(_birth);this.textContent='View All Time Twins →';this.onclick=null;};
  }
});

document.getElementById('btn-more-events').addEventListener('click',function(){
  if(!_birth)return;
  var allEvents=getHistoryEvents(_birth);
  var listEl=el('history-list');
  if(listEl){
    var colors=['history-dot-green','history-dot-yellow','history-dot-blue'];
    listEl.innerHTML=allEvents.map(function(e,i){
      return '<div class="history-item"><span class="history-dot '+colors[i%3]+'"></span><span class="history-year">'+e.y+'</span><span class="history-text">'+e.t+'</span></div>';
    }).join('');
    this.style.display='none';
  }
});

document.getElementById('btn-explore-more').addEventListener('click',function(){
  if(!_birth)return;
  var m=_birth.getMonth()+1;
  var allMonthEvents=MONTH_EVENTS[m]||MONTH_EVENTS[8];
  var listEl=el('month-list');
  if(listEl){
    listEl.innerHTML=allMonthEvents.map(function(e){
      return '<div class="month-item"><span class="month-icon">'+e.icon+'</span><span class="month-year">'+e.y+'</span><span class="month-text">'+e.t+'</span><span class="month-arrow">›</span></div>';
    }).join('');
    this.style.display='none';
  }
});

document.getElementById('btn-country-more').addEventListener('click',function(){
  if(!_birth)return;
  var events=getHistoryEvents(_birth);
  var countryEl=el('country-events');
  if(countryEl){
    countryEl.innerHTML=events.map(function(e){
      return '<div class="ce-item-sm"><span class="ce-year">'+e.y+'</span>'+e.t+'</div>';
    }).join('');
    this.style.display='none';
  }
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

// ── Restore last DOB + name ───────────────────────────────────
(function(){
  var savedDob=localStorage.getItem('aw_dob');
  var savedName=localStorage.getItem('aw_name');
  if(savedDob){var inp=el('hero-dob');if(inp)inp.value=savedDob;}
  if(savedName){var nameInp=el('hero-name');if(nameInp)nameInp.value=savedName;}
})();