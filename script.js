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
  const STORE_KEY = 'portfolio_likes';
  const LIKED_KEY = 'portfolio_liked';

  let count  = parseInt(localStorage.getItem(STORE_KEY) || '0', 10);
  let liked  = localStorage.getItem(LIKED_KEY) === 'true';

  function render() {
    countEl.textContent = count >= 1000
      ? (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
      : count;
    btn.classList.toggle('liked', liked);
    countEl.classList.toggle('liked-text', liked);
  }

  function spawnParticles() {
    const r  = btn.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top  + r.height / 2;
    const n  = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
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

  btn.addEventListener('click', () => {
    liked = !liked;
    count = liked ? count + 1 : Math.max(0, count - 1);
    localStorage.setItem(STORE_KEY, count);
    localStorage.setItem(LIKED_KEY, liked);
    render();

    btn.classList.remove('pop');
    void btn.offsetWidth;
    btn.classList.add('pop');
    btn.addEventListener('animationend', () => btn.classList.remove('pop'), { once: true });

    if (liked) spawnParticles();
  });

  render();
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
