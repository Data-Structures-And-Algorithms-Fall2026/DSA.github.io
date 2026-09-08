/* DS course site - main logic and animations */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* robust animation clock: side WebViews throttle rAF/setInterval, so we
     drive everything from a shared interval with a clamped timestep */
  const tickers = new Set();
  const MAX_DT = 50; // ms
  let lastTick = performance.now();
  function runTickers(now) {
    let dt = now - lastTick;
    lastTick = now;
    if (dt > MAX_DT) dt = MAX_DT;
    if (dt < 0) dt = 0;
    for (const fn of tickers) { try { fn(dt / 16.67); } catch (e) { /* noop */ } }
  }
  let clockHandle = null;
  if (typeof setInterval !== 'undefined') {
    clockHandle = setInterval(() => runTickers(performance.now()), 33);
    setInterval(() => {
      const now = performance.now();
      if (now - lastTick > 120) runTickers(now);
    }, 100);
  } else {
    const fallback = () => { runTickers(performance.now()); setTimeout(fallback, 33); };
    fallback();
  }

  function wake() {
    if (document.hidden) return;
    lastTick = performance.now();
    runTickers(performance.now());
    runTickers(performance.now());
    if (document.getElementById('class-roadmap')?.classList.contains('active')) boardRelayoutNow();
  }
  let boardRelayoutNow = () => {};
  addEventListener('visibilitychange', wake);
  document.addEventListener('visibilitychange', wake);
  addEventListener('focus', wake);
  addEventListener('pointerdown', wake, { passive: true });
  addEventListener('wheel', wake, { passive: true });
  addEventListener('scroll', wake, { passive: true });
  addEventListener('resize', () => {
    if (window.__heroResize) window.__heroResize();
    if (window.__riverResize) window.__riverResize();
    wake();
  });

  const PALETTE = ['#17b3a6', '#3e7cb8', '#c9972e', '#8f7bb8', '#5a90c4', '#b07a3f', '#6aa87f'];
  const color = i => PALETTE[i % PALETTE.length];
  let boardRelayout = () => {};

  const root = document.documentElement;
  const saved = localStorage.getItem('ds-theme');
  if (saved) root.dataset.theme = saved;
  $('#theme-toggle')?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('ds-theme', next);
  });

  (function heroCanvas() {
    const cv = $('#hero-canvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let W, H, dpr;
    const mouse = { x: 0.5, y: 0.42, tx: 0.5, ty: 0.42 };
    let t = 0;

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    addEventListener('resize', resize);
    window.__heroResize = resize;
    $('.hero').addEventListener('pointermove', e => {
      const r = cv.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = (e.clientY - r.top) / r.height;
    });

    const nodes = [];
    const NS = 26;
    for (let i = 0; i < NS; i++) nodes.push({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00028,
      r: Math.random() * 2.4 + 1.2,
      kind: Math.floor(Math.random() * 4)
    });

    function palette() {
      const s = getComputedStyle(root);
      return [
        s.getPropertyValue('--acc1').trim(),
        s.getPropertyValue('--acc2').trim(),
        s.getPropertyValue('--acc3').trim(),
      ];
    }

    function drawStructure(x, y, s, col, a, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = a;
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.6); ctx.lineTo(-s * 0.5, 0); ctx.moveTo(0, -s * 0.6); ctx.lineTo(s * 0.5, 0);
      ctx.moveTo(-s * 0.5, 0); ctx.lineTo(-s * 0.75, s * 0.5); ctx.moveTo(-s * 0.5, 0); ctx.lineTo(-s * 0.25, s * 0.5);
      ctx.moveTo(s * 0.5, 0); ctx.lineTo(s * 0.75, s * 0.5);
      ctx.stroke();
      const d = (dx, dy, r) => { ctx.beginPath(); ctx.arc(dx, dy, r, 0, 7); ctx.fill(); };
      d(0, -s * 0.6, 1.8); d(-s * 0.5, 0, 1.6); d(s * 0.5, 0, 1.6);
      d(-s * 0.75, s * 0.5, 1.3); d(-s * 0.25, s * 0.5, 1.3); d(s * 0.75, s * 0.5, 1.3);
      ctx.restore();
    }

    function frame(step = 1) {
      if (!reduced) t += 0.006 * step;
      mouse.x = lerp(mouse.x, mouse.tx, Math.min(1, 0.05 * step));
      mouse.y = lerp(mouse.y, mouse.ty, Math.min(1, 0.05 * step));
      if (!W || !H) { resize(); }
      ctx.clearRect(0, 0, W, H);
      const C = palette();
      const mid = H * 0.58;

      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        const steps = 80;
        for (let i = 0; i <= steps; i++) {
          const p = i / steps;
          const my = (mouse.y - 0.5) * 50 * Math.exp(-Math.pow((p - mouse.x) * 2.6, 2));
          const y = mid + k * 26 + Math.sin(p * (2 + k) * Math.PI + t * (1 + k * 0.4)) * (26 - k * 6) + my;
          const x = p * W;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = C[k % 3];
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.16 - k * 0.035;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      const pts = nodes.map(n => {
        if (!reduced) {
          n.x += n.vx * step; n.y += n.vy * step;
          if (n.x < 0) n.x = 1; if (n.x > 1) n.x = 0;
          if (n.y < 0) n.y = 1; if (n.y > 1) n.y = 0;
        }
        return { x: n.x * W, y: n.y * H, n };
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14400) {
            const a = 0.1 * (1 - Math.sqrt(d2) / 120);
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = C[0];
            ctx.globalAlpha = a;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      pts.forEach((p, i) => {
        const n = p.n;
        const a = 0.34;
        ctx.globalAlpha = a;
        ctx.fillStyle = C[i % 3];
        ctx.strokeStyle = C[i % 3];
        if (n.kind === 0) { ctx.beginPath(); ctx.arc(p.x, p.y, n.r, 0, 7); ctx.fill(); }
        else if (n.kind === 1) { ctx.fillRect(p.x - n.r, p.y - n.r, n.r * 2, n.r * 2); }
        else if (n.kind === 2) {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.PI / 4);
          ctx.fillRect(-n.r, -n.r, n.r * 2, n.r * 2); ctx.restore();
        } else { ctx.beginPath(); ctx.arc(p.x, p.y, n.r + 2, 0, 7); ctx.lineWidth = 1; ctx.stroke(); }
      });
      ctx.globalAlpha = 1;

      drawStructure(W * 0.12, H * 0.2, 34, C[0], 0.2, Math.sin(t) * 0.15);
      drawStructure(W * 0.88, H * 0.78, 44, C[1], 0.17, -Math.sin(t * 0.8) * 0.18);
      drawStructure(W * 0.82, H * 0.16, 24, C[2], 0.15, Math.cos(t) * 0.2);
    }
    tickers.add(step => {

      if (document.getElementById('home')?.classList.contains('active')) frame(step);
    });
  })();

  (function glyphs() {
    const box = $('#hero-glyphs');
    if (!box) return;
    const G = ['∑', '∫', 'λ', 'θ', 'π', '√', '∞', '∂', 'ƒ', 'Δ', '≡', '⊕', 'Ω', '∀', '∃', '≤', '≥', '→', '⊂', 'φ', '⌈⌉', 'μ'];
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('span');
      s.className = 'glyph';
      s.textContent = G[i % G.length];
      s.style.left = Math.random() * 96 + '%';
      s.style.top = 12 + Math.random() * 76 + '%';
      s.style.fontSize = 15 + Math.random() * 26 + 'px';
      s.style.animationDelay = (Math.random() * -9) + 's';
      s.style.animationDuration = 7 + Math.random() * 6 + 's';
      s.style.setProperty('--glyph-op', (0.05 + Math.random() * 0.12).toFixed(2));
      box.appendChild(s);
    }
  })();

  (function counters() {
    const els = $$('.meta-num[data-count]');
    const state = els.map(el => ({ el, target: +el.dataset.count, p: 0, done: false }));
    tickers.add((step) => {
      if (!document.getElementById('home')?.classList.contains('active')) return;
      for (const s of state) {
        if (s.done) continue;
        if (s.p === 0) {
          const r = s.el.getBoundingClientRect();
          if (r.top < innerHeight * 0.95 && r.bottom > 0) s.p = 0.0001;
        }
        if (s.p > 0) {
          s.p = Math.min(1, s.p + (16.67 * step) / 1300);
          const e = 1 - Math.pow(1 - s.p, 3);
          s.el.textContent = String(Math.round(s.target * e));
          if (s.p >= 1) s.done = true;
        }
      }
    });
  })();

  const reveal = (function revealFactory() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('revealed', 'in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    const pending = new Set();

/* getBoundingClientRect — IO throttled */
    function rectCheck() {
      const active = document.querySelector('.view.active');
      if (!active) return;
      const vh = innerHeight;
      pending.forEach(el => {
        if (!active.contains(el)) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          el.classList.add('revealed', 'in');
          io.unobserve(el);
          pending.delete(el);
        }
      });
    }
    const scan = (scope) => $$('[data-reveal]:not(.revealed), .tile:not(.in)', scope).forEach(el => {
      io.observe(el); pending.add(el);
    });

    let guard = 0;
    tickers.add(() => { if ((guard = (guard + 1) % 2) === 0) rectCheck(); });

    return { io, scan, rectCheck, pending };
  })();

  (function router() {
    const bar = $('#scroll-progress');
    const nav = $('#nav');
    const links = $$('.links a[href^="#"]');
    const views = $$('.view');

    function show(id, pushHash) {
      const target = document.getElementById(id);
      if (!target || !target.classList.contains('view')) {

        if (target) target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      views.forEach(v => v.classList.toggle('active', v.id === id));
      window.scrollTo({ top: 0, behavior: 'auto' });

      void target.offsetWidth; // reflow
      if (id === 'class-roadmap') boardRelayout();
      if (id === 'home' && window.__heroResize) window.__heroResize();
      if (window.__riverResize) window.__riverResize();
      reveal.scan(target);
      reveal.rectCheck();
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      if (pushHash !== false) {
        history.replaceState(null, '', '#' + id);
      }
    }

    $$('a[href^="#"]').forEach(a => {
      if (a.dataset.soon && !a.getAttribute('href').slice(1)) return;
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        // external or new-tab links: let the browser handle them
        if (a.target === '_blank' || /^https?:\/\//i.test(href)) return;
        const id = href.slice(1);
        if (!id) return;
        e.preventDefault();
        show(id);
      });
    });

/* hash ( #tutors ) */
    const initHash = (location.hash || '').slice(1);
    if (initHash) show(initHash, false);
    else show('home', false);

    let ticking = false;
    function update() {
      const st = scrollY;
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? st / h : 0})`;
      nav.classList.toggle('scrolled', st > 30);
      ticking = false;
    }
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();

/* hashchange ( ) */
    addEventListener('hashchange', () => {
      const id = (location.hash || '#home').slice(1);
      show(id, false);
    });
  })();

  (function whiteboard() {
    const board = $('#board');
    const track = $('#board-track');
    const wave = $('#board-wave');
    const pathMain = $('#wave-path');
    const pathGlow = $('#wave-glow');
    const fill = $('#board-progress-fill');
    if (!board || !track) return;

    let html = '';
    CLASS_ROADMAP.forEach((w, i) => {
      const c = color(w.color);
      const tilt = (i % 2 === 0 ? -1.3 : 1.3).toFixed(1);
      const subs = (w.sub || []).map((s, j) => `<li style="--i:${j}">${s}</li>`).join('');
      html += `
        <div class="wk" style="--wk-c:${c};--tilt:${tilt}deg">
          <div class="wk-pin"></div>
          <div class="wk-card">
            <div class="wk-art">${ILLUSTRATIONS.get(w.art)}</div>
            <div class="wk-head"><span class="wk-week">جلسه ${w.n}</span></div>
            <h3 class="wk-title">${w.title}</h3>
            ${subs ? `<ul class="wk-sessions">${subs}</ul>` : ''}
          </div>
        </div>`;
    });
    track.innerHTML = html;

    let W = 0, H = 0, trackW = 0, period = 540, amp = 0, midY = 0;
    let offset = 0, target = 0, drawn = 1, maxOffset = 0;

    function waveY(x) { return midY + amp * Math.sin((x / period) * Math.PI * 2 + 0.5); }

    function layout() {
      W = board.clientWidth; H = board.clientHeight;
      amp = clamp(H * 0.095, 34, 56);
      midY = H * 0.5;
      const wks = $$('.wk', track);
      trackW = track.scrollWidth;
      wks.forEach(wk => {
        const c = wk.offsetLeft + wk.offsetWidth / 2;
        const y = waveY(c);
        wk.style.height = '100%';
        wk.style.paddingTop = clamp(y - 8, 36, H - 235) + 'px';
        wk.style.justifyContent = 'flex-start';
      });
      let d = '';
      const N = 240;
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * (trackW + 200) - 100;
        d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + waveY(x).toFixed(1) + ' ';
      }
      pathMain.setAttribute('d', d);
      pathGlow.setAttribute('d', d);
      wave.setAttribute('viewBox', `0 0 ${trackW + 200} ${H}`);
      wave.style.width = (trackW + 200) + 'px';
      wave.style.height = H + 'px';
      wave.style.left = '-100px';
      maxOffset = Math.max(0, trackW + 200 - W - 100);
    }

    boardRelayout = () => {
      layout();
      track.style.transform = `translateX(${-offset}px)`;
      wave.style.transform = `translateX(${-offset}px)`;
      if (!wave.classList.contains('def')) {
        wave.classList.add('def');
        const p = $('#wave-path'), g = $('#wave-glow');
        p.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)';
        g.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1) 0.2s';
        const want = 1 - clamp(W / Math.max(1, trackW + 200), 0.15, 1);
        requestAnimationFrame(() => {
          p.style.strokeDashoffset = want;
          g.style.strokeDashoffset = want;
        });
      }
    };

    function render(step = 1) {
      if (!W || !H) layout();
      target = clamp(target, 0, maxOffset);
      offset = lerp(offset, target, Math.min(1, 0.08 * step));
      if (Math.abs(offset - target) < 0.4) offset = target;
      track.style.transform = `translateX(${-offset}px)`;
      wave.style.transform = `translateX(${-offset}px)`;
      const frac = clamp((offset + 100 + W) / (trackW + 200), 0, 1);
      drawn = lerp(drawn, 1 - frac, Math.min(1, 0.12 * step));
      pathMain.style.strokeDashoffset = drawn;
      pathGlow.style.strokeDashoffset = drawn;
      fill.style.width = maxOffset ? (offset / maxOffset * 100) + '%' : '0%';
      $$('.wk', track).forEach(wk => {
        const c = wk.offsetLeft + wk.offsetWidth / 2 - offset;
        wk.classList.toggle('revealed', c > -40 && c < W + 40);
        wk.classList.toggle('active', c > W * 0.3 && c < W * 0.7);
      });
    }
    tickers.add(step => {
      if (document.getElementById('class-roadmap')?.classList.contains('active')) render(step);
    });

    board.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) { e.preventDefault(); target += e.deltaY; }
    }, { passive: false });

    let dragging = false, startX = 0, startOff = 0;
    board.addEventListener('pointerdown', e => {
      dragging = true; startX = e.clientX; startOff = target;
      board.setPointerCapture?.(e.pointerId);
    });
    addEventListener('pointermove', e => { if (dragging) target = startOff - (e.clientX - startX) * 1.4; });
    addEventListener('pointerup', () => dragging = false);

    const step = () => Math.min(620, W * 0.7);
    $('#board-prev')?.addEventListener('click', () => { target += step(); });
    $('#board-next')?.addEventListener('click', () => { target -= step(); });

    addEventListener('keydown', e => {
      const r = board.getBoundingClientRect();
      if (r.top > innerHeight || r.bottom < 0) return;
      if (e.key === 'ArrowRight') { target -= 70; e.preventDefault(); }
      if (e.key === 'ArrowLeft') { target += 70; e.preventDefault(); }
    });

    layout();
    boardRelayoutNow = boardRelayout;
    const ro = new ResizeObserver(() => {
      const keep = offset / Math.max(1, maxOffset);
      layout();
      offset = target = keep * maxOffset;
      track.style.transform = `translateX(${-offset}px)`;
      wave.style.transform = `translateX(${-offset}px)`;
    });
    ro.observe(board);

    render(1);
  })();

  (function timeline() {
    const wrap = $('#timeline');
    const items = $('#tl-items');
    const lineFill = $('#tl-fill');
    if (!wrap || !items) return;

    let html = '';
    WORKSHOPS.forEach((g, gi) => {
      const c = color(g.color);
      const btnCls = g.link ? '' : 'soon';
      html += `
        <div class="tl-item" style="--tl-c:${c}">
          <div class="tl-dot"></div>
          <div class="tl-card">
            <div class="tl-art">${ILLUSTRATIONS.get(g.art)}</div>
            <div class="tl-main">
              <div class="tl-head">
                <span class="tl-week-badge">کارگاه ${g.n}${g.n === 14 ? '<span class="plus-one">+1</span>' : ''}</span>
              </div>
              <h3 class="tl-title">${g.title}</h3>
              <ul class="tl-sessions">${g.sessions.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
            <a class="tl-link ${btnCls}" href="${g.link || '#'}" data-soon="${g.link ? '' : '1'}">
              <span>مشاهده کارگاه ${g.n}</span>
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M13 5 7 10l6 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </div>`;
    });
    items.innerHTML = html;

    const tlItems = $$('.tl-item', items);

    function update() {
      if (!document.getElementById('tutoring-roadmap')?.classList.contains('active')) return;
      const rect = wrap.getBoundingClientRect();
      const vh = innerHeight;
      const progress = clamp((vh * 0.72 - rect.top) / rect.height, 0, 1);
      lineFill.style.height = (progress * 100) + '%';
      tlItems.forEach((it, i) => {
        it.style.transitionDelay = (i % 2) * 0.06 + 's';
        const r = it.getBoundingClientRect();
        it.classList.toggle('in', r.top < vh * 0.8);
      });
    }
/* ( throttling) / */
    tickers.add(() => update());
    let ticking = false;
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    addEventListener('resize', update);
    update();
  })();

  (function river() {
    const cv = $('#river-canvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const wrap = $('#timeline');
    let W, H, dpr, items = [];
    const rand = (a, b) => a + Math.random() * (b - a);
    const GLYPHS = ['O(n)', 'n²', 'log n', 'O(1)', '∑', 'Ω', 'θ', 'f(n)', 'T(n)', 'π', '≤', '∀'];

    const KINDS = ['tree', 'graph', 'stack', 'list', 'heap', 'node', 'glyph', 'square'];

    function drawShape(kind, s, col, a) {
      ctx.globalAlpha = a;
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 1;
      const n = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
      const l = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
      switch (kind) {
        case 'tree':
          l(0, -s * 0.6, -s * 0.5, 0); l(0, -s * 0.6, s * 0.5, 0);
          l(-s * 0.5, 0, -s * 0.72, s * 0.45); l(-s * 0.5, 0, -s * 0.28, s * 0.45);
          l(s * 0.5, 0, s * 0.72, s * 0.45);
          n(0, -s * 0.6, 1.8); n(-s * 0.5, 0, 1.6); n(s * 0.5, 0, 1.6);
          n(-s * 0.72, s * 0.45, 1.3); n(-s * 0.28, s * 0.45, 1.3); n(s * 0.72, s * 0.45, 1.3);
          break;
        case 'graph':
          l(-s * 0.5, -s * 0.3, s * 0.4, -s * 0.5); l(s * 0.4, -s * 0.5, s * 0.55, s * 0.1);
          l(s * 0.55, s * 0.1, 0, s * 0.35); l(0, s * 0.35, -s * 0.55, 0);
          l(-s * 0.55, 0, -s * 0.5, -s * 0.3); l(0, s * 0.35, s * 0.4, -s * 0.5);
          n(-s * 0.5, -s * 0.3, 1.6); n(s * 0.4, -s * 0.5, 1.6); n(s * 0.55, s * 0.1, 1.6);
          n(0, s * 0.35, 1.6); n(-s * 0.55, 0, 1.6);
          break;
        case 'stack':
          for (let i = 0; i < 3; i++) {
            const y = s * 0.45 - i * s * 0.4;
            ctx.strokeRect(-s * 0.45, y - s * 0.16, s * 0.9, s * 0.28);
          }
          l(0, -s * 0.6, 0, -s * 0.35);
          l(-s * 0.12, -s * 0.46, 0, -s * 0.33); l(s * 0.12, -s * 0.46, 0, -s * 0.33);
          break;
        case 'list':
          for (let i = 0; i < 3; i++) {
            const x = -s * 0.62 + i * s * 0.62;
            ctx.strokeRect(x, -s * 0.14, s * 0.4, s * 0.28);
            if (i < 2) { l(x + s * 0.4, 0, x + s * 0.62, 0); }
          }
          l(s * 0.18, -s * 0.1, s * 0.3, 0); l(s * 0.18, s * 0.1, s * 0.3, 0);
          break;
        case 'heap':
          l(0, -s * 0.5, -s * 0.4, s * 0.15); l(0, -s * 0.5, s * 0.4, s * 0.15);
          n(0, -s * 0.5, 1.8); n(-s * 0.4, s * 0.15, 1.5); n(s * 0.4, s * 0.15, 1.5);
          n(-s * 0.55, s * 0.55, 1.2); n(-s * 0.25, s * 0.55, 1.2);
          break;
        case 'node':
          ctx.beginPath(); ctx.arc(0, 0, s * 0.35, 0, 7); ctx.stroke();
          n(0, 0, 1.6);
          ctx.beginPath(); ctx.arc(0, 0, s * 0.52, 0.4, 2.4); ctx.stroke();
          break;
        case 'square':
          ctx.strokeRect(-s * 0.35, -s * 0.35, s * 0.7, s * 0.7);
          n(0, 0, 1.4);
          break;
        case 'glyph':
          break;
      }
    }

    function makeItem() {
      return {
        x: rand(0.03, 0.97),
        y: H + rand(20, 200),
        speed: rand(22, 52),
        kind: Math.random() < 0.3 ? 'glyph' : KINDS[Math.floor(Math.random() * (KINDS.length - 1))],
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        size: rand(9, 17),
        s: rand(10, 24),
        rot: rand(-0.5, 0.5),
        rotV: rand(-0.004, 0.004),
        wobble: rand(0, Math.PI * 2),
        wobbleAmp: rand(8, 26),
        freq: rand(0.4, 1.3),
        alpha: rand(0.16, 0.42),
        col: Math.floor(Math.random() * 4),
      };
    }

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = wrap.clientWidth; H = wrap.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = clamp(Math.floor(W * H / 9000), 26, 70);
      items = [];
      for (let i = 0; i < n; i++) {
        const it = makeItem();
        it.y = rand(0, H);
        items.push(it);
      }
    }
    resize();
    addEventListener('resize', resize);
    window.__riverResize = resize;

    let visible = true;
    const vio = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 });
    vio.observe(wrap);

    function colors() {
      const s = getComputedStyle(root);
      return [
        s.getPropertyValue('--acc1').trim(),
        s.getPropertyValue('--acc2').trim(),
        s.getPropertyValue('--acc3').trim(),
        s.getPropertyValue('--muted').trim(),
      ];
    }

    function frame(step = 1) {
      if (visible && !document.hidden) {
        if (!W || !H) resize();
        ctx.clearRect(0, 0, W, H);
        const C = colors();
        for (let i = 0; i < items.length; i++) {
          const p = items[i];
          if (!reduced) {
            p.y -= p.speed * 0.016 * step;
            p.wobble += 0.014 * p.freq * step;
            p.rot += p.rotV * step;
            if (p.y < -60) items[i] = Object.assign(makeItem(), { y: H + rand(20, 200) });
          }
          const wob = Math.sin(p.wobble) * p.wobbleAmp;
          const x = p.x * W + wob;
          const fade = clamp(Math.min(p.y / 90, (H - p.y) / 90, 1), 0, 1);
          const col = C[p.col];
          ctx.save();
          ctx.translate(x, p.y);
          ctx.rotate(p.rot);
          if (p.kind === 'glyph') {
            ctx.globalAlpha = p.alpha * fade;
            ctx.font = `${p.size}px "STIX Two Text", Georgia, serif`;
            ctx.fillStyle = col;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.direction = 'ltr';
            ctx.fillText(p.glyph, 0, 0);
          } else {
            drawShape(p.kind, p.s, col, p.alpha * fade);
          }
          ctx.restore();
          if (!p.isCircle) {
            ctx.globalAlpha = p.alpha * fade * 0.16;
            const g = ctx.createLinearGradient(x, p.y, x, p.y + 30);
            g.addColorStop(0, col);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.fillRect(x - 0.5, p.y, 1, 30);
          }
        }
        ctx.globalAlpha = 1;
      }
    }
    tickers.add(step => {
      if (document.getElementById('tutoring-roadmap')?.classList.contains('active')) frame(step);
    });
  })();

  (function deco() {
    const box = $('#deco-bg');
    if (!box) return;
    const S = 'fill="none" stroke-width="1.2" vector-effect="non-scaling-stroke"';
    const shapes = [
      { t: 'tree',  s: 110, x: '3%',  y: '16%', c: 0, o: 0.11, d: 16 },
      { t: 'graph', s: 130, x: '90%', y: '9%',  c: 1, o: 0.10, d: 19 },
      { t: 'heap',  s: 100, x: '94%', y: '40%', c: 2, o: 0.09, d: 14 },
      { t: 'rect',  s: 140, x: '1%',  y: '50%', c: 3, o: 0.10, d: 17 },
      { t: 'tree2', s: 95,  x: '92%', y: '70%', c: 0, o: 0.11, d: 15 },
      { t: 'curve', s: 150, x: '3%',  y: '82%', c: 1, o: 0.10, d: 20 },
      { t: 'hex',   s: 85,  x: '50%', y: '26%', c: 2, o: 0.07, d: 13 },
      { t: 'stack', s: 105, x: '46%', y: '80%', c: 3, o: 0.08, d: 18 },
    ];
    const cols = ['var(--acc1)', 'var(--acc2)', 'var(--acc3)', 'var(--acc4)'];
    const inner = {
      tree:  `<svg viewBox="0 0 100 100"><g ${S} stroke="COL"><path d="M50 12 L28 40 M50 12 L72 40 M28 40 L16 66 M28 40 L42 66 M72 40 L60 66 M72 40 L84 66"/><circle cx="50" cy="12" r="4"/><circle cx="28" cy="40" r="3.4"/><circle cx="72" cy="40" r="3.4"/><circle cx="16" cy="66" r="3"/><circle cx="42" cy="66" r="3"/><circle cx="60" cy="66" r="3"/><circle cx="84" cy="66" r="3"/></g></svg>`,
      graph: `<svg viewBox="0 0 100 100"><g ${S} stroke="COL"><path d="M20 30 L55 18 L75 45 L45 60 L25 78 L55 18 M45 60 L75 82 L25 78 M75 45 L75 82"/><circle cx="20" cy="30" r="3.6"/><circle cx="55" cy="18" r="3.6"/><circle cx="75" cy="45" r="3.6"/><circle cx="45" cy="60" r="3.6"/><circle cx="25" cy="78" r="3.6"/><circle cx="75" cy="82" r="3.6"/></g></svg>`,
      heap:  `<svg viewBox="0 0 100 100"><g ${S} stroke="COL"><path d="M50 14 L32 44 M50 14 L70 44 M32 44 L22 72 M32 44 L44 72 M70 44 L60 72 M70 44 L82 72"/><circle cx="50" cy="14" r="4.6"/><circle cx="32" cy="44" r="3.8"/><circle cx="70" cy="44" r="3.8"/><circle cx="22" cy="72" r="3.2"/><circle cx="44" cy="72" r="3.2"/><circle cx="60" cy="72" r="3.2"/><circle cx="82" cy="72" r="3.2"/></g></svg>`,
      rect:  `<svg viewBox="0 0 100 100"><g ${S} stroke="COL"><rect x="8" y="24" width="46" height="14" rx="3"/><rect x="8" y="44" width="46" height="14" rx="3"/><rect x="8" y="64" width="46" height="14" rx="3"/><path d="M54 31 h16 m-4 -3.5 l4 3.5 l-4 3.5 M54 51 h28 m-4 -3.5 l4 3.5 l-4 3.5 M54 71 h20 m-4 -3.5 l4 3.5 l-4 3.5"/></g></svg>`,
      tree2: `<svg viewBox="0 0 100 100"><g ${S} stroke="COL"><path d="M50 14 L30 42 L14 70 M30 42 L48 70 M50 14 L72 42 L86 68 M72 42 L60 72"/><circle cx="50" cy="14" r="4.4"/><circle cx="30" cy="42" r="3.6"/><circle cx="72" cy="42" r="3.6"/><circle cx="14" cy="70" r="3.2"/><circle cx="48" cy="70" r="3.2"/><circle cx="86" cy="68" r="3.2"/><circle cx="60" cy="72" r="3.2"/></g></svg>`,
      curve: `<svg viewBox="0 0 100 100"><g ${S} stroke="COL"><path d="M6 86 H94 M6 86 V10"/><path d="M6 86 C 34 84, 58 66, 92 22"/><path d="M6 80 C 40 78, 60 64, 92 48" opacity="0.6"/></g></svg>`,
      hex:   `<svg viewBox="0 0 100 100"><g ${S} stroke="COL"><polygon points="50,10 84,30 84,70 50,90 16,70 16,30"/><polygon points="50,26 72,39 72,61 50,74 28,61 28,39" opacity="0.6"/></g></svg>`,
      stack: `<svg viewBox="0 0 100 100"><g ${S} stroke="COL"><rect x="22" y="58" width="34" height="16" rx="3"/><rect x="22" y="38" width="34" height="16" rx="3"/><rect x="22" y="18" width="34" height="16" rx="3"/><path d="M62 26 c 8 10, -6 18, -14 14 M66 52 c 10 -2, 14 8, 8 14"/></g><path d="M39 6 l0 8 M36 9.5 l3 3.5 l3 -3.5" ${S} stroke="COL"/></svg>`,
    };
    shapes.forEach((sh, i) => {
      const d = document.createElement('div');
      d.className = 'deco-shape';
      d.style.cssText = `left:${sh.x};top:${sh.y};width:${sh.s}px;height:${sh.s}px;--op:${sh.o};--dur:${sh.d}s;--delay:${-i * 1.7}s;--rot0:${i % 2 ? -6 : 4}deg;--rot1:${i % 2 ? 8 : -10}deg`;
      d.innerHTML = inner[sh.t].split('COL').join(cols[sh.c]);
      box.appendChild(d);
    });
  })();

  (function exercises() {
    const grid = $('#exercises-grid');
    if (!grid) return;
    grid.innerHTML = EXERCISES.map((e, i) => `
      <a class="tile ex-tile" style="--tile-c:${color(i)};transition-delay:${i * 0.07}s" href="${e.link || '#'}" data-soon="${e.link ? '' : '1'}">
        <span class="tile-num math">${e.n}</span>
        <div class="ex-glyph" aria-hidden="true">${ILLUSTRATIONS.get(['tree', 'graph', 'stackqueue', 'heap', 'skiplist', 'hashing'][i])}</div>
        <div class="tile-body">
          <h3 class="tile-title">تمرین ${e.n}</h3>
        </div>
        <div class="tile-foot">
          ${e.link ? 'مشاهده تمرین' : '<span class="soon">لینک به‌زودی</span>'}
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M13 5 7 10l6 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </a>`).join('');
  })();

  /* organizers: professor + tutors */
  (function organizers() {
    const grid = $('#tutors-grid');
    if (grid) {
      grid.innerHTML = TUTORS.map((t, i) => `
        <div class="tile tutor-card" style="--tile-c:${color(i)};transition-delay:${i * 0.07}s">
          <div class="tutor-name">${t.name}</div>
          <div class="tutor-role">تدریسیار</div>
          <a class="tutor-mail" dir="ltr" href="mailto:${t.email}">${t.email}</a>
        </div>`).join('');
    }

    const pn = $('#prof-name'); if (pn) pn.textContent = PROFESSOR.name;
    const pm = $('#prof-mail'); if (pm) pm.textContent = PROFESSOR.email;

    const cl = $('#course-link'); if (cl) cl.href = LINKS.course;
    const tg = $('#tg-link'); if (tg) tg.href = LINKS.telegram;
    const pc = $('#professor-card');
    if (pc && PROFESSOR.email) {
      const mail = document.createElement('a');
      mail.className = 'org-mail'; mail.dir = 'ltr';
      mail.href = 'mailto:' + PROFESSOR.email;
      mail.textContent = PROFESSOR.email;
      const old = pc.querySelector('.org-mail'); if (old) old.replaceWith(mail);
    }
  })();

  (function special() {
    const art = $('#special-art');
    if (art) art.innerHTML = ILLUSTRATIONS.specialArt();
  })();

  (function reveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('revealed', 'in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal], .tile').forEach(el => io.observe(el));
  })();

  (function soon() {
    let toast;
    function show(msg) {
      if (toast) toast.remove();
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = msg;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast?.remove(); toast = null; }, 400);
      }, 2600);
    }
    document.addEventListener('click', e => {
      const el = e.target.closest('[data-soon="1"]');
      if (!el) return;
      e.preventDefault();
      show('لینک به‌محض انتشار در همین جایگاه قرار می‌گیرد.');
    });
  })();

  const st = document.createElement('style');
  st.textContent = `
    .toast{
      position:fixed; bottom:30px; left:50%; transform:translate(-50%,20px);
      z-index:200; background:var(--card); color:var(--ink);
      border:1px solid var(--line2); border-radius:14px;
      padding:13px 22px; font-size:14px; font-weight:600; font-family:var(--font);
      box-shadow:var(--shadow); opacity:0; transition:opacity .35s,transform .35s var(--ease-spring);
      max-width:90vw; text-align:center;
    }
    .toast.show{opacity:1; transform:translate(-50%,0);}
  `;
  document.head.appendChild(st);
})();
