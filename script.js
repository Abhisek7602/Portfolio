/* ============================================================
   LOADER
============================================================ */
(function () {
  const fill = document.getElementById('loaderFill');
  const pct = document.getElementById('loaderPct');
  const loader = document.getElementById('loader');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 12 + 3;
    if (p > 100) {
      p = 100;
      clearInterval(iv);
      setTimeout(() => { loader.classList.add('hidden'); startCounters(); }, 300);
    }
    fill.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
  }, 60);
})();

/* ============================================================
   PARTICLE CANVAS
============================================================ */
(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 70; i++) {
    pts.push({ x: Math.random() * 2000, y: Math.random() * 1200, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.5 + 0.5 });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,229,200,0.35)'; ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,229,200,${0.08 * (1 - dist / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   CUSTOM CURSOR
============================================================ */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 5}px,${my - 5}px)`;
});
document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
(function raf() { rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1; ring.style.transform = `translate(${rx - 19}px,${ry - 19}px)`; requestAnimationFrame(raf); })();
document.querySelectorAll('a,button,.skill-item,.project-card,.cert-card,.tool-tag').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); ring.classList.add('hovering'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); ring.classList.remove('hovering'); });
});

/* ============================================================
   SCROLL PROGRESS + NAV COMPACT + ACTIVE LINKS
============================================================ */
const scrollBar = document.getElementById('scroll-bar');
const mainNav = document.getElementById('mainNav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  const st = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = (st / docH * 100) + '%';
  mainNav.classList.toggle('compact', st > 60);
  let cur = '';
  sections.forEach(s => { if (st >= s.offsetTop - 200) cur = s.id; });
  navLinks.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
}, { passive: true });

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('.skill-progress').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
        bar.classList.add('anim');
      });
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => revObs.observe(el));

/* ============================================================
   ANIMATED STAT COUNTERS
============================================================ */
function startCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = +el.dataset.target;
    const suffix = el.querySelector('span').outerHTML;
    let current = 0;
    const step = target / 40;
    const iv = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(iv); }
      el.innerHTML = Math.floor(current) + suffix;
    }, 30);
  });
}

/* ============================================================
   TYPING EFFECT
============================================================ */
(function () {
  const el = document.getElementById('typedText');
  const words = ['Raw Data', 'Numbers', 'Patterns'];
  let wi = 0, ci = 0, del = false;
  function type() {
    const w = words[wi];
    if (!del) { el.textContent = w.slice(0, ++ci); if (ci === w.length) { del = true; setTimeout(type, 1400); return; } }
    else { el.textContent = w.slice(0, --ci); if (ci === 0) { del = false; wi = (wi + 1) % words.length; } }
    setTimeout(type, del ? 55 : 95);
  }
  setTimeout(type, 1800);
})();

/* ============================================================
   TILT EFFECT
============================================================ */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(600px) rotateX(0) rotateY(0)'; });
});

/* ============================================================
   RIPPLE EFFECT
============================================================ */
document.querySelectorAll('.btn-primary,.btn-secondary').forEach(btn => {
  btn.addEventListener('click', e => {
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
});

/* ============================================================
   PROJECT MODAL DATA
============================================================ */
const projects = [
  {
    tag: 'Retail Analytics · RFM',
    title: 'Consumer360 — Retail Analytics Pipeline',
    body: 'Built an end-to-end retail analytics pipeline on PostgreSQL using a Star Schema, automating ETL with Python to process 10K+ transactions across 283 customers. Applied RFM segmentation to surface high-value "Champion" customers and ran Market Basket Analysis uncovering 234 product association rules — translating directly into targeted retention campaigns and cross-sell strategies, visualized in an executive Power BI dashboard.',
    stats: [{ n: '10K+', l: 'Transactions Processed' }, { n: '283', l: 'Customers Segmented' }, { n: '234', l: 'Association Rules Mined' }],
    tech: ['Python', 'SQL', 'PostgreSQL', 'Pandas', 'Power BI', 'Excel']
  },
  {
    tag: 'Churn Analysis · EDA',
    title: 'Telecom Customer Churn Analysis',
    body: 'Analyzed churn behavior across 7,043 telecom customers using Python and Matplotlib, applying EDA and segmentation to isolate three high-impact drivers — month-to-month contracts, electronic check payments, and fiber-optic service — behind a 26.5% churn rate. Findings translated into a prioritized retention playbook: long-term contract incentives and bundled support services targeting the highest-risk customer segments.',
    stats: [{ n: '26.5%', l: 'Churn Rate Identified' }, { n: '7,043', l: 'Customers Analyzed' }, { n: '3', l: 'Key Churn Drivers' }],
    tech: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'SQL', 'EDA']
  },
  {
    tag: 'Content Analysis · SQL',
    title: 'Netflix Content Strategy Analysis',
    body: 'Analyzed 8,800+ Netflix titles across 12 countries using SQL and PostgreSQL. Segmented content into movies and TV shows, identified top-rated categories, and uncovered regional trends. Key finding — India ranks among the top 3 content contributors, with documentary and thriller genres dominating engagement-focused listings.',
    stats: [{ n: '8,800+', l: 'Titles Analyzed' }, { n: '12', l: 'Countries Covered' }, { n: 'Top 3', l: 'India Content Rank' }],
    tech: ['SQL', 'PostgreSQL', 'EDA']
  },
  {
    tag: 'Financial Analytics · Excel',
    title: 'Bank Loan Report Dashboard',
    body: 'Built an end-to-end interactive loan analytics dashboard entirely in Microsoft Excel, transforming 38.6K loan applications into a multi-page reporting suite. Engineered PivotTable-powered KPI cards tracking $435.8M in funded amount with MTD and MOM trends, segmented portfolio quality into 86.18% good loans vs 13.82% bad debt exposure — surfacing debt consolidation as the dominant loan purpose and interest rate as a key default predictor, with dynamic Grade and Purpose slicers for cross-page filtering.',
    stats: [{ n: '38.6K', l: 'Loan Applications' }, { n: '$435.8M', l: 'Funded Amount Tracked' }, { n: '86.18%', l: 'Good Loan Rate' }],
    tech: ['Excel', 'Power Query', 'PivotTables', 'Excel Charts', 'Slicers', 'Conditional Formatting']
  },
  {
    tag: 'Sales Analytics · SQL',
    title: 'Walmart Sales Data Analysis',
    body: 'Built an end-to-end sales analytics pipeline on PostgreSQL using Python, automating ETL to clean, transform, and load Walmart transactional data via SQLAlchemy. Executed complex SQL queries to uncover revenue trends across branches, peak sales periods, and top-performing categories — translating findings into actionable insights on customer buying patterns, payment preferences, and profit margins by location.',
    stats: [{ n: '10K+', l: 'Transactions Analyzed' }, { n: '3', l: 'Branches Compared' }, { n: '9', l: 'Business Problems Solved' }],
    tech: ['Python', 'SQL', 'PostgreSQL', 'Pandas', 'SQLAlchemy', 'NumPy']
  }
];

function openModal(i) {
  const p = projects[i];
  document.getElementById('modalTag').textContent = p.tag;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalBody').textContent = p.body;
  document.getElementById('modalStats').innerHTML = p.stats.map(s => `<div><div class="modal-stat-num">${s.n}</div><div class="modal-stat-label">${s.l}</div></div>`).join('');
  document.getElementById('modalTech').innerHTML = p.tech.map(t => `<span class="modal-tech-tag">${t}</span>`).join('');
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() { document.getElementById('modal').classList.remove('open'); document.body.style.overflow = ''; }
document.getElementById('modal').addEventListener('click', e => { if (e.target === document.getElementById('modal')) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
window.openModal = openModal;
window.closeModal = closeModal;

/* ============================================================
   MOBILE MENU
============================================================ */
function toggleMobile() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}
window.toggleMobile = toggleMobile;
window.closeMobile = closeMobile;

/* ============================================================
   CONTACT FORM + TOAST
============================================================ */
function showToast(msg, err = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.borderColor = err ? 'var(--accent2)' : 'var(--accent)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}
function sendForm() {
  const n = document.getElementById('f-name').value.trim();
  const e = document.getElementById('f-email').value.trim();
  const m = document.getElementById('f-message').value.trim();
  if (!n || !e || !m) { showToast('⚠  Please fill in all required fields.', true); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { showToast('⚠  Please enter a valid email.', true); return; }
  showToast('✓  Message sent! I\'ll get back to you soon.');
  ['f-name', 'f-email', 'f-subject', 'f-message'].forEach(id => document.getElementById(id).value = '');
}
window.sendForm = sendForm;

/* ============================================================
   SMOOTH ANCHOR SCROLL
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ============================================================
   MAGNETIC BUTTONS
============================================================ */
document.querySelectorAll('.mag-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});
