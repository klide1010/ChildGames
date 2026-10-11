'use strict';
/* Taglia la Frutta: striscia il dito sulla frutta che vola, evita le bombe. */
App.register({
  id: 'frutta',
  title: 'Taglia la Frutta',
  desc: 'Striscia il dito per tagliare la frutta che salta. Attenzione alle bombe!',
  color: '#ff5d73',
  duration: 60,
  art: () => '<span class="emo">🍉</span><span class="emo">🍓</span>',
  stars: p => (p >= 600 ? 3 : p >= 300 ? 2 : p >= 100 ? 1 : 0),

  start(ctx) {
    const FRUITS = [
      ['🍉', '#ff4d6d'], ['🍎', '#e63946'], ['🍊', '#ff9f1c'], ['🍋', '#ffd60a'],
      ['🍌', '#ffe066'], ['🍍', '#ffc300'], ['🍓', '#ef233c'], ['🍇', '#7b2cbf'],
      ['🥝', '#80b918'], ['🍑', '#ffadad'], ['🍒', '#d00000'], ['🥥', '#f1f1f1'],
    ];
    const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    const cv = ctx.canvas();
    const g = cv.g;
    const { rand } = U;

    let items = [], pieces = [], drops = [], trail = [];
    let running = false, raf = 0, last = 0, t = 0, spawnIn = 0.4, shake = 0, flash = 0;
    let swiping = false, swipeHits = 0, cut = 0, bombs = 0, lastPt = null;

    const radius = () => Math.max(30, Math.min(cv.W, cv.H) * 0.085);
    const gravity = () => cv.H * 1.1;

    // Ogni emoji viene disegnata una volta sola su un'immagine e poi solo copiata:
    // molto più veloce e affidabile sui telefoni che riscriverla a ogni fotogramma.
    const sprites = {};
    function sprite(e, r) {
      const key = e + '|' + Math.round(r);
      if (!sprites[key]) {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const size = Math.ceil(r * 2.6);
        const c = document.createElement('canvas');
        c.width = c.height = Math.ceil(size * dpr);
        const sg = c.getContext('2d');
        sg.scale(dpr, dpr);
        sg.font = `${Math.round(r * 2)}px ${EMOJI_FONT}`;
        sg.textAlign = 'center';
        sg.textBaseline = 'middle';
        sg.fillText(e, size / 2, size / 2 + r * 0.1);
        sprites[key] = { c, size };
      }
      return sprites[key];
    }

    // Sfondo di legno disegnato una volta e poi copiato (il canvas è opaco)
    let bg = null;
    function background() {
      const W = cv.W, H = cv.H;
      if (!bg || bg.W !== W || bg.H !== H) {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const c = document.createElement('canvas');
        c.width = Math.ceil(W * dpr); c.height = Math.ceil(H * dpr);
        const bgc = c.getContext('2d');
        bgc.scale(dpr, dpr);
        const grad = bgc.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#8d5a32'); grad.addColorStop(1, '#5c3418');
        bgc.fillStyle = grad;
        bgc.fillRect(0, 0, W, H);
        bgc.fillStyle = 'rgba(0,0,0,.08)';
        for (let x = 70; x < W; x += 72) bgc.fillRect(x, 0, 2, H);
        bg = { c, W, H };
      }
      g.drawImage(bg.c, 0, 0, W, H);
    }

    function spawn() {
      const W = cv.W, H = cv.H, grav = gravity();
      let n = 1;
      if (Math.random() < 0.35) n++;
      if (t > 25 && Math.random() < 0.35) n++;
      if (t > 45 && Math.random() < 0.3) n++;
      for (let i = 0; i < n; i++) {
        const r = radius();
        const bombP = Math.min(0.2, 0.07 + t * 0.002);
        const roll = Math.random();
        let kind = 'fruit', e, col;
        if (roll < bombP) { kind = 'bomb'; e = '💣'; col = '#333'; }
        else if (roll < bombP + 0.045) { kind = 'star'; e = '🌟'; col = '#ffd700'; }
        else { [e, col] = U.pick(FRUITS); }
        const x = rand(W * 0.15, W * 0.85);
        const h = rand(H * 0.45, H * 0.8);
        const flight = 2 * Math.sqrt(2 * h / grav);
        items.push({
          x, y: H + r, r, e, col, kind,
          vx: (rand(W * 0.2, W * 0.8) - x) / flight,
          vy: -Math.sqrt(2 * grav * h),
          a: 0, va: rand(-3, 3),
        });
      }
      Sound.tone(260, 0.08, 'sine', 0.05);
    }

    function slice(it) {
      items.splice(items.indexOf(it), 1);
      if (it.kind === 'bomb') {
        bombs++;
        ctx.add(-30);
        shake = 0.4; flash = 0.3;
        Sound.bad(); U.vibrate(150);
        ctx.popup('💥 -30', it.x, it.y, 'bad');
        return;
      }
      const pts = it.kind === 'star' ? 50 : 10;
      ctx.add(pts);
      cut++; swipeHits++;
      Sound.slice();
      ctx.popup('+' + pts, it.x, it.y - it.r, it.kind === 'star' ? 'gold' : '');
      for (const s of [-1, 1]) {
        pieces.push({
          x: it.x + s * 4, y: it.y, r: it.r, e: it.e, side: s, a: it.a,
          vx: it.vx + s * rand(70, 130), vy: Math.min(it.vy, 0) * 0.4 - rand(40, 120), va: s * rand(2, 5),
        });
      }
      for (let i = 0; i < 12; i++) {
        drops.push({ x: it.x, y: it.y, vx: rand(-220, 220), vy: rand(-260, 60), life: rand(0.3, 0.7), col: it.col, s: rand(3, 7) });
      }
      ctx.info(`🍉 Frutti tagliati: ${cut}`);
    }

    function hitSeg(ax, ay, bx, by, it) {
      const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
      let k = l2 ? ((it.x - ax) * dx + (it.y - ay) * dy) / l2 : 0;
      k = Math.max(0, Math.min(1, k));
      const px = ax + k * dx - it.x, py = ay + k * dy - it.y;
      return px * px + py * py <= it.r * it.r;
    }

    function down(ev) {
      if (!running) return;
      try { cv.c.setPointerCapture(ev.pointerId); } catch (e) { /* niente */ }
      swiping = true; swipeHits = 0;
      lastPt = cv.pos(ev);
      trail = [{ ...lastPt, t: performance.now() }];
      move(ev);
    }
    function move(ev) {
      if (!swiping || !running) return;
      const p = cv.pos(ev);
      trail.push({ ...p, t: performance.now() });
      for (const it of items.slice()) {
        if (hitSeg(lastPt.x, lastPt.y, p.x, p.y, it)) slice(it);
      }
      lastPt = p;
    }
    function up() {
      if (swiping && swipeHits >= 3) {
        const bonus = swipeHits * 10;
        ctx.add(bonus);
        ctx.popup(`Combo x${swipeHits}! +${bonus}`, cv.W / 2, cv.H * 0.3, 'combo');
        Sound.good();
      }
      swiping = false; swipeHits = 0;
    }
    cv.c.addEventListener('pointerdown', down);
    cv.c.addEventListener('pointermove', move);
    cv.c.addEventListener('pointerup', up);
    cv.c.addEventListener('pointercancel', up);

    function update(dt) {
      const grav = gravity();
      t += dt;
      spawnIn -= dt;
      if (spawnIn <= 0) { spawn(); spawnIn = Math.max(0.5, 1.25 - t * 0.012) * rand(0.8, 1.2); }
      for (const o of items) { o.vy += grav * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.a += o.va * dt; }
      items = items.filter(o => !(o.vy > 0 && o.y > cv.H + o.r * 1.5));
      for (const o of pieces) { o.vy += grav * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.a += o.va * dt; }
      pieces = pieces.filter(o => o.y < cv.H + o.r * 2);
      for (const d of drops) { d.vy += grav * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.life -= dt; }
      drops = drops.filter(d => d.life > 0);
      shake = Math.max(0, shake - dt);
      flash = Math.max(0, flash - dt);
    }

    function emoji(e, r) {
      const s = sprite(e, r);
      g.drawImage(s.c, -s.size / 2, -s.size / 2, s.size, s.size);
    }

    function draw() {
      const W = cv.W, H = cv.H;
      background();
      g.save();
      if (shake > 0) g.translate(rand(-8, 8), rand(-8, 8));
      for (const d of drops) {
        g.globalAlpha = Math.min(1, d.life * 2);
        g.fillStyle = d.col;
        g.beginPath(); g.arc(d.x, d.y, d.s, 0, Math.PI * 2); g.fill();
      }
      g.globalAlpha = 1;
      for (const o of pieces) {
        g.save();
        g.translate(o.x, o.y); g.rotate(o.a);
        g.beginPath();
        if (o.side < 0) g.rect(-o.r * 1.4, -o.r * 1.4, o.r * 1.4, o.r * 2.8);
        else g.rect(0, -o.r * 1.4, o.r * 1.4, o.r * 2.8);
        g.clip();
        emoji(o.e, o.r);
        g.restore();
      }
      for (const o of items) {
        g.save();
        g.translate(o.x, o.y); g.rotate(o.a);
        if (o.kind !== 'fruit') {
          // alone colorato: rosso per le bombe, giallo per la stella
          g.fillStyle = o.kind === 'bomb' ? 'rgba(255,45,45,.35)' : 'rgba(255,245,157,.45)';
          g.beginPath(); g.arc(0, 0, o.r * 1.15, 0, Math.PI * 2); g.fill();
        }
        emoji(o.e, o.r);
        g.restore();
      }
      const now = performance.now();
      trail = trail.filter(p => now - p.t < 140);
      if (trail.length > 1) {
        g.lineCap = 'round'; g.lineJoin = 'round';
        for (const [w, col] of [[12, 'rgba(150,255,255,.35)'], [5, 'rgba(255,255,255,.95)']]) {
          g.strokeStyle = col;
          g.lineWidth = w;
          g.beginPath();
          g.moveTo(trail[0].x, trail[0].y);
          for (const p of trail) g.lineTo(p.x, p.y);
          g.stroke();
        }
      }
      g.restore();
      if (flash > 0) { g.fillStyle = `rgba(255,60,60,${flash})`; g.fillRect(0, 0, W, H); }
    }

    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (running) update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }

    ctx.intro({
      title: 'Taglia la Frutta',
      art: '<span class="emo">🍉🔪</span>',
      text: 'Hai 60 secondi! Striscia il dito sulla frutta per tagliarla: <b>+10</b>. La stella 🌟 vale <b>+50</b>. Tagliane 3 in un colpo solo per la <b>Combo</b>! Ma non toccare le bombe 💣 (<b>-30</b>).',
    }, () => {
      running = true;
      ctx.info('🍉 Frutti tagliati: 0');
      ctx.begin();
    });
    last = performance.now();
    raf = requestAnimationFrame(loop);

    return {
      timeUp() {
        running = false;
        ctx.end({
          title: 'Tempo scaduto! ⏰',
          msg: `Hai tagliato <b>${cut}</b> frutti${bombs ? ` e preso <b>${bombs}</b> bomb${bombs > 1 ? 'e' : 'a'}` : ' senza toccare bombe!'}`,
        });
      },
      stop() { running = false; cancelAnimationFrame(raf); cv.dispose(); },
    };
  },
});
