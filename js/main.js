// Portfolio interactions. No dependencies; every effect has a reduced-motion path.
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = matchMedia('(max-width: 900px)');

  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Split headings into masked words. The words stay in reading order, so the heading text
  // is not duplicated for crawlers or screen readers.
  $$('[data-split]').forEach((el) => {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    const frag = document.createDocumentFragment();
    text.split(' ').forEach((word, i) => {
      const outer = document.createElement('span');
      outer.className = 'w';
      const inner = document.createElement('span');
      inner.style.setProperty('--wi', i);
      inner.textContent = word;
      outer.appendChild(inner);
      frag.append(outer, ' ');
    });
    el.replaceChildren(frag);
  });

  // Load-in, after fonts settle so words don't reflow mid-animation.
  $$('[data-load]').forEach((el) => el.style.setProperty('--i', el.dataset.load));
  const start = () => requestAnimationFrame(() => document.body.classList.add('is-loaded'));
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 700))]).then(start);
  } else start();

  // Reveals.
  $$('[data-stagger]').forEach((group) => {
    $$('[data-reveal]', group).forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 6) * 90}ms`));
  });
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      revealIO.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('[data-reveal], [data-split]').forEach((el) => revealIO.observe(el));

  // Navigation: active chapter, sliding indicator, drawer.
  const nav = $('#nav');
  const indicator = $('.nav__indicator');
  const navLinks = $$('.nav__links a');
  const setActive = (id) => {
    const link = navLinks.find((a) => a.getAttribute('href') === `#${id}`);
    navLinks.forEach((a) => a.classList.toggle('is-active', a === link));
    if (!indicator) return;
    if (link) {
      indicator.style.opacity = '1';
      indicator.style.transform = `translateX(${link.offsetLeft + 12}px) scaleX(${link.offsetWidth - 24})`;
    } else indicator.style.opacity = '0';
  };
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => sectionIO.observe(s));

  const toggle = $('.nav__toggle');
  const drawer = $('#drawer');
  const setDrawer = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.hidden = !open;
  };
  toggle.addEventListener('click', () => setDrawer(drawer.hidden));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setDrawer(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) setDrawer(false); });

  // Signal traces on the work cards, seeded per card so each one differs.
  $$('.build__trace path').forEach((path, idx) => {
    let seed = idx * 9301 + 49297;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const f = [0.02 + rnd() * 0.03, 0.06 + rnd() * 0.06, 0.18 + rnd() * 0.1];
    const a = [10 + rnd() * 8, 4 + rnd() * 5, 1.5 + rnd() * 2];
    const ph = [rnd() * 6, rnd() * 6, rnd() * 6];
    const spikes = [60 + rnd() * 60, 170 + rnd() * 90];
    let d = '';
    for (let x = 0; x <= 300; x += 2) {
      let y = 40;
      for (let k = 0; k < 3; k++) y += a[k] * Math.sin(f[k] * x + ph[k]);
      spikes.forEach((s) => { y -= 26 * Math.exp(-((x - s) ** 2) / 10) - 10 * Math.exp(-((x - s - 6) ** 2) / 14); });
      d += `${x ? 'L' : 'M'}${x} ${clamp(y, 4, 76).toFixed(1)}`;
    }
    path.setAttribute('d', d);
    const len = Math.ceil(path.getTotalLength());
    path.style.setProperty('--len', len);
    path.style.strokeDasharray = len;
  });

  // Pinned horizontal gallery.
  const gallery = $('.gallery');
  const gTrack = $('.gallery__track');
  const gMeter = $('.gallery__meter');
  let gDist = 0;
  const sizeGallery = () => {
    if (!gallery) return;
    if (reduce) {
      gallery.style.height = '';
      gTrack.style.transform = '';
      gDist = 0;
      return;
    }
    // Measure to the last card plus the track's end padding; scrollWidth omits flex end padding.
    const last = gTrack.lastElementChild;
    const padEnd = parseFloat(getComputedStyle(gTrack).paddingRight) || 0;
    gDist = Math.max(last.offsetLeft + last.offsetWidth + padEnd - document.documentElement.clientWidth, 0);
    gallery.style.height = `${innerHeight + gDist}px`;
  };

  // One scroll loop for everything scroll-linked.
  const bar = $('.progress span');
  const visual = $('.hero__visual');
  const story = $('.story');
  const timeline = $('.timeline');
  let lastY = scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = scrollY;
    const vh = innerHeight;
    const dy = y - lastY;
    const max = document.documentElement.scrollHeight - vh;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    nav.classList.toggle('is-scrolled', y > 12);
    if (drawer.hidden) {
      if (dy > 6 && y > 480) nav.classList.add('is-hidden');
      else if (dy < -6 || y < 480) nav.classList.remove('is-hidden');
    }
    lastY = y;

    if (!reduce && visual && !narrow.matches && y < vh * 1.3) {
      visual.style.setProperty('--py', `${(y * 0.1).toFixed(1)}px`);
    }

    if (story && !reduce && !narrow.matches) {
      const p = clamp((vh - story.getBoundingClientRect().top) / (vh * 0.85));
      story.style.setProperty('--ci', `${((1 - p) * Math.min(64, innerWidth * 0.05)).toFixed(1)}px`);
      story.style.setProperty('--cr', `${((1 - p) * 40).toFixed(1)}px`);
    }

    if (gDist > 0) {
      const p = clamp(-gallery.getBoundingClientRect().top / gDist);
      gTrack.style.transform = `translate3d(${(-p * gDist).toFixed(1)}px,0,0)`;
      gMeter.style.setProperty('--gp', p.toFixed(3));
    }

    if (timeline) {
      const r = timeline.getBoundingClientRect();
      timeline.style.setProperty('--tp', clamp((vh * 0.7 - r.top) / r.height).toFixed(3));
    }

    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  addEventListener('resize', () => { sizeGallery(); onScroll(); }, { passive: true });
  sizeGallery();
  onScroll();
  if (document.fonts) document.fonts.ready.then(() => { sizeGallery(); onScroll(); });

  // Hero portrait: the photo drifts slightly inside its circle with the pointer.
  const portraitImg = $('.hero__portrait img');
  if (portraitImg && !reduce && matchMedia('(hover: hover)').matches) {
    const hero = $('.hero');
    hero.addEventListener('pointermove', (e) => {
      const x = (e.clientX / innerWidth - 0.5) * -14;
      const y = (e.clientY / innerHeight - 0.5) * -14;
      portraitImg.style.setProperty('--ix', `${x.toFixed(1)}px`);
      portraitImg.style.setProperty('--iy', `${y.toFixed(1)}px`);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      portraitImg.style.removeProperty('--ix');
      portraitImg.style.removeProperty('--iy');
    });
  }

  // Art motifs: equaliser bars with varied heights and tempos, and a looping film strip.
  const eq = $('.eq');
  if (eq) {
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const bars = narrow.matches ? 22 : 34;
    for (let i = 0; i < bars; i++) {
      const bar = document.createElement('i');
      const envelope = 0.35 + 0.65 * Math.sin((i / (bars - 1)) * Math.PI);
      bar.style.setProperty('--h', (0.25 + 0.75 * envelope * (0.55 + 0.45 * rnd())).toFixed(2));
      bar.style.setProperty('--dur', `${(0.7 + rnd() * 0.9).toFixed(2)}s`);
      bar.style.setProperty('--del', `${(-rnd() * 1.6).toFixed(2)}s`);
      eq.appendChild(bar);
    }
  }
  const reel = $('.reel__track');
  if (reel) {
    for (let i = 0; i < 24; i++) reel.appendChild(document.createElement('span'));
  }

  // Copy speaker bio.
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    const text = $(btn.dataset.copy).textContent.replace(/\s+/g, ' ').trim();
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied';
    } catch {
      btn.textContent = 'Select and copy';
    }
    setTimeout(() => { btn.textContent = 'Copy bio'; }, 2200);
  }));

  // Background: slow flowing lines behind the whole page, bent by the pointer
  // and carried along by scroll. Pauses when the tab is hidden.
  const canvas = $('.bg-lines');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const mouse = { x: -1e4, y: -1e4, s: 0, target: 0 };
    let w = 0, h = 0, n = 0, grad = null, running = false, raf = 0, last = 0;
    const t0 = performance.now();

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      w = innerWidth; h = innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      n = w < 700 ? 6 : 9;
      grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, 'rgba(46,139,154,0)');
      grad.addColorStop(0.2, 'rgba(46,139,154,1)');
      grad.addColorStop(0.8, 'rgba(29,106,118,1)');
      grad.addColorStop(1, 'rgba(29,106,118,0)');
    };

    const draw = (now) => {
      if (running) raf = requestAnimationFrame(draw);
      if (w < 700 && now - last < 32) return; // ~30 fps on small screens
      last = now;
      const t = reduce ? 0 : (now - t0) / 1000;
      const flow = scrollY * 0.0016;
      mouse.s += (mouse.target - mouse.s) * 0.06;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = grad;
      const step = w < 700 ? 9 : 11;
      for (let i = 0; i < n; i++) {
        const f = i / (n - 1);
        const base = h * (0.5 + 0.42 * (f - 0.5)) + Math.sin(flow + i * 0.7) * h * 0.05;
        const amp = h * 0.05 * (0.6 + 0.4 * Math.sin(f * 3.1 + t * 0.15 + flow));
        ctx.globalAlpha = 0.05 + 0.13 * Math.sin(f * Math.PI);
        ctx.lineWidth = 1 + 0.3 * f;
        ctx.beginPath();
        for (let x = 0; x <= w + step; x += step) {
          const u = x / w;
          let y = base
            + amp * Math.sin(u * 5.2 + t * 0.3 + i * 0.55 + flow * 1.6)
            + amp * 0.45 * Math.sin(u * 12.4 - t * 0.2 + i * 1.3 - flow)
            + amp * 0.05 * Math.sin(u * 88 + t * 2.4 + i);
          if (mouse.s > 0.01) {
            const dx = x - mouse.x, dy = y - mouse.y;
            y += (dy >= 0 ? 1 : -1) * Math.exp(-(dx * dx + dy * dy) / 36000) * 34 * mouse.s;
          }
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const play = () => { if (running || reduce) return; running = true; raf = requestAnimationFrame(draw); };
    const pause = () => { running = false; cancelAnimationFrame(raf); };
    resize();
    draw(performance.now());
    play();
    document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
    addEventListener('resize', () => { resize(); if (!running) draw(performance.now()); }, { passive: true });
    if (reduce) addEventListener('scroll', () => draw(performance.now()), { passive: true });
    addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.target = 1; }, { passive: true });
    document.addEventListener('pointerleave', () => { mouse.target = 0; });
  }
})();
