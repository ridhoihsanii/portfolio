/* ─── AOS Init + Scroll animations + Dark mode + Nav + Skills ─── */

document.addEventListener('DOMContentLoaded', () => {

  // ── AOS ─────────────────────────────────────────────────────
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });

  // ── Dark Mode ────────────────────────────────────────────────
  const html       = document.documentElement;
  const themeBtn   = document.getElementById('themeToggle');
  const themeIcon  = document.getElementById('themeIcon');

  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(theme) {
    html.dataset.theme = theme;
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  // ── Sticky Navbar ────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // ── Active nav link on scroll ─────────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  // ── Mobile hamburger ─────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => navMenu.classList.remove('open'));
  });

  // ── Back to Top ───────────────────────────────────────────────
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Skill bar animation via IntersectionObserver ─────────────
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target;
        fill.style.width = fill.dataset.w + '%';
        skillObs.unobserve(fill);
      }
    });
  }, { threshold: 0.2 });

  skillFills.forEach(f => skillObs.observe(f));

  // ── Role Cycler ───────────────────────────────────────────────
  const roles    = ['Backend Systems', 'Automation Tools', 'Clean Web Apps', 'Java Solutions'];
  let   roleIdx  = 0;
  const cycler   = document.getElementById('roleCycler');

  function cycleRole() {
    cycler.style.opacity = '0';
    cycler.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      roleIdx = (roleIdx + 1) % roles.length;
      cycler.textContent = roles[roleIdx];
      cycler.style.opacity = '1';
      cycler.style.transform = 'translateY(0)';
    }, 300);
  }

  cycler.style.transition = 'opacity .3s ease, transform .3s ease';
  setInterval(cycleRole, 2800);

  // ── Smooth scroll for hero CTA ────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Hover tilt on project cards ───────────────────────────────
  document.querySelectorAll('.project-card:not(.project-card-placeholder)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Draggable Photo Badges ────────────────────────────────────
  initDraggableBadges();

  // ── Like Button ───────────────────────────────────────────────
  initLikeButton();

  // ── Share Button ──────────────────────────────────────────────
  initShareButton();

  // ── Resume Run Game ───────────────────────────────────────────
  initResumeRun();

});

function initDraggableBadges() {
  document.querySelectorAll('.photo-badge').forEach(badge => {
    let dragging  = false;
    let hasMoved  = false;
    let ox = 0, oy = 0;
    let homeX = 0, homeY = 0;

    badge.style.cursor = 'grab';
    badge.title = 'Drag me!';

    const onStart = (cx, cy) => {
      const r = badge.getBoundingClientRect();
      homeX = r.left;
      homeY = r.top;
      ox = cx - r.left;
      oy = cy - r.top;
      dragging  = true;
      hasMoved  = false;

      // Switch to fixed so badge is always above everything
      Object.assign(badge.style, {
        position:   'fixed',
        left:       r.left + 'px',
        top:        r.top  + 'px',
        right:      'auto',
        bottom:     'auto',
        width:      r.width  + 'px',
        height:     r.height + 'px',
        zIndex:     '99999',
        cursor:     'grabbing',
        animation:  'none',
        transition: 'transform 0.1s, box-shadow 0.15s',
        transform:  'scale(1.15) rotate(4deg)',
        boxShadow:  '0 12px 32px rgba(0,0,0,0.25)',
      });
    };

    const onMove = (cx, cy) => {
      if (!dragging) return;
      hasMoved = true;
      badge.style.left = (cx - ox) + 'px';
      badge.style.top  = (cy - oy) + 'px';
    };

    const onEnd = () => {
      if (!dragging) return;
      dragging = false;

      if (!hasMoved) {
        // Click only — pop bounce
        badge.style.cssText = '';
        badge.style.cursor = 'grab';
        badge.classList.add('badge-pop');
        setTimeout(() => badge.classList.remove('badge-pop'), 450);
        return;
      }

      // Spring back to original position
      Object.assign(badge.style, {
        transition: 'left 0.55s cubic-bezier(0.34,1.56,0.64,1), top 0.55s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s ease, box-shadow 0.3s ease',
        left:       homeX + 'px',
        top:        homeY + 'px',
        transform:  'scale(1) rotate(0deg)',
        boxShadow:  '',
        cursor:     'grab',
      });

      // After spring animation ends, restore original CSS
      setTimeout(() => { badge.style.cssText = ''; badge.style.cursor = 'grab'; }, 580);
    };

    badge.addEventListener('mousedown',  e => { e.preventDefault(); onStart(e.clientX, e.clientY); });
    document.addEventListener('mousemove',  e => onMove(e.clientX, e.clientY));
    document.addEventListener('mouseup',    onEnd);

    badge.addEventListener('touchstart', e => { const t = e.touches[0]; onStart(t.clientX, t.clientY); }, { passive: true });
    document.addEventListener('touchmove',  e => { if (dragging) { e.preventDefault(); const t = e.touches[0]; onMove(t.clientX, t.clientY); } }, { passive: false });
    document.addEventListener('touchend',   onEnd);
  });
}

function initLikeButton() {
  const btn       = document.getElementById('likeBtn');
  const countEl   = document.getElementById('likeCount');
  const LIKED_KEY = 'portfolio_liked';   // localStorage: apakah browser ini sudah like
  const LOCAL_KEY = 'portfolio_likes';   // localStorage: fallback count

  let liked = localStorage.getItem(LIKED_KEY) === 'true';

  function formatCount(n) {
    return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : n;
  }

  function renderUI(count) {
    countEl.textContent = formatCount(count);
    btn.classList.toggle('liked', liked);
    countEl.classList.toggle('liked-text', liked);
  }

  function spawnParticles() {
    const r  = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    for (let i = 0; i < 5 + Math.floor(Math.random() * 4); i++) {
      const p = document.createElement('span');
      p.className = 'heart-particle';
      p.textContent = '♥';
      p.style.left = (cx + (Math.random() * 24) - 12) + 'px';
      p.style.top  = cy + 'px';
      p.style.animationDuration = (.55 + Math.random() * .4) + 's';
      p.style.fontSize = (.65 + Math.random() * .45) + 'rem';
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  }

  function animateBtn() {
    btn.classList.remove('pop');
    void btn.offsetWidth;
    btn.classList.add('pop');
    btn.addEventListener('animationend', () => btn.classList.remove('pop'), { once: true });
  }

  const db = window._firebaseDB;

  if (db) {
    // ── Mode Firebase: count global, realtime ──────────────────
    const likesRef = db.ref('portfolio/likes');

    // Dengarkan perubahan realtime dari semua pengunjung
    likesRef.on('value', snapshot => {
      renderUI(snapshot.val() || 0);
    });

    btn.addEventListener('click', () => {
      liked = !liked;
      localStorage.setItem(LIKED_KEY, liked);
      animateBtn();
      if (liked) spawnParticles();

      // Increment/decrement atomik — aman dari race condition
      likesRef.transaction(current => (current || 0) + (liked ? 1 : -1 < 0 ? 0 : -1));
    });

  } else {
    // ── Mode Fallback: localStorage per-browser ────────────────
    let count = parseInt(localStorage.getItem(LOCAL_KEY) || '0', 10);
    renderUI(count);

    btn.addEventListener('click', () => {
      liked = !liked;
      count = liked ? count + 1 : Math.max(0, count - 1);
      localStorage.setItem(LIKED_KEY, liked);
      localStorage.setItem(LOCAL_KEY, count);
      renderUI(count);
      animateBtn();
      if (liked) spawnParticles();
    });
  }
}

function initShareButton() {
  const btn      = document.getElementById('shareBtn');
  const labelEl  = document.getElementById('shareLabel');
  let resetTimer = null;

  function setLabel(text, active) {
    labelEl.textContent = text;
    btn.classList.toggle('copied', active);
    if (resetTimer) clearTimeout(resetTimer);
    if (active) {
      resetTimer = setTimeout(() => {
        labelEl.textContent = 'Share';
        btn.classList.remove('copied');
      }, 2000);
    }
  }

  btn.addEventListener('click', async () => {
    btn.classList.remove('pop');
    void btn.offsetWidth;
    btn.classList.add('pop');
    btn.addEventListener('animationend', () => btn.classList.remove('pop'), { once: true });

    const shareData = {
      title: 'Rabbani Ridho Ihsani — Portfolio',
      text:  'Check out this portfolio by Rabbani Ridho Ihsani, Backend Developer!',
      url:   window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setLabel('Shared!', true);
      } catch (_) { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setLabel('Copied!', true);
      } catch (_) {
        // final fallback
        const ta = document.createElement('textarea');
        ta.value = window.location.href;
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        setLabel('Copied!', true);
      }
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   MINI GAME — HTML5 Canvas Game
════════════════════════════════════════════════════════════ */
function initResumeRun() {
  const canvas  = document.getElementById('resumeRunCanvas');
  const overlay = document.getElementById('gamePlayOverlay');
  const playBtn = document.getElementById('gamePlayBtn');
  if (!canvas || !overlay || !playBtn) return;
  const ctx = canvas.getContext('2d');

  const W = 800, H = 450, GY = H - 70; // GY = 380
  canvas.width = W; canvas.height = H;

  // ── Visual constants ──────────────────────────────────────────────
  const C = {
    sky1:'#060b16', sky2:'#121830',
    ground:'#1e293b', gline:'#22d3ee',
    dino:'#4ade80', dinoGlow:'#22c55e',
    cactus:'#4ade80', cactusGlow:'#166534',
    ptero:'#fb923c', pteroGlow:'#ea580c',
    text:'#f1f5f9', dim:'#94a3b8',
    accent:'#6366f1', accent2:'#8b5cf6',
    danger:'#ef4444',
  };

  // ── Dino dimensions ───────────────────────────────────────────────
  const DW = 44, DH = 54;        // standing bounding box
  const DDW = 68, DDH = 28;      // ducking bounding box
  const JV = -14.5, GR = 0.68;   // jump velocity, gravity

  // ── Obstacle types ────────────────────────────────────────────────
  const CACTUS = [
    {w:22, h:52, s:'slim'},
    {w:46, h:52, s:'double'},
    {w:22, h:72, s:'tall'},
    {w:46, h:72, s:'tallDouble'},
    {w:68, h:52, s:'cluster'},
  ];
  // Ptero flight Y positions (3 levels)
  // LOW (GY-70=310): standing player y=326, duck y=352 → duck clears LOW
  // MID (GY-112=268): jump or duck
  // HIGH (GY-154=226): run under or jump
  const PTERO_Y = [GY-70, GY-112, GY-154];

  // ── Background decoration ─────────────────────────────────────────
  const STARS = Array.from({length:65}, () => ({
    x: Math.random()*W, y: Math.random()*(GY-100),
    r: Math.random()*1.4+0.4, t: Math.random()*Math.PI*2
  }));
  const MOON = {x: W-80, y: 55, r: 26};

  // ── Game state ────────────────────────────────────────────────────
  let state = 'waiting', rafId = null, bgFrame = 0;
  let player, obs, parts, clouds, score, hiScore = 0;
  let spd, frame, obsAt, cloudAt;
  let speedLevel, lastMilestone, flashTimer;
  let goBtnR = null, shareBtnR = null, lastScore = 0;
  let highScores = [], duckHeld = false;

  // ── Firebase helpers ──────────────────────────────────────────────
  function loadHighScores() {
    highScores = [];
    const db = window._firebaseDB;
    if (!db) return;
    db.ref('game/highscores').orderByChild('score').limitToLast(10).once('value', snap => {
      const arr = [];
      snap.forEach(child => arr.push(child.val()));
      highScores = arr.sort((a,b) => b.score - a.score).slice(0,5);
    });
  }
  function saveHighScore(name, sc) {
    const db = window._firebaseDB;
    if (!db) return Promise.reject('no db');
    return db.ref('game/highscores').push({
      name: name.trim().slice(0,20) || 'Anonymous',
      score: sc, ts: Date.now()
    });
  }

  // ── initState ─────────────────────────────────────────────────────
  function initState() {
    player = {x:80, y:GY-DH, vy:0, gr:true, ducking:false, lt:0};
    obs = []; parts = []; clouds = [];
    score = 0; spd = 6; frame = 0;
    speedLevel = 0; lastMilestone = 0; flashTimer = 0;
    goBtnR = null; shareBtnR = null; duckHeld = false;
    schedObs(); schedCloud();
    loadHighScores();
  }
  function schedObs()   { obsAt   = frame + Math.max(50, 90-frame*.007) + Math.random()*55; }
  function schedCloud() { cloudAt = frame + 70 + Math.random()*100; }

  // ── Spawn functions ───────────────────────────────────────────────
  function spawnObs() {
    const pteroChance = score > 350 ? Math.min(0.4, (score-350)/2000) : 0;
    if (Math.random() < pteroChance) {
      const py = PTERO_Y[Math.floor(Math.random()*PTERO_Y.length)];
      obs.push({type:'PTERO', x:W+10, y:py, w:50, h:34, ph:0});
    } else {
      const t = CACTUS[Math.floor(Math.random()*CACTUS.length)];
      obs.push({type:'CACTUS', x:W+10, y:GY-t.h, w:t.w, h:t.h, s:t.s});
    }
    schedObs();
  }
  function spawnCloud() {
    clouds.push({x:W+10, y:25+Math.random()*100, w:55+Math.random()*70, h:18+Math.random()*10, sp:0.35+Math.random()*0.3});
    schedCloud();
  }

  // ── Helpers ───────────────────────────────────────────────────────
  function rr(x,y,w,h,r) {
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x,y,w,h,r); return; }
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
  }
  function burst(x,y,n,col) {
    for (let i=0;i<n;i++) {
      const a=Math.random()*Math.PI*2, s=2+Math.random()*4;
      parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,l:1,d:.038+Math.random()*.03,col,r:2+Math.random()*3});
    }
  }
  function floatTxt(x,y,txt) { parts.push({x,y,vx:0,vy:-1.4,l:1,d:.022,col:'#e2e8f0',txt,r:0}); }
  function aabb(a,b,p=7) {
    return a.x+p<b.x+b.w-p && a.x+a.w-p>b.x+p && a.y+p<b.y+b.h && a.y+a.h>b.y+p;
  }
  function tickParts() {
    parts.forEach(p => { p.x+=p.vx; p.y+=p.vy; if (!p.txt) p.vy+=.1; p.l-=p.d; });
    parts = parts.filter(p => p.l>0);
  }

  // ── Draw background ───────────────────────────────────────────────
  function drawBg(f) {
    const isDark = document.documentElement.dataset.theme === 'dark';

    // Sky — fully transparent so the portfolio page background shows through
    ctx.clearRect(0, 0, W, H);

    if (isDark) {
      // ── Dark mode: stars + moon ─────────────────────────────────────
      STARS.forEach(s => {
        s.t += .012;
        ctx.globalAlpha = .14 + .45*Math.abs(Math.sin(s.t));
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Moon (crescent)
      ctx.save();
      ctx.shadowColor = '#fef3c7'; ctx.shadowBlur = 20;
      ctx.fillStyle = '#fef9c3';
      ctx.beginPath(); ctx.arc(MOON.x, MOON.y, MOON.r, 0, Math.PI*2); ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(MOON.x+10, MOON.y-5, MOON.r-5, 0, Math.PI*2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();

      // Clouds (dark mode — subtle dark shapes)
      clouds.forEach(cl => {
        ctx.save();
        ctx.globalAlpha = 0.10;
        ctx.fillStyle = '#94a3b8';
        rr(cl.x, cl.y, cl.w, cl.h, cl.h/2); ctx.fill();
        rr(cl.x+cl.w*0.2, cl.y-cl.h*0.45, cl.w*0.6, cl.h, cl.h/2); ctx.fill();
        ctx.restore();
      });

      // Ground fill — dark portfolio color
      ctx.fillStyle = '#0b0f1a'; ctx.fillRect(0, GY, W, H-GY);

      // Ground glow line — cyan accent
      ctx.save();
      ctx.shadowColor = C.gline; ctx.shadowBlur = 14;
      const lg = ctx.createLinearGradient(0,0,W,0);
      lg.addColorStop(0,'transparent'); lg.addColorStop(.08,C.gline);
      lg.addColorStop(.92,C.gline); lg.addColorStop(1,'transparent');
      ctx.strokeStyle = lg; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(0,GY); ctx.lineTo(W,GY); ctx.stroke();
      ctx.restore();

      // Ground dots (scrolling)
      ctx.fillStyle = 'rgba(34,211,238,0.07)';
      const dotOff = (f * (spd||6) * 0.8) % 40;
      for (let x = -dotOff; x < W; x += 40) {
        ctx.beginPath(); ctx.arc(x, GY+12, 1.5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(x+20, GY+24, 1, 0, Math.PI*2); ctx.fill();
      }

    } else {
      // ── Light mode: soft clouds, clean ground ───────────────────────
      // Clouds (light mode — subtle gray puffs)
      clouds.forEach(cl => {
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#94a3b8';
        rr(cl.x, cl.y, cl.w, cl.h, cl.h/2); ctx.fill();
        rr(cl.x+cl.w*0.2, cl.y-cl.h*0.45, cl.w*0.6, cl.h, cl.h/2); ctx.fill();
        ctx.restore();
      });

      // Ground fill — light portfolio color
      ctx.fillStyle = '#e2e8f0'; ctx.fillRect(0, GY, W, H-GY);

      // Ground line — accent-colored in light mode
      ctx.save();
      ctx.shadowColor = 'rgba(99,102,241,0.4)'; ctx.shadowBlur = 10;
      const ll = ctx.createLinearGradient(0,0,W,0);
      ll.addColorStop(0,'transparent'); ll.addColorStop(.08,'#6366f1');
      ll.addColorStop(.92,'#8b5cf6'); ll.addColorStop(1,'transparent');
      ctx.strokeStyle = ll; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0,GY); ctx.lineTo(W,GY); ctx.stroke();
      ctx.restore();

      // Ground dots (scrolling, light mode)
      ctx.fillStyle = 'rgba(99,102,241,0.08)';
      const dotOff = (f * (spd||6) * 0.8) % 40;
      for (let x = -dotOff; x < W; x += 40) {
        ctx.beginPath(); ctx.arc(x, GY+12, 1.5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(x+20, GY+24, 1, 0, Math.PI*2); ctx.fill();
      }
    }

    // Speed flash (both modes)
    if (flashTimer > 0) {
      ctx.fillStyle = `rgba(99,102,241,${flashTimer/55*0.16})`;
      ctx.fillRect(0,0,W,H);
      ctx.font = "bold 20px 'Fira Code',monospace";
      ctx.fillStyle = isDark
        ? `rgba(199,210,254,${flashTimer/55})`
        : `rgba(67,56,202,${flashTimer/55})`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('⚡ SPEED UP!', W/2, 48);
      flashTimer--;
    }
  }

  // ── Draw dino ─────────────────────────────────────────────────────
  function drawDino() {
    const p = player;
    if (state === 'playing') p.lt += 0.22;
    const footY = p.y + (p.ducking ? DDH : DH);
    const lp = Math.sin(p.lt * 2.4);

    ctx.save();
    ctx.translate(p.x, footY);
    ctx.shadowColor = C.dinoGlow; ctx.shadowBlur = 14;
    ctx.fillStyle = C.dino;   // green

    if (p.ducking) {
      // ── Duck pose: wide & low, head thrust forward (right) ──────────
      // Body
      ctx.fillRect(0, -DDH,     58, 20);
      // Neck + head forward
      ctx.fillRect(40, -DDH-8,  26, 18);
      // Snout
      ctx.fillRect(62, -DDH+2,   8, 10);
      // Tail (left side, small wedge)
      ctx.beginPath();
      ctx.moveTo(0, -DDH); ctx.lineTo(-8,-DDH+6); ctx.lineTo(-3,-DDH+16); ctx.lineTo(6,-DDH+14);
      ctx.closePath(); ctx.fill();
      // Legs (alternating)
      ctx.fillRect(10, -DDH+18, 11, lp>0 ? 13 : 7);
      ctx.fillRect(26, -DDH+18, 11, lp>0 ? 7  : 13);
      // Eye
      ctx.shadowBlur = 0; ctx.fillStyle = '#0f172a';
      ctx.fillRect(57, -DDH+2, 9, 9);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillRect(58, -DDH+3, 4, 4);

    } else {
      // ── Standing / running: Chrome Dino pixel-art style, facing right ─
      // Tail (tapers back-left from lower body)
      ctx.beginPath();
      ctx.moveTo(4,  -DH+32); ctx.lineTo(-13,-DH+42);
      ctx.lineTo(-6, -DH+52); ctx.lineTo(4,  -DH+46);
      ctx.closePath(); ctx.fill();

      // Main body
      ctx.fillRect(0, -DH+20, 38, 26);

      // Upper-back hump (narrows toward head)
      ctx.fillRect(0, -DH+10, 20, 13);

      // Neck (connects hump to head)
      ctx.fillRect(14, -DH+4, 18, 14);

      // Head (extends forward/right)
      ctx.fillRect(16, -DH,   28, 22);

      // Snout tip
      ctx.fillRect(40, -DH+8, 6, 10);

      // Short arm (tiny forearm sticking out from mid-body)
      ctx.fillRect(22, -DH+32, 13, 6);

      // Legs (alternating length for run cycle)
      if (p.gr) {
        ctx.fillRect( 8, -18, 11, lp>0 ? 22 : 10);
        ctx.fillRect(23, -18, 11, lp>0 ? 10 : 22);
      } else {
        // Airborne: legs slightly tucked
        ctx.fillRect( 6, -17, 11, 14);
        ctx.fillRect(22, -15, 11, 12);
      }

      // Eye (large dark square near front-top of head, Chrome Dino style)
      ctx.shadowBlur = 0; ctx.fillStyle = '#052e16';
      ctx.fillRect(34, -DH+4, 9, 9);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillRect(35, -DH+5, 4, 4);

      // Nostril / mouth gap
      ctx.fillStyle = '#052e16';
      ctx.fillRect(40, -DH+13, 5, 2);

      // Jump trail (speed lines under feet)
      if (!p.gr) {
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = C.dinoGlow;
        ctx.fillRect(8,  -3, 8, Math.min(22, Math.abs(p.vy)*2.5));
        ctx.fillRect(24, -2, 8, Math.min(18, Math.abs(p.vy)*2.0));
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
  }

  // ── Draw cactus ───────────────────────────────────────────────────
  function drawCactus(o) {
    ctx.save();
    ctx.shadowColor = C.cactusGlow; ctx.shadowBlur = 14;
    ctx.fillStyle = C.cactus;
    const x = o.x, b = o.y + o.h;

    if (o.s === 'slim' || o.s === 'tall') {
      const sw = 10;
      ctx.fillRect(x+6, o.y, sw, o.h);          // main stem
      const armY = o.y + o.h*0.3;
      const armH = o.h * 0.28;
      ctx.fillRect(x, armY, o.w, sw*0.75);       // horizontal connector
      ctx.fillRect(x, armY-armH, sw*0.75, armH); // left arm up
      ctx.fillRect(x+o.w-sw*0.75, armY-armH, sw*0.75, armH); // right arm up

    } else if (o.s === 'double' || o.s === 'tallDouble') {
      const gap = 6, cw = (o.w-gap)/2, sw = 8;
      // Left cactus
      ctx.fillRect(x+(cw-sw)/2, o.y+o.h*0.15, sw, o.h*0.85);
      ctx.fillRect(x, o.y+o.h*0.28, cw, sw*0.75);
      ctx.fillRect(x, o.y+o.h*0.18, sw*0.75, o.h*0.12);
      // Right cactus (taller)
      ctx.fillRect(x+cw+gap+(cw-sw)/2, o.y, sw, o.h);
      ctx.fillRect(x+cw+gap, o.y+o.h*0.32, cw, sw*0.75);
      ctx.fillRect(x+o.w-sw*0.75, o.y+o.h*0.22, sw*0.75, o.h*0.12);

    } else { // cluster
      const uw = o.w/3, sw = 7;
      [0,1,2].forEach(i => {
        const cx = x + i*uw + (uw-sw)/2;
        const ch = o.h * (i===1 ? 1 : 0.78);
        const cy = b - ch;
        ctx.fillRect(cx, cy, sw, ch);
        const armY2 = cy + ch*0.3;
        ctx.fillRect(cx-uw*0.35, armY2, uw, sw*0.75);
        ctx.fillRect(cx-uw*0.35, armY2-ch*0.18, sw*0.7, ch*0.18);
        ctx.fillRect(cx+uw*0.65, armY2-ch*0.18, sw*0.7, ch*0.18);
      });
    }
    ctx.restore();
  }

  // ── Draw pterodactyl ──────────────────────────────────────────────
  function drawPtero(o) {
    o.ph += 0.14;
    const wf = Math.sin(o.ph);  // wing flap
    const cx = o.x + o.w/2, cy = o.y + o.h/2;

    ctx.save();
    ctx.shadowColor = C.pteroGlow; ctx.shadowBlur = 18;
    ctx.fillStyle = C.ptero;

    // Body
    ctx.beginPath();
    ctx.ellipse(cx, cy, 14, 9, 0, 0, Math.PI*2);
    ctx.fill();

    // Head faces LEFT (direction of travel)
    ctx.fillRect(cx-23, cy-8, 14, 11);

    // Beak pointing LEFT
    ctx.beginPath();
    ctx.moveTo(cx-23, cy-3);
    ctx.lineTo(cx-36, cy);
    ctx.lineTo(cx-23, cy+4);
    ctx.closePath(); ctx.fill();

    // Head crest (spiky top)
    ctx.beginPath();
    ctx.moveTo(cx-22, cy-8);
    ctx.lineTo(cx-14, cy-18);
    ctx.lineTo(cx-8,  cy-8);
    ctx.closePath(); ctx.fill();

    // Tail to the RIGHT
    ctx.beginPath();
    ctx.moveTo(cx+12, cy-2);
    ctx.lineTo(cx+25, cy-5+wf*2);
    ctx.lineTo(cx+19, cy+5);
    ctx.closePath(); ctx.fill();

    // Wings (flap up/down symmetrically)
    const wingY = cy + wf * 13;
    ctx.beginPath();  // left wing
    ctx.moveTo(cx-4,  cy-4);
    ctx.lineTo(cx-30, wingY-2);
    ctx.lineTo(cx-14, wingY+8);
    ctx.lineTo(cx-4,  cy+5);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();  // right wing
    ctx.moveTo(cx+4,  cy-4);
    ctx.lineTo(cx+30, wingY+4);
    ctx.lineTo(cx+14, wingY+10);
    ctx.lineTo(cx+4,  cy+5);
    ctx.closePath(); ctx.fill();

    // Eye (front of head, left side)
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#431407';
    ctx.beginPath(); ctx.arc(cx-17, cy-2, 2.8, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath(); ctx.arc(cx-18.5, cy-3, 1.1, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  // ── Render all obstacles ──────────────────────────────────────────
  function drawObs() {
    obs.forEach(o => {
      if (o.type === 'CACTUS') drawCactus(o);
      else drawPtero(o);
    });
  }

  // ── Draw particles ────────────────────────────────────────────────
  function drawParts() {
    parts.forEach(p => {
      ctx.save(); ctx.globalAlpha = p.l;
      if (p.txt) {
        ctx.font = "bold 14px 'Plus Jakarta Sans',sans-serif";
        ctx.fillStyle = p.col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(p.txt, p.x, p.y);
      } else {
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();
    });
  }

  // ── HUD ───────────────────────────────────────────────────────────
  function drawHUD() {
    const isDark = document.documentElement.dataset.theme === 'dark';
    const textCol  = isDark ? C.gline    : '#6366f1';
    const dimCol   = isDark ? C.dim      : '#64748b';
    const spdCol   = isDark ? 'rgba(99,102,241,0.75)' : 'rgba(99,102,241,0.9)';
    ctx.save();
    ctx.textBaseline = 'top';
    ctx.shadowColor = textCol; ctx.shadowBlur = isDark ? 8 : 0;

    ctx.font = "bold 14px 'Fira Code',monospace";
    ctx.fillStyle = dimCol; ctx.textAlign = 'right';
    ctx.fillText('HI', W-118, 16);
    ctx.fillStyle = dimCol;
    ctx.fillText(String(hiScore).padStart(5,'0'), W-70, 16);
    ctx.fillStyle = textCol;
    ctx.fillText(String(score).padStart(5,'0'), W-12, 16);

    ctx.shadowBlur = 0;
    ctx.font = "11px 'Fira Code',monospace";
    ctx.fillStyle = spdCol; ctx.textAlign = 'left';
    ctx.fillText('SPD x'+(spd||6).toFixed(1), 14, 18);
    ctx.restore();
  }

  // ── Game Over screen ──────────────────────────────────────────────
  function drawDead() {
    const isDark = document.documentElement.dataset.theme === 'dark';
    const overlay   = isDark ? 'rgba(6,11,22,.90)'    : 'rgba(248,250,252,.93)';
    const scoreCol  = isDark ? '#94a3b8'               : '#475569';
    const textMain  = isDark ? C.text                  : '#0f172a';
    const rowStripe = isDark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.03)';
    const sepCol    = isDark ? 'rgba(99,102,241,.35)'  : 'rgba(99,102,241,.25)';
    const tblHdr    = isDark ? 'rgba(255,255,255,.1)'  : 'rgba(0,0,0,.08)';

    ctx.fillStyle = overlay; ctx.fillRect(0,0,W,H);
    ctx.textAlign='center'; ctx.textBaseline='middle';

    ctx.font="bold 46px 'Plus Jakarta Sans',sans-serif";
    ctx.fillStyle=C.danger;
    ctx.fillText('GAME OVER', W/2, 52);

    ctx.font="15px 'Fira Code',monospace"; ctx.fillStyle=scoreCol;
    ctx.fillText('Score: '+lastScore, W/2, 92);

    const sg=ctx.createLinearGradient(W/2-130,0,W/2+130,0);
    sg.addColorStop(0,C.accent); sg.addColorStop(1,C.accent2);
    ctx.font="bold 24px 'Plus Jakarta Sans',sans-serif"; ctx.fillStyle=sg;
    ctx.fillText('High Score: '+hiScore, W/2, 126);

    // Buttons
    const btnY=158, btnH=40, gap=18, btnW=175;
    const bx1=W/2-gap/2-btnW, bx2=W/2+gap/2;

    goBtnR = {x:bx1, y:btnY, w:btnW, h:btnH};
    const bg1=ctx.createLinearGradient(bx1,btnY,bx1+btnW,btnY);
    bg1.addColorStop(0,C.accent); bg1.addColorStop(1,C.accent2);
    ctx.fillStyle=bg1; rr(bx1,btnY,btnW,btnH,20); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font="bold 14px 'Plus Jakarta Sans',sans-serif";
    ctx.fillText('▶  Play Again', bx1+btnW/2, btnY+btnH/2);

    shareBtnR = {x:bx2, y:btnY, w:btnW, h:btnH};
    ctx.fillStyle='rgba(251,191,36,.15)'; rr(bx2,btnY,btnW,btnH,20); ctx.fill();
    ctx.strokeStyle='#fbbf24'; ctx.lineWidth=1.5; rr(bx2,btnY,btnW,btnH,20); ctx.stroke();
    ctx.fillStyle='#fde047'; ctx.font="bold 14px 'Plus Jakarta Sans',sans-serif";
    ctx.fillText('\uD83C\uDFC6  Share Score', bx2+btnW/2, btnY+btnH/2);

    // Separator
    ctx.strokeStyle=sepCol; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(60,216); ctx.lineTo(W-60,216); ctx.stroke();

    // Leaderboard
    ctx.font="bold 13px 'Plus Jakarta Sans',sans-serif";
    ctx.fillStyle='#fbbf24'; ctx.textAlign='center';
    ctx.fillText('\uD83C\uDFC6  HIGH SCORES', W/2, 234);

    const colRank=110, colName=310, colScoreX=680, rowH=26, firstRowY=264;
    ctx.font="11px 'Fira Code',monospace"; ctx.fillStyle=scoreCol;
    ctx.textAlign='center'; ctx.fillText('#', colRank, firstRowY-18);
    ctx.textAlign='left';   ctx.fillText('Name', colName, firstRowY-18);
    ctx.textAlign='right';  ctx.fillText('Score', colScoreX, firstRowY-18);
    ctx.strokeStyle=tblHdr; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(80,firstRowY-9); ctx.lineTo(W-80,firstRowY-9); ctx.stroke();

    if (highScores.length===0) {
      ctx.font="14px 'Plus Jakarta Sans',sans-serif"; ctx.fillStyle=scoreCol; ctx.textAlign='center';
      ctx.fillText(window._firebaseDB ? 'Loading\u2026' : 'Be the first!', W/2, firstRowY+rowH);
    } else {
      const rankColors=['#fbbf24','#94a3b8','#cd7c2f'];
      highScores.slice(0,5).forEach((entry,i) => {
        const ry=firstRowY+i*rowH;
        ctx.fillStyle=rowStripe;
        if (i%2===0) ctx.fillRect(80,ry-12,W-160,rowH-2);
        ctx.font=`bold 13px 'Fira Code',monospace`; ctx.fillStyle=rankColors[i]||scoreCol;
        ctx.textAlign='center'; ctx.fillText(i+1, colRank, ry);
        ctx.font="13px 'Plus Jakarta Sans',sans-serif"; ctx.fillStyle=textMain;
        ctx.textAlign='left';
        const nm=entry.name.length>22?entry.name.slice(0,20)+'\u2026':entry.name;
        ctx.fillText(nm, colName, ry);
        ctx.font="bold 13px 'Fira Code',monospace"; ctx.fillStyle=C.accent2;
        ctx.textAlign='right'; ctx.fillText(entry.score, colScoreX, ry);
      });
    }

    ctx.font="13px 'Plus Jakarta Sans',sans-serif"; ctx.fillStyle=scoreCol;
    ctx.textAlign='center';
    ctx.fillText('Got a real bug? Contact me above! \uD83D\uDC46', W/2, H-20);
  }

  // ── Physics + game logic ──────────────────────────────────────────
  function update() {
    frame++;
    spd = Math.min(24, 6 + frame*0.0028 + speedLevel*1.8);
    score = Math.floor(frame * 0.11 * (spd/6));

    const milestone = Math.floor(score/500);
    if (milestone > lastMilestone) { lastMilestone = milestone; speedLevel++; flashTimer = 55; }

    // Gravity
    if (!player.gr) {
      player.vy += GR;
      player.y  += player.vy;
    }
    // Landing
    const floorY = GY - (player.ducking ? DDH : DH);
    if (player.y >= floorY) {
      player.y = floorY; player.vy = 0; player.gr = true;
    }

    // Spawn + scroll
    if (frame >= obsAt)   spawnObs();
    if (frame >= cloudAt) spawnCloud();
    obs    = obs.filter(o   => { o.x -= spd;             return o.x > -o.w-20; });
    clouds = clouds.filter(c => { c.x -= c.sp*spd*0.18;  return c.x > -c.w-10; });
    tickParts();

    // Collision
    const ph = player.ducking
      ? {x:player.x-4,   y:player.y,   w:DDW-16, h:DDH-2}
      : {x:player.x+4,   y:player.y,   w:DW-8,   h:DH-4};

    for (let i=obs.length-1; i>=0; i--) {
      const o = obs[i];
      if (!aabb(ph, o)) continue;
      state = 'dead'; lastScore = score;
      if (score > hiScore) hiScore = score;
      burst(player.x+DW/2, player.y+DH/2, 24, C.danger);
      floatTxt(player.x+DW/2, player.y-20, 'GAME OVER!');
      loadHighScores();
      return;
    }
  }

  // ── Controls ──────────────────────────────────────────────────────
  function jump() {
    if (state !== 'playing') return;
    if (player.ducking) { unduck(); return; }
    if (player.gr) {
      player.vy = JV; player.gr = false;
      burst(player.x+DW/2, GY, 8, C.dinoGlow);
    }
  }
  function duck() {
    if (state !== 'playing' || player.ducking) return;
    player.ducking = true; duckHeld = true;
    if (player.gr) player.y = GY - DDH;
  }
  function unduck() {
    if (!player.ducking) return;
    player.ducking = false; duckHeld = false;
    if (player.gr) player.y = GY - DH;
  }
  function startGame() {
    state = 'playing'; initState();
    if (!rafId) tick();
  }
  function hitTest(cx,cy,r) { return r && cx>=r.x && cx<=r.x+r.w && cy>=r.y && cy<=r.y+r.h; }

  // ── Main loop ─────────────────────────────────────────────────────
  function tick() {
    ctx.clearRect(0,0,W,H);
    if (state==='waiting') {
      bgFrame++;
      if (!clouds.length) spawnCloud();
      drawBg(bgFrame);
      player.y = GY - DH + Math.sin(bgFrame*.04)*3;
      player.gr = true;
      drawDino();
    } else {
      if (state==='playing') update();
      else tickParts();
      drawBg(frame);
      drawObs();
      drawDino();
      drawParts();
      drawHUD();
      if (state==='dead') drawDead();
    }
    rafId = requestAnimationFrame(tick);
  }

  // ── Input handlers ────────────────────────────────────────────────
  playBtn.addEventListener('click', e => {
    e.stopPropagation();
    overlay.classList.add('hidden');
    startGame();
  });

  canvas.addEventListener('click', e => {
    if (state==='dead') {
      const rc=canvas.getBoundingClientRect();
      const cx=(e.clientX-rc.left)*(W/rc.width);
      const cy=(e.clientY-rc.top)*(H/rc.height);
      if (hitTest(cx,cy,goBtnR))    { startGame(); return; }
      if (hitTest(cx,cy,shareBtnR)) { openShareModal(); return; }
    }
    jump();
  });

  canvas.addEventListener('touchstart', e => {
    if (state==='playing') e.preventDefault();
    const t=e.touches[0]||e.changedTouches[0];
    if (state==='dead' && t) {
      const rc=canvas.getBoundingClientRect();
      const cx=(t.clientX-rc.left)*(W/rc.width);
      const cy=(t.clientY-rc.top)*(H/rc.height);
      if (hitTest(cx,cy,goBtnR))    { startGame(); return; }
      if (hitTest(cx,cy,shareBtnR)) { openShareModal(); return; }
    }
    jump();
  },{passive:false});

  document.addEventListener('keydown', e => {
    if (e.code==='Space'||e.code==='ArrowUp') {
      if (state==='playing') { e.preventDefault(); jump(); }
    } else if (e.code==='ArrowDown'||e.code==='Enter') {
      if (state==='playing') { e.preventDefault(); duck(); }
    }
  });
  document.addEventListener('keyup', e => {
    if (e.code==='ArrowDown'||e.code==='Enter') unduck();
  });

  // ── Share modal ────────────────────────────────────────────────────
  const shareModal   = document.getElementById('gameShareModal');
  const shareNameEl  = document.getElementById('gameShareName');
  const shareScoreEl = document.getElementById('gameShareScoreText');
  const shareStatus  = document.getElementById('gameShareStatus');
  const shareSubmit  = document.getElementById('gameShareSubmit');

  function openShareModal() {
    shareScoreEl.innerHTML = 'Score: <strong>'+lastScore+'</strong>';
    shareNameEl.value = ''; shareStatus.textContent = '';
    shareStatus.className = 'game-share-status';
    shareSubmit.disabled = false;
    shareModal.classList.remove('hidden');
    setTimeout(() => shareNameEl.focus(), 80);
  }
  function closeShareModal() { shareModal.classList.add('hidden'); }

  document.getElementById('gameShareClose').addEventListener('click', closeShareModal);
  document.getElementById('gameShareCancel').addEventListener('click', closeShareModal);

  shareSubmit.addEventListener('click', () => {
    const name = shareNameEl.value.trim();
    if (!name) { shareNameEl.focus(); return; }
    shareSubmit.disabled = true;
    shareStatus.className = 'game-share-status';
    shareStatus.textContent = 'Saving\u2026';
    saveHighScore(name, lastScore)
      .then(() => {
        shareStatus.textContent = '\u2713 Score saved! Check the leaderboard.';
        loadHighScores();
        setTimeout(closeShareModal, 1600);
      })
      .catch(() => {
        shareStatus.className = 'game-share-status error';
        shareStatus.textContent = '\u2717 Could not save \u2014 check your connection.';
        shareSubmit.disabled = false;
      });
  });

  shareNameEl.addEventListener('keydown', e => {
    if (e.key==='Enter') shareSubmit.click();
    e.stopPropagation();
  });

  // ── Boot ──────────────────────────────────────────────────────────
  player = {x:80, y:GY-DH, vy:0, gr:true, ducking:false, lt:0};
  clouds = []; parts = [];
  tick();

  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && rafId) {
      cancelAnimationFrame(rafId); rafId=null;
    } else if (entry.isIntersecting && !rafId) {
      tick();
    }
  }, {threshold:.1}).observe(canvas);
}
