const $=s=>document.querySelector(s),app=$('#app');
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
const iso=d=>d.toLocaleDateString('en-CA');
const KIDS={henry:{n:'Henry',e:'🚀⚙️',cls:'henry'},frankie:{n:'Frankie',e:'🦸✏️',cls:'frankie'}};
let INDEX=[];const get=d=>fetch('content/'+d+'.json').then(r=>r.ok?r.json():null);
function home(){app.innerHTML=`<div class="home"><h1>🌵 Mesler Learning Lab 🌵</h1><div class="btns">
<button class="big bh" onclick="go('henry')">⚙️ HENRY 🚀</button><button class="big bf" onclick="go('frankie')">💥 FRANKIE 🦸</button></div>
<div class="foot"><a href="#parents">Parents</a></div></div>`}
function go(k){location.hash=k}
async function kid(k,date){const K=KIDS[k];const today=iso(new Date());const dow=new Date().getDay();
 let d=date||today,c=await get(d),msg='';
 if(!c){const past=INDEX.filter(x=>x<=today);d=past.length?past[past.length-1]:INDEX[0];c=await get(d);
  msg=(dow==0||dow==6)?(k=='henry'?'🛰️ Weekend! Lab is closed — go build something! Here is the latest mission:':'🎉 It\'s the weekend, hero! Rest your powers! Here is the latest one:'):'No new lesson yet for today — here is the latest:'}
 const L=c[k];app.innerHTML=`<div class="${K.cls}"><div class="wrap"><a href="#">🏠 Home</a>
 <h1>${K.e} ${k=='henry'?"Henry's Engineering Lab":"Super Frankie!"}</h1>${msg?`<div class="card">${msg}</div>`:''}
 <div class="card"><b>${new Date(d+'T12:00').toDateString()} — ${c.subject.toUpperCase()}</b><h2>${L.title}</h2><p>${L.intro}</p><ol>${L.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
 <h3>${k=='henry'?'🔬 Tools & Sims':'📺 Watch & Play'}</h3>${L.links.map(([t,u,i])=>`<p><button class="act" onclick="window.open('${u}','_blank')">${t}</button> ${i||''}</p>`).join('')}</div>
 <div class="card"><button class="printbig" onclick="window.print()">🖨️ PRINT MY WORKSHEET</button>
 <div id="ws" class="ws"><h2>${K.n}'s Worksheet — ${L.title}</h2><p>Name: ____________ Date: ${d}</p><ol>${L.worksheet.map(q=>`<li>${q}</li>`).join('')}</ol></div></div>
 <div class="card">Other days: ${INDEX.map(x=>`<a href="#${k}/${x}">${x.slice(5)}</a>`).join(' · ')}</div>
 <p><a href="#parents">Parents</a></p></div></div>`}
const DB=()=>JSON.parse(localStorage.kl||'{}'),save=o=>localStorage.kl=JSON.stringify(o);
async function parents(){const db=DB(),rows=[];for(const d of INDEX){const c=await get(d);for(const k in KIDS){const r=db[d+'|'+k]||{};
 rows.push(`<tr><td>${d}</td><td>${KIDS[k].n}</td><td>${c.subject}</td><td><select data-id="${d}|${k}" data-f="score"><option></option>${[5,4,3,2,1].map(n=>`<option ${r.score==n?'selected':''}>${n}</option>`).join('')}</select></td>
 <td><input type="number" data-id="${d}|${k}" data-f="mins" value="${r.mins||''}"></td><td><input data-id="${d}|${k}" data-f="notes" value="${(r.notes||'').replace(/"/g,'&quot;')}"></td></tr>`)}}
 app.innerHTML=`<div class="parent"><div class="wrap"><a href="#">🏠 Home</a><h1>Parent Dashboard</h1><p>Score 1 (needs practice) – 5 (got it). Saved automatically on this device.</p>
 <table><tr><th>Date</th><th>Kid</th><th>Subject</th><th>Score</th><th>Minutes</th><th>Notes</th></tr>${rows.join('')}</table>
 <h2>🖨️ Printer Setup (Windows, one-click printing)</h2>
 <ol><li>Set your default printer: Start → Settings → Bluetooth &amp; devices → Printers &amp; scanners. Turn <b>off</b> "Let Windows manage my default printer", click your printer → <b>Set as default</b>.</li>
 <li>Close <b>all</b> Chrome windows (check the system tray too). Kiosk printing only works if Chrome starts fresh from this shortcut.</li>
 <li>Right-click the desktop → New → Shortcut. For the location, paste:<br><code>"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --kiosk-printing https://rmesler3-boop.github.io/kids-learning/</code></li>
 <li>Name it "Learning Lab". If Chrome is somewhere else, right-click a Chrome shortcut → Properties to copy its path.</li>
 <li>Open the app with that shortcut. Now <b>Print My Worksheet</b> goes straight to the default printer with no dialog.</li></ol>
 <p>Android: Chrome always shows the system print screen. Choose the printer and tap the print button.</p>
 <h2>Strengths & Weaknesses</h2><div id="sum"></div>
 <button class="act" onclick="exp()">Export JSON</button> <label class="act">Import JSON <input type="file" accept=".json" onchange="imp(this)" hidden></label></div></div>`;
 app.querySelectorAll('[data-id]').forEach(el=>el.onchange=()=>{const db=DB(),o=db[el.dataset.id]||{};o[el.dataset.f]=el.value;db[el.dataset.id]=o;save(db);summary()});summary()}
async function summary(){const db=DB(),agg={};for(const key in db){const[d,k]=key.split('|');const c=await get(d);if(!c||!db[key].score)continue;
 const a=(agg[k]=agg[k]||{})[c.subject]=(agg[k]||{})[c.subject]||[];a.push(+db[key].score)}
 $('#sum').innerHTML=Object.keys(KIDS).map(k=>{const s=agg[k]||{};const e=Object.entries(s).map(([sub,v])=>[sub,v.reduce((a,b)=>a+b)/v.length]).sort((a,b)=>b[1]-a[1]);
 return `<p><b>${KIDS[k].n}:</b> ${e.length?e.map(([s,v])=>`${s} ${v.toFixed(1)} ${v>=4?'💪':v<3?'⚠️':''}`).join(' · '):'no scores yet'}</p>`}).join('')}
function exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([localStorage.kl||'{}'],{type:'application/json'}));a.download='kids-progress.json';a.click()}
function imp(i){i.files[0].text().then(t=>{save(JSON.parse(t));parents()})}
async function route(){if(!INDEX.length)INDEX=await fetch('content/index.json').then(r=>r.json());const[h,d]=location.hash.slice(1).split('/');
 if(KIDS[h])kid(h,d);else if(h=='parents')parents();else home();scrollTo(0,0)}
addEventListener('hashchange',route);route();
