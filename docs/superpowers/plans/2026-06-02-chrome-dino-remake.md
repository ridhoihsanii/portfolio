# Chrome Dino Remake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stickman "Resume Run" game in `script.js` with a Chrome Dino-style game (jump+duck, cacti, pterodactyls) using a dark neon visual theme that is more visually attractive than the original.

**Architecture:** A single `initResumeRun()` function in `script.js` (~lines 363–1359) is completely rewritten. The HTML structure (canvas + overlay + share modal) and Firebase helpers stay intact. The CSS needs no change. The game has three states: `waiting` (play overlay), `playing`, `dead` (leaderboard overlay).

**Tech Stack:** Vanilla JavaScript, HTML5 Canvas 2D API, Firebase Realtime Database (for high scores)

---

## Visual Design Reference

| Element       | Color            | Glow         |
|--------------|------------------|--------------|
| Sky top       | `#060b16`        | —            |
| Sky bottom    | `#121830`        | —            |
| Ground        | `#1e293b`        | —            |
| Ground line   | `#22d3ee` (cyan) | `#0e7490`    |
| Dino          | `#f1f5f9` (white)| `#38bdf8`    |
| Cactus        | `#4ade80` (green)| `#166534`    |
| Pterodactyl   | `#fb923c` (amber)| `#ea580c`    |
| HUD text      | `#e2e8f0`        | —            |
| Score accent  | `#22d3ee`        | —            |

Sky has stars (twinkle), moon (top-right), and slow-moving glowing clouds.

---

## Files

- **Modify:** `script.js` — Replace entire `initResumeRun()` (lines 363–1359)
- **Modify:** `index.html` — Update `.game-controls` bar (lines ~480–499) to reflect new controls
- **No change:** `style.css`, `firebase-config.js`

---

## Task 1: Constants, State, and Firebase scaffold

**File:** `script.js` lines 363–440

- [ ] Replace the `initResumeRun` opening through `initState()` with the new scaffold:

```javascript
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
    dino:'#f1f5f9', dinoGlow:'#38bdf8',
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
  // Cactus shape variants
  const CACTUS = [
    {w:22, h:52, s:'slim'},
    {w:46, h:52, s:'double'},
    {w:22, h:72, s:'tall'},
    {w:46, h:72, s:'tallDouble'},
    {w:68, h:52, s:'cluster'},
  ];
  // Ptero flight heights (3 levels — see collision plan)
  const PTERO_Y = [GY-70, GY-112, GY-154];

  // ── Background decoration ─────────────────────────────────────────
  const STARS = Array.from({length:65}, () => ({
    x: Math.random()*W, y: Math.random()*(GY-100),
    r: Math.random()*1.4+0.4, t: Math.random()*Math.PI*2
  }));
  // Moon is fixed top-right
  const MOON = {x: W-80, y: 55, r: 28};

  // ── Game state ────────────────────────────────────────────────────
  let state = 'waiting', rafId = null, bgFrame = 0;
  let player, obs, parts, clouds, score, hiScore = 0;
  let spd, frame, obsAt, cloudAt;
  let speedLevel, lastMilestone, flashTimer;
  let goBtnR = null, shareBtnR = null, lastScore = 0;
  let highScores = [], duckHeld = false;

  // ── Firebase helpers (unchanged API) ─────────────────────────────
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

  // ── initState ────────────────────────────────────────────────────
  function initState() {
    player = {x:80, y:GY-DH, vy:0, gr:true, ducking:false, lt:0};
    obs = []; parts = []; clouds = [];
    score = 0; spd = 6; frame = 0;
    speedLevel = 0; lastMilestone = 0; flashTimer = 0;
    goBtnR = null; shareBtnR = null; duckHeld = false;
    schedObs(); schedCloud();
    loadHighScores();
  }

  function schedObs()   { obsAt   = frame + Math.max(50, 90 - frame*.007) + Math.random()*55; }
  function schedCloud() { cloudAt = frame + 70 + Math.random()*100; }
```

---

## Task 2: Spawn functions + helpers

- [ ] Add spawn + utility functions immediately after `schedCloud`:

```javascript
  // ── Spawn ─────────────────────────────────────────────────────────
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
    clouds.push({
      x: W+10, y: 25 + Math.random()*100,
      w: 55 + Math.random()*70, h: 18 + Math.random()*10,
      sp: 0.35 + Math.random()*0.3
    });
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
```

---

## Task 3: Background + ground drawing

- [ ] Add `drawBg()` function:

```javascript
  // ── Draw background ───────────────────────────────────────────────
  function drawBg(f) {
    // Sky gradient
    const sg = ctx.createLinearGradient(0,0,0,GY);
    sg.addColorStop(0, C.sky1); sg.addColorStop(1, C.sky2);
    ctx.fillStyle = sg; ctx.fillRect(0,0,W,GY);

    // Stars
    STARS.forEach(s => {
      s.t += .012;
      ctx.globalAlpha = .2 + .55 * Math.abs(Math.sin(s.t));
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Moon (crescent effect with two overlapping circles)
    ctx.save();
    ctx.shadowColor = '#fef3c7'; ctx.shadowBlur = 22;
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(MOON.x, MOON.y, MOON.r, 0, Math.PI*2); ctx.fill();
    // Cut out crescent
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(MOON.x+11, MOON.y-6, MOON.r-4, 0, Math.PI*2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();

    // Clouds
    clouds.forEach(cl => {
      ctx.save();
      ctx.shadowColor = C.dinoGlow; ctx.shadowBlur = 8;
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#e2e8f0';
      rr(cl.x, cl.y, cl.w, cl.h, cl.h/2); ctx.fill();
      // Second puff
      rr(cl.x + cl.w*0.2, cl.y - cl.h*0.4, cl.w*0.6, cl.h, cl.h/2); ctx.fill();
      ctx.restore();
    });

    // Ground fill
    ctx.fillStyle = C.ground; ctx.fillRect(0, GY, W, H-GY);

    // Ground glow line
    ctx.save();
    ctx.shadowColor = C.gline; ctx.shadowBlur = 12;
    const lg = ctx.createLinearGradient(0,0,W,0);
    lg.addColorStop(0,'transparent'); lg.addColorStop(.1, C.gline);
    lg.addColorStop(.9, C.gline); lg.addColorStop(1,'transparent');
    ctx.strokeStyle = lg; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0,GY); ctx.lineTo(W,GY); ctx.stroke();
    ctx.restore();

    // Ground texture (scrolling dots)
    ctx.fillStyle = 'rgba(34,211,238,0.06)';
    const dotOff = (f * spd * 0.8) % 40;
    for (let x = -dotOff; x < W; x += 40) {
      ctx.beginPath(); ctx.arc(x, GY+12, 1.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x+20, GY+24, 1, 0, Math.PI*2); ctx.fill();
    }

    // Speed flash overlay
    if (flashTimer > 0) {
      ctx.fillStyle = `rgba(99,102,241,${flashTimer/55*0.18})`;
      ctx.fillRect(0,0,W,H);
      ctx.font = "bold 20px 'Fira Code',monospace";
      ctx.fillStyle = `rgba(199,210,254,${flashTimer/55})`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('⚡ SPEED UP!', W/2, 48);
      flashTimer--;
    }
  }
```

---

## Task 4: Dino drawing (T-Rex style)

The dino is drawn as a series of filled rectangles (pixel art style) at the player's physics position.

- Coordinate origin: `(player.x, footY)` where `footY = player.y + DH`
- All offsets are **relative** using `ctx.translate(x, footY)` then drawing with negative Y

```javascript
  // ── Draw dino ─────────────────────────────────────────────────────
  function drawDino() {
    const p = player;
    if (state === 'playing') p.lt += 0.22;
    const footY = p.y + (p.ducking ? DDH : DH);
    const lp = Math.sin(p.lt * 2.4); // leg phase

    ctx.save();
    ctx.translate(p.x, footY);

    ctx.shadowColor = C.dinoGlow; ctx.shadowBlur = 16;
    ctx.fillStyle = C.dino;

    if (p.ducking) {
      // Duck body (wide, low) — origin at foot
      ctx.fillRect(-4, -DDH,      60, 20);   // horizontal body
      ctx.fillRect(52, -DDH-4,    18, 16);   // head extended forward
      ctx.fillRect( 6, -DDH+18,    9, lp>0 ? 12 : 7);   // back leg
      ctx.fillRect(22, -DDH+18,    9, lp>0 ? 7  : 12);  // front leg
      // Tail up
      ctx.beginPath();
      ctx.moveTo(-4, -DDH);
      ctx.lineTo(-4, -DDH-10);
      ctx.lineTo(8,  -DDH+2);
      ctx.closePath(); ctx.fill();
      // Eye
      ctx.shadowBlur = 0;
      const ex = 64, ey = -DDH-2;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath(); ctx.arc(ex-1.2, ey-1.2, 1.2, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = C.dino; ctx.shadowBlur = 16;

    } else {
      // Standing body (origin at foot, draw upward)
      // Legs
      if (p.gr) {
        ctx.fillRect( 8, -18,  11, lp > 0 ? 22 : 12);   // back leg
        ctx.fillRect(22, -18,  11, lp > 0 ? 12 : 22);   // front leg
      } else {
        // In air: legs slightly spread
        ctx.fillRect( 6, -18,  11, 18);
        ctx.fillRect(22, -16,  11, 16);
      }
      // Body
      ctx.fillRect(0, -DH+12, 38, 28);
      // Neck
      ctx.fillRect(16, -DH+4, 18, 14);
      // Head
      ctx.fillRect(12, -DH,   26, 20);
      // Tail (left taper)
      ctx.beginPath();
      ctx.moveTo(0,  -DH+14);
      ctx.lineTo(-10,-DH+22);
      ctx.lineTo(-2, -DH+32);
      ctx.closePath(); ctx.fill();
      // Small arm
      ctx.fillRect(18, -DH+26, 12, 7);
      // Eye
      ctx.shadowBlur = 0;
      const ex = 32, ey = -DH+6;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(ex, ey, 4.5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath(); ctx.arc(ex-1.5, ey-1.5, 1.6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = C.dino; ctx.shadowBlur = 16;
      // Mouth
      ctx.fillRect(34, -DH+12, 4, 3);

      // Jump dust streaks
      if (!p.gr) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = C.dinoGlow;
        ctx.fillRect(8,  -6, 6, Math.min(18, Math.abs(p.vy)*2.5));
        ctx.fillRect(24, -4, 6, Math.min(16, Math.abs(p.vy)*2.2));
        ctx.globalAlpha = 1;
        ctx.fillStyle = C.dino;
      }
    }

    ctx.restore();
  }
```

---

## Task 5: Cactus + Pterodactyl drawing

```javascript
  // ── Draw cactus ───────────────────────────────────────────────────
  function drawCactus(o) {
    ctx.save();
    ctx.shadowColor = C.cactusGlow; ctx.shadowBlur = 14;
    ctx.fillStyle = C.cactus;

    const x = o.x, b = o.y + o.h; // b = base (= GY)

    function stem(sx, sy, sw, sh) {
      ctx.fillRect(sx, sy, sw, sh);
    }
    function arm(sx, sy, aw, ah, left) {
      // arm branch + cap
      const dir = left ? -1 : 1;
      ctx.fillRect(sx + dir*sw/2, sy,    sw*0.55, ah);       // connector
      ctx.fillRect(sx + dir*sw/2 + dir*(sw*0.55 - sw*0.45), sy - ah*0.5, aw, ah); // arm up
    }

    const sw = Math.round(o.w / (o.s==='double'||o.s==='tallDouble'||o.s==='cluster' ? 2.5 : 1));

    if (o.s === 'slim' || o.s === 'tall') {
      stem(x + (o.w-sw)/2, o.y, sw, o.h);
      // Two arms
      const armH = o.h * 0.32;
      const armY = o.y + o.h * 0.28;
      ctx.fillRect(x, armY, o.w, sw*0.7);
      ctx.fillRect(x, armY - armH, sw*0.7, armH);
      ctx.fillRect(x + o.w - sw*0.7, armY - armH, sw*0.7, armH);

    } else if (o.s === 'double' || o.s === 'tallDouble') {
      const gap = 6;
      const cw = (o.w - gap) / 2;
      // Left cactus
      ctx.fillRect(x,        o.y + o.h*0.12, cw*0.55, o.h*0.88);
      ctx.fillRect(x,        o.y + o.h*0.25, cw,     cw*0.55);
      ctx.fillRect(x,        o.y + o.h*0.15, cw*0.5, o.h*0.1);
      // Right cactus (slightly taller)
      ctx.fillRect(x+cw+gap, o.y,            cw*0.55, o.h);
      ctx.fillRect(x+cw+gap-cw*0.45, o.y+o.h*0.3, cw, cw*0.55);
      ctx.fillRect(x+o.w-cw*0.5, o.y+o.h*0.2, cw*0.5, o.h*0.1);

    } else { // cluster
      const uw = o.w / 3;
      [0,1,2].forEach(i => {
        const cx = x + i*uw + uw*0.2;
        const ch = o.h * (i===1 ? 1 : 0.75);
        ctx.fillRect(cx, b-ch, uw*0.55, ch);
        if (i !== 1) {
          ctx.fillRect(cx - uw*0.3, b-ch*0.55, uw*0.8, uw*0.4);
          ctx.fillRect(cx - uw*0.3, b-ch*0.7, uw*0.4, ch*0.18);
        }
      });
    }
    ctx.restore();
  }

  // ── Draw pterodactyl ──────────────────────────────────────────────
  function drawPtero(o) {
    o.ph += 0.14;
    const wingUp = Math.sin(o.ph);
    const cx = o.x + o.w/2, cy = o.y + o.h/2;

    ctx.save();
    ctx.shadowColor = C.pteroGlow; ctx.shadowBlur = 18;
    ctx.fillStyle = C.ptero;
    ctx.strokeStyle = C.ptero;
    ctx.lineCap = 'round';

    // Body oval
    ctx.beginPath();
    ctx.ellipse(cx, cy, 14, 9, 0, 0, Math.PI*2);
    ctx.fill();
    // Head + beak
    ctx.fillRect(cx+10, cy-6, 12, 9);        // head
    ctx.beginPath();                           // beak
    ctx.moveTo(cx+22, cy-4);
    ctx.lineTo(cx+32, cy-1);
    ctx.lineTo(cx+22, cy+2);
    ctx.closePath(); ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.moveTo(cx-12, cy);
    ctx.lineTo(cx-22, cy-4+wingUp*2);
    ctx.lineTo(cx-18, cy+3);
    ctx.closePath(); ctx.fill();
    // Eye
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(cx+16, cy-3, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = C.ptero; ctx.shadowBlur = 18;

    // Wings (two triangle shapes that flap)
    const wingY = cy + wingUp * 14;
    // Left wing
    ctx.beginPath();
    ctx.moveTo(cx-4, cy-4);
    ctx.lineTo(cx-28, wingY - 4);
    ctx.lineTo(cx-4, cy+6);
    ctx.closePath(); ctx.fill();
    // Right wing
    ctx.beginPath();
    ctx.moveTo(cx+4, cy-4);
    ctx.lineTo(cx+28, wingY + 2);
    ctx.lineTo(cx+4, cy+6);
    ctx.closePath(); ctx.fill();

    ctx.restore();
  }

  // ── Render all obstacles ──────────────────────────────────────────
  function drawObs() {
    obs.forEach(o => {
      if (o.type === 'CACTUS') drawCactus(o);
      else drawPtero(o);
    });
  }
```

---

## Task 6: HUD + Game Over screen

```javascript
  // ── HUD ───────────────────────────────────────────────────────────
  function drawHUD() {
    ctx.save();
    ctx.textBaseline = 'top';
    ctx.shadowColor = C.gline; ctx.shadowBlur = 8;

    // HI score
    ctx.font = "bold 13px 'Fira Code',monospace";
    ctx.fillStyle = C.dim;
    ctx.textAlign = 'right';
    ctx.fillText('HI', W-110, 18);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(String(hiScore).padStart(5,'0'), W-68, 18);

    // Current score
    ctx.fillStyle = C.gline;
    ctx.fillText(String(score).padStart(5,'0'), W-12, 18);

    // Speed badge (top-left)
    ctx.shadowBlur = 0;
    ctx.font = "bold 11px 'Fira Code',monospace";
    ctx.fillStyle = 'rgba(99,102,241,0.7)';
    ctx.textAlign = 'left';
    ctx.fillText(`SPD ×${(spd).toFixed(1)}`, 14, 20);

    ctx.restore();
  }

  // ── Particles ─────────────────────────────────────────────────────
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

  // ── Game Over screen ──────────────────────────────────────────────
  function drawDead() {
    ctx.fillStyle='rgba(6,11,22,.88)'; ctx.fillRect(0,0,W,H);
    ctx.textAlign='center'; ctx.textBaseline='middle';

    ctx.font="bold 46px 'Plus Jakarta Sans',sans-serif"; ctx.fillStyle=C.danger;
    ctx.fillText('GAME OVER', W/2, 52);

    ctx.font="15px 'Fira Code',monospace"; ctx.fillStyle=C.dim;
    ctx.fillText('Score: '+lastScore, W/2, 92);

    const sg = ctx.createLinearGradient(W/2-130,0,W/2+130,0);
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
    ctx.fillText('🏆  Share Score', bx2+btnW/2, btnY+btnH/2);

    // Separator
    const sepY=216;
    ctx.strokeStyle='rgba(99,102,241,.35)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(60,sepY); ctx.lineTo(W-60,sepY); ctx.stroke();

    // Leaderboard
    ctx.font="bold 13px 'Plus Jakarta Sans',sans-serif";
    ctx.fillStyle='#fbbf24'; ctx.textAlign='center';
    ctx.fillText('🏆  HIGH SCORES', W/2, 234);

    const colRank=110, colName=310, colScore=680, rowH=26, firstRowY=264;
    ctx.font="11px 'Fira Code',monospace"; ctx.fillStyle=C.dim;
    ctx.textAlign='center'; ctx.fillText('#', colRank, firstRowY-18);
    ctx.textAlign='left';   ctx.fillText('Name', colName, firstRowY-18);
    ctx.textAlign='right';  ctx.fillText('Score', colScore, firstRowY-18);
    ctx.strokeStyle='rgba(255,255,255,.1)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(80,firstRowY-9); ctx.lineTo(W-80,firstRowY-9); ctx.stroke();

    if (highScores.length===0) {
      ctx.font="14px 'Plus Jakarta Sans',sans-serif"; ctx.fillStyle=C.dim; ctx.textAlign='center';
      ctx.fillText(window._firebaseDB ? 'Loading…' : 'Be the first!', W/2, firstRowY+rowH);
    } else {
      const rankColors=['#fbbf24','#94a3b8','#cd7c2f'];
      highScores.slice(0,5).forEach((entry,i) => {
        const ry=firstRowY+i*rowH;
        ctx.fillStyle=i%2===0?'rgba(255,255,255,.04)':'transparent';
        ctx.fillRect(80,ry-12,W-160,rowH-2);
        ctx.font=`bold 13px 'Fira Code',monospace`; ctx.fillStyle=rankColors[i]||C.dim;
        ctx.textAlign='center'; ctx.fillText(i+1, colRank, ry);
        ctx.font="13px 'Plus Jakarta Sans',sans-serif"; ctx.fillStyle=C.text;
        ctx.textAlign='left';
        const nm=entry.name.length>22?entry.name.slice(0,20)+'…':entry.name;
        ctx.fillText(nm, colName, ry);
        ctx.font="bold 13px 'Fira Code',monospace"; ctx.fillStyle=C.accent2;
        ctx.textAlign='right'; ctx.fillText(entry.score, colScore, ry);
      });
    }

    ctx.font="13px 'Plus Jakarta Sans',sans-serif"; ctx.fillStyle=C.dim;
    ctx.textAlign='center';
    ctx.fillText('Got a real bug? Contact me above! 👆', W/2, H-20);
  }
```

---

## Task 7: Physics, collision, update loop

Collision rules:
- **Cactus** (ground): standing hitbox → game over; ducking hitbox is 0 (can't duck under cacti)
- **PTERO LOW** (y ≈ GY-70): jump over (standing hitbox bottom is above ptero); duck passes under (duck hitbox top is below ptero bottom)
- **PTERO MID** (y ≈ GY-112): jump high to avoid OR duck under
- **PTERO HIGH** (y ≈ GY-154): must duck (or jump — standing head y=player.y ≈ 326, ptero bottom y≈148, no collision when standing either)

Hitbox used:
- Standing: `{x:player.x+4, y:player.y, w:DW-8, h:DH-4}` (slight shrink)
- Ducking: `{x:player.x-4, y:player.y, w:DDW-16, h:DDH-2}` (duck = wider, lower)

```javascript
  // ── Update (physics + game logic) ────────────────────────────────
  function update() {
    frame++;
    spd = Math.min(24, 6 + frame * 0.0028 + speedLevel * 1.8);
    score = Math.floor(frame * 0.11 * (spd / 6));

    const milestone = Math.floor(score / 500);
    if (milestone > lastMilestone) { lastMilestone = milestone; speedLevel++; flashTimer = 55; }

    // Gravity
    if (!player.gr) {
      player.vy += GR;
      player.y  += player.vy;
    }
    // Landing
    const floorY = GY - (player.ducking ? DDH : DH);
    if (player.y >= floorY) {
      player.y = floorY;
      player.vy = 0;
      player.gr = true;
    }

    // Spawn + scroll
    if (frame >= obsAt)   spawnObs();
    if (frame >= cloudAt) spawnCloud();
    obs    = obs.filter(o   => { o.x -= spd; return o.x > -o.w - 20; });
    clouds = clouds.filter(c => { c.x -= c.sp * spd * 0.18; return c.x > -c.w - 10; });
    tickParts();

    // Collision
    const ph = player.ducking
      ? {x:player.x-4,   y:player.y,   w:DDW-16, h:DDH-2}
      : {x:player.x+4,   y:player.y,   w:DW-8,   h:DH-4};
    for (let i = obs.length-1; i >= 0; i--) {
      const o = obs[i];
      if (!aabb(ph, o)) continue;
      // Hit!
      state = 'dead'; lastScore = score;
      if (score > hiScore) hiScore = score;
      burst(player.x+DW/2, player.y+DH/2, 24, C.danger);
      floatTxt(player.x+DW/2, player.y-20, 'GAME OVER!');
      loadHighScores();
      return;
    }
  }
```

---

## Task 8: Controls, main loop, share modal

```javascript
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
    state = 'playing';
    initState();
    if (!rafId) tick();
  }
  function hitTest(cx, cy, r) { return r && cx>=r.x && cx<=r.x+r.w && cy>=r.y && cy<=r.y+r.h; }

  // ── Main loop ────────────────────────────────────────────────────
  function tick() {
    ctx.clearRect(0,0,W,H);
    if (state==='waiting') {
      bgFrame++;
      if (!clouds.length) spawnCloud();
      drawBg(bgFrame);
      // Idle dino bounce
      if (!player) player = {x:80, y:GY-DH, vy:0, gr:true, ducking:false, lt:0};
      player.y = GY - DH + Math.sin(bgFrame*.04)*3;
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
    if (state === 'dead') {
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
    shareStatus.textContent = 'Saving…';
    saveHighScore(name, lastScore)
      .then(() => {
        shareStatus.textContent = '✓ Score saved! Check the leaderboard.';
        loadHighScores();
        setTimeout(closeShareModal, 1600);
      })
      .catch(() => {
        shareStatus.className = 'game-share-status error';
        shareStatus.textContent = '✗ Could not save — check your connection.';
        shareSubmit.disabled = false;
      });
  });

  shareNameEl.addEventListener('keydown', e => {
    if (e.key==='Enter') shareSubmit.click();
    e.stopPropagation();
  });

  // ── Boot ─────────────────────────────────────────────────────────
  player = {x:80, y:GY-DH, vy:0, gr:true, ducking:false, lt:0};
  clouds = [];
  parts  = [];
  tick();

  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && rafId) {
      cancelAnimationFrame(rafId); rafId=null;
    } else if (entry.isIntersecting && !rafId) {
      tick();
    }
  }, {threshold:.1}).observe(canvas);
} // end initResumeRun
```

---

## Task 9: Update HTML controls bar

**File:** `index.html` lines ~480–499

Replace `.game-controls` inner content:

```html
<div class="game-controls" data-aos="fade-up" data-aos-delay="130">
  <div class="game-ctrl-item">
    <span class="game-ctrl-key">Space / ↑ / Tap</span>
    <span class="game-ctrl-desc">Jump</span>
  </div>
  <div class="game-ctrl-sep">·</div>
  <div class="game-ctrl-item">
    <span class="game-ctrl-key">↓ / Enter (hold)</span>
    <span class="game-ctrl-desc">Duck</span>
  </div>
  <div class="game-ctrl-sep">·</div>
  <div class="game-ctrl-item">
    <span class="game-ctrl-key">🌵 Cactus</span>
    <span class="game-ctrl-desc">Jump over</span>
  </div>
  <div class="game-ctrl-sep">·</div>
  <div class="game-ctrl-item">
    <span class="game-ctrl-key">🦅 Pterodactyl</span>
    <span class="game-ctrl-desc">Jump or duck</span>
  </div>
</div>
```

Also update the `<p class="game-intro">` text:
```html
<p class="game-intro" data-aos="fade-up" data-aos-delay="100">
  Jump over cacti, dodge pterodactyls — survive as long as you can! Can you beat the high score?
</p>
```

---

## Self-Review Notes

- Cactus drawing uses shape-based branching — all shapes defined in Task 5
- Ptero hitbox: `o.y` to `o.y+o.h` (34px tall), so at PTERO_Y[0]=GY-70=310, ptero spans y=310-344. Duck hitbox when ducking: `y=player.y=GY-DDH=352`, so `352 > 344` → duck clears LOW ptero ✓
- Standing player head: `player.y = GY-DH = 326`, hitbox top = 326. LOW ptero bottom = 344 > 326 → HIT when standing ✓
- HIGH ptero at y=GY-154=226, h=34 → spans y=226-260. Standing player y=326 → no overlap → safe to run under ✓
- `hiScore` is stored in the closure (not Firebase) — if Firebase fails, local hi score still works
- Share modal saves `lastScore` (score at death), not `hiScore`
- `duck()` on keydown + `unduck()` on keyup means holding duck is natural
- In air while ducking: `unduck()` on keyup will change `player.y` mid-air, causing instant "snap up". Guard: `if (player.gr) player.y = GY - DH` in `unduck()` ✓ (already there)
