/* ===== LOADER ===== */
const loader = document.getElementById('loader');
const fill = document.getElementById('loaderFill');
let prog = 0;
const iv = setInterval(() => {
  prog += Math.random() * 15;
  if (prog >= 100) { prog = 100; clearInterval(iv); setTimeout(() => { loader.style.opacity = '0'; loader.style.transition = 'opacity 0.5s'; setTimeout(() => loader.remove(), 500); initXP(); }, 400); }
  fill.style.width = prog + '%';
}, 120);

/* ===== CANVAS PARTICLES ===== */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const emos = ['🍯','🐵','💛','🌸','✨','😚','🫂','🍫','🌼'];
let W, H, pts = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);
for (let i = 0; i < 22; i++) pts.push({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight + window.innerHeight,
  e: emos[i % emos.length],
  s: 14 + Math.random() * 16,
  vx: (Math.random() - 0.5) * 0.4,
  vy: -(0.4 + Math.random() * 0.7),
  o: Math.random() * 0.6 + 0.3,
  r: (Math.random() - 0.5) * 0.02,
  rot: 0
});
function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.o;
    ctx.font = p.s + 'px serif';
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillText(p.e, 0, 0);
    ctx.restore();
    p.x += p.vx; p.y += p.vy; p.rot += p.r;
    if (p.y < -80) { p.y = H + 40; p.x = Math.random() * W; }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ===== NAV ===== */
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
burger.addEventListener('click', () => {
  drawer.classList.toggle('open');
  burger.classList.toggle('open');
});
function closeDrawer() { drawer.classList.remove('open'); burger.classList.remove('open'); }

/* ===== HERO XP ===== */
function initXP() {
  setTimeout(() => { document.getElementById('heroXP').style.width = '100%'; }, 300);
}

/* ===== INTERSECTION OBSERVER ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.12 });
document.querySelectorAll('.tl-item, .why-item').forEach(el => io.observe(el));

/* ===== CARD FLIP ===== */
function flipCard(card) {
  card.classList.toggle('flipped');
}

/* ===== CHOCOLATE MODAL ===== */
document.querySelectorAll('.choco-card').forEach(card => {
  card.addEventListener('click', () => {
    document.getElementById('cmName').textContent = card.dataset.name + ' 🍫';
    document.getElementById('cmFact').textContent = card.dataset.fact;
    document.getElementById('chocoModal').classList.remove('hidden');
  });
});
function closeChoco() { document.getElementById('chocoModal').classList.add('hidden'); }

/* ===== QUIZ ===== */
const questions = [
  { q: "Which date did the first birthday wish arrive? 🎂", opts: ["September 1", "September 5", "September 15", "October 5"], ans: 1 },
  { q: "When did our daily conversations officially begin? 💬", opts: ["September 1", "September 5", "September 15", "October 1"], ans: 2 },
  { q: "What secret was discovered about her? 🍫", opts: ["She likes music", "She likes chocolate", "She likes movies", "She likes cats"], ans: 1 },
  { q: "How long was that unforgettable sleepless chat? 🌙", opts: ["3 hours", "5 hours", "From 10PM to 6AM", "All day long"], ans: 2 },
  { q: "What was the special meeting spot in college? 💧", opts: ["Canteen", "Library", "Water tank side", "Rooftop"], ans: 2 },
  { q: "What emoji made the heart melt completely? 💛", opts: ["🫂", "😊", "😚", "💖"], ans: 2 },
  { q: "What cute nickname does she have? 🐵", opts: ["Tiger cub", "Bunny", "Japanese Korangu", "Golden Bee"], ans: 2 },
  { q: "What was the first kind of kiss shared? 💫", opts: ["Real kiss", "Forehead kiss", "Kiss emoji 😚", "Air kiss"], ans: 2 },
];

let cQ = 0, score = 0, streak = 0, answered = false;

function initQuiz() {
  cQ = 0; score = 0; streak = 0; answered = false;
  document.getElementById('quizResult').classList.add('hidden');
  document.getElementById('quizCard').classList.remove('hidden');
  document.getElementById('qScore').textContent = '0';
  document.getElementById('qStreak').textContent = '0🔥';
  loadQ();
}

function loadQ() {
  const q = questions[cQ];
  document.getElementById('qTag').textContent = 'Q' + (cQ + 1);
  document.getElementById('qNum').textContent = (cQ + 1) + '/' + questions.length;
  document.getElementById('qQuestion').textContent = q.q;
  document.getElementById('qXPFill').style.width = (cQ / questions.length * 100) + '%';
  const opts = document.getElementById('qOpts');
  opts.innerHTML = '';
  q.opts.forEach((o, i) => {
    const btn = document.createElement('button');
    btn.className = 'qopt';
    btn.textContent = o;
    btn.onclick = () => pick(i, btn);
    opts.appendChild(btn);
  });
  answered = false;
}

function pick(idx, btn) {
  if (answered) return;
  answered = true;
  const q = questions[cQ];
  document.querySelectorAll('.qopt').forEach((b, i) => {
    b.disabled = true;
    if (i === q.ans) b.classList.add('correct');
  });
  if (idx === q.ans) {
    score++;
    streak++;
    btn.classList.add('correct');
    showToast('✅ Correct! +' + (streak > 2 ? '🔥 Streak!' : ''));
  } else {
    btn.classList.add('wrong');
    streak = 0;
    showToast('❌ Oops! Better luck next one 😊');
  }
  document.getElementById('qScore').textContent = score;
  document.getElementById('qStreak').textContent = streak + '🔥';
  setTimeout(() => {
    cQ++;
    if (cQ < questions.length) { loadQ(); }
    else { showQResult(); }
  }, 1500);
}

function showQResult() {
  document.getElementById('quizCard').classList.add('hidden');
  document.getElementById('quizResult').classList.remove('hidden');
  document.getElementById('qXPFill').style.width = '100%';
  document.getElementById('qrScore').textContent = score;
  const data = score === 8
    ? { t: '🏆', ti: 'Perfect Score!', m: 'Namma story un heart-la engum iruku 🥹💛 Romba proud maaduu!' }
    : score >= 6
    ? { t: '🌸', ti: 'So Good!', m: 'Almost perfect! Un korangu satisfied 😁💛' }
    : score >= 4
    ? { t: '🥞', ti: 'Not Bad Honey!', m: 'Innum konjam padikanum maaduu 😄🍯' }
    : { t: '😅', ti: 'Try Again!', m: 'Namma story again padikanum diii 😁🐵' };
  document.getElementById('qrTrophy').textContent = data.t;
  document.getElementById('qrTitle').textContent = data.ti;
  document.getElementById('qrMsg').textContent = data.m;
}

initQuiz();

/* ===== FLAMES ===== */
const flItems = document.querySelectorAll('.fl-item');
const flNames = ['Friends','Love','Affection','Marriage','Enemies','Siblings'];

function highlightFlames(result) {
  flItems.forEach((el, i) => {
    el.classList.toggle('active', flNames[i] === result);
  });
}

async function calcFlames() {
  const n1 = document.getElementById('fn1').value.trim();
  const n2 = document.getElementById('fn2').value.trim();
  if (!n1 || !n2) { showToast('Enter both names first! 💛'); return; }

  const btn = document.querySelector('.ff-btn');
  btn.textContent = '🔥 Calculating...';
  btn.disabled = true;

  try {
    const res = await fetch('/flames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name1: n1, name2: n2 })
    });
    const data = await res.json();

    // Animate through flames letters
    let idx = 0;
    const anim = setInterval(() => {
      highlightFlames(flNames[idx % 6]);
      idx++;
    }, 150);

    setTimeout(() => {
      clearInterval(anim);
      highlightFlames(data.result);

      const msgs = {
        'Marriage': '💍', 'Love': '💖', 'Friends': '🤝',
        'Affection': '🌸', 'Enemies': '⚡', 'Siblings': '👫'
      };

      document.getElementById('fResRing').textContent = data.emoji || msgs[data.result] || '🔥';
      document.getElementById('fResNames').textContent = n1 + ' 💛 ' + n2;
      document.getElementById('fResLabel').textContent = data.result;
      document.getElementById('fResMsg').textContent = data.msg;

      const resDiv = document.getElementById('flamesRes');
      resDiv.classList.remove('hidden');
      resDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1800);

  } catch (e) {
    showToast('Something went wrong! 😅');
  } finally {
    setTimeout(() => { btn.textContent = '🔥 Calculate'; btn.disabled = false; }, 2100);
  }
}

/* ===== LOVE LETTER ===== */
function openEnvelope() {
  const env = document.getElementById('envelope');
  env.style.transform = 'scale(0) rotate(10deg)';
  env.style.opacity = '0';
  env.style.transition = 'all 0.4s ease';
  setTimeout(() => {
    env.style.display = 'none';
    document.getElementById('letterPaper').classList.remove('hidden');
    showToast('💌 A message from the heart 🥹💛');
  }, 400);
}

/* ===== TOAST ===== */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2500);
}

/* ===== SCROLL NAV HIGHLIGHT ===== */
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
  document.querySelectorAll('.dl').forEach(l => {
    const active = l.getAttribute('href') === '#' + cur;
    l.style.color = active ? 'var(--hd)' : '';
    l.style.background = active ? 'var(--hll)' : '';
  });
});
