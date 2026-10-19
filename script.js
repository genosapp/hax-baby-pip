// ---------- state ----------
let muted = localStorage.getItem('pip-muted') === '1';
let day = localStorage.getItem('pip-day') === '1';
const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;

// ---------- audio (tiny synth giggle / chime, no files needed) ----------
function playTone(freq, dur, type='sine', vol=0.18){
  if(muted || !audioCtx) return;
  if(audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type; osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + dur);
}
function giggle(){ [660,880,990].forEach((f,i)=>setTimeout(()=>playTone(f,0.18,'triangle',0.12), i*90)); }
function chime(){ playTone(523.25,0.5,'sine',0.15); setTimeout(()=>playTone(783.99,0.6,'sine',0.12),150); }
function click(){ playTone(300,0.08,'square',0.06); }

// ---------- mute toggle ----------
const muteBtn = document.getElementById('mute-toggle');
function renderMute(){ muteBtn.textContent = muted ? '🔇 Muted' : '🔊 Sound'; }
muteBtn.addEventListener('click', ()=>{
  muted = !muted; localStorage.setItem('pip-muted', muted ? '1':'0'); renderMute();
  if(!muted) chime();
});
renderMute();

// ---------- day/night toggle ----------
const modeBtn = document.getElementById('mode-toggle');
function renderMode(){
  document.body.classList.toggle('day', day);
  modeBtn.textContent = day ? '☀️ Day' : '🌙 Night';
}
modeBtn.addEventListener('click', ()=>{ day = !day; localStorage.setItem('pip-day', day?'1':'0'); renderMode(); click(); });
renderMode();

// ---------- cursor-reactive hero (eyes/head tilt), with touch fallback ----------
const heroes = document.querySelectorAll('.hero-char');
function tilt(x, y){
  heroes.forEach(h=>{
    const rect = h.getBoundingClientRect();
    const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    const dx = (x - cx) / rect.width, dy = (y - cy) / rect.height;
    const rot = Math.max(-12, Math.min(12, dx * 14));
    const ty = Math.max(-6, Math.min(6, dy * 8));
    h.style.transform = `rotate(${rot}deg) translateY(${ty}px)`;
  });
}
window.addEventListener('mousemove', e => tilt(e.clientX, e.clientY));
window.addEventListener('touchmove', e => {
  if(e.touches[0]) tilt(e.touches[0].clientX, e.touches[0].clientY);
}, {passive:true});

// ---------- scroll-driven reveal ----------
const scenes = document.querySelectorAll('.scene');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(ent=>{ if(ent.isIntersecting) ent.target.classList.add('visible'); });
}, {threshold:0.2});
scenes.forEach(s=>io.observe(s));

// ---------- project card interactions ----------
document.getElementById('card-lullaby').addEventListener('click', chime);
document.getElementById('card-nightlight').addEventListener('click', ()=>{ playTone(440,0.4,'sine',0.14); document.body.classList.add('day'); day=true; localStorage.setItem('pip-day','1'); renderMode(); });
document.getElementById('rattle-toy').addEventListener('click', ()=>{
  const el = document.getElementById('rattle-toy');
  el.style.transform = `rotate(${(Math.random()*40-20).toFixed(0)}deg) scale(1.2)`;
  playTone(200+Math.random()*300, 0.12, 'square', 0.1);
  setTimeout(()=>{ el.style.transform=''; }, 200);
});

// ---------- hidden easter egg: click Pip's hero image wakes him up ----------
document.getElementById('pip-hero').addEventListener('click', ()=>{
  document.getElementById('egg-pop').style.display = 'flex';
  giggle();
});

// ---------- hit counter odometer (localStorage) ----------
const odo = document.getElementById('odometer');
let dreams = parseInt(localStorage.getItem('pip-dreams') || '184203', 10);
dreams += 1;
localStorage.setItem('pip-dreams', dreams);
odo.textContent = 'Dreams delivered: ' + String(dreams).padStart(6,'0');

// ---------- guestbook (localStorage-backed wish wall) ----------
const wishForm = document.getElementById('wish-form');
const wishesList = document.getElementById('wishes-list');
function loadWishes(){
  const wishes = JSON.parse(localStorage.getItem('pip-wishes') || '[]');
  wishesList.innerHTML = wishes.slice(-20).reverse().map(w =>
    `<div class="wish"><strong>${escapeHtml(w.name)}</strong>: ${escapeHtml(w.text)}</div>`).join('');
}
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
wishForm.addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('wish-name').value.trim();
  const text = document.getElementById('wish-text').value.trim();
  if(!name || !text) return;
  const wishes = JSON.parse(localStorage.getItem('pip-wishes') || '[]');
  wishes.push({name, text});
  localStorage.setItem('pip-wishes', JSON.stringify(wishes));
  wishForm.reset();
  loadWishes();
  chime();
});
loadWishes();

// ---------- sparkle cursor trail ----------
const canvas = document.getElementById('sparkle-canvas');
const ctx = canvas.getContext('2d');
function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();
let particles = [];
function spawnSparkle(x,y){
  particles.push({x,y,r:Math.random()*3+2,vy:-(Math.random()*1.2+0.4),vx:(Math.random()-0.5)*0.6,life:1,hue: day ? 330 : 50});
}
window.addEventListener('mousemove', e=>{ if(Math.random()<0.5) spawnSparkle(e.clientX, e.clientY); });
window.addEventListener('touchmove', e=>{ const t=e.touches[0]; if(t) spawnSparkle(t.clientX,t.clientY); }, {passive:true});
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.life-=0.02;
    ctx.globalAlpha = Math.max(p.life,0);
    ctx.fillStyle = `hsl(${p.hue}, 90%, 70%)`;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  });
  particles = particles.filter(p=>p.life>0);
  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}
animate();
